
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { db } from '../firebase';
import { ref, set, get } from 'firebase/database';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUserProfile: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedUserString = localStorage.getItem('herPathUser');
      if (storedUserString) {
        try {
          const storedUser: User = JSON.parse(storedUserString);
          // Fetch the latest profile from Firebase to keep it synced
          const userProfileRef = ref(db, `users/${storedUser.id}/profile`);
          const snapshot = await get(userProfileRef);
          if (snapshot.exists()) {
            const dbUser = snapshot.val();
            const syncedUser = { ...storedUser, ...dbUser };
            setUser(syncedUser);
            localStorage.setItem('herPathUser', JSON.stringify(syncedUser));
          } else {
            // If no profile in DB, use localStorage version
            setUser(storedUser);
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse or sync user data", error);
          localStorage.removeItem('herPathUser');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (userData: User) => {
    try {
      const userProfileRef = ref(db, `users/${userData.id}/profile`);
      const snapshot = await get(userProfileRef);
      const finalUserData = snapshot.exists() ? { ...userData, ...snapshot.val() } : userData;
      
      // Save/update the complete profile in Firebase
      await set(userProfileRef, finalUserData);
      
      setUser(finalUserData);
      setIsAuthenticated(true);
      localStorage.setItem('herPathUser', JSON.stringify(finalUserData));
    } catch (error) {
      console.error("Failed to save user profile to Firebase on login", error);
      // Fallback to local-only for this session if DB fails
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('herPathUser', JSON.stringify(userData));
    }
  };

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user) {
      throw new Error("No user is currently logged in to update.");
    }
    try {
      const updatedUser: User = { ...user, ...updatedData };
      const userProfileRef = ref(db, `users/${user.id}/profile`);
      
      // Set will overwrite the entire profile object with the updated data
      await set(userProfileRef, updatedUser);
      
      setUser(updatedUser);
      localStorage.setItem('herPathUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update user profile in Firebase", error);
      throw error; // Re-throw to be caught in the UI
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('herPathUser');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-[#FFF1F5]">
        <p className="text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};