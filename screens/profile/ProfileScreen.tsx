
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import SectionTitle from '../../components/common/SectionTitle';
import { User } from '../../types';

export const ProfileScreen: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { translate } = useLanguage();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber || '');
      setProfilePictureUrl(user.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.name)}`);
    }
  }, [user]);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      setProfilePictureUrl(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setMessage('');
    setError('');

    if (phoneNumber && !/^\+?[0-9\s-]{10,15}$/.test(phoneNumber)) {
        setError("Please enter a valid phone number.");
        return;
    }

    try {
      const updatedUserData: Partial<User> = {
        name,
        email,
        phoneNumber,
        // The `profilePictureUrl` from the component's state is the source of truth for the UI.
        // It holds either the original URL, a new temporary blob URL, or the DiceBear fallback URL.
        // It is initialized to never be undefined, so it's safe to use for the update.
        profilePictureUrl: profilePictureUrl
      };
      
      await updateUserProfile(updatedUserData);
      
      setMessage(translate('profileUpdated'));
      setIsEditing(false);
      setProfilePictureFile(null); // Clear file input state after update
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
       console.error("Failed to update profile", err);
       setError(`Failed to save changes. Please try again. ${err.message || ''}`);
    }
  };

  if (!user) {
    return <p>{translate('loading')}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle title={translate('profile')} />
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0 text-center">
            <img 
              src={profilePictureUrl} 
              alt="Profile" 
              className="w-40 h-40 rounded-full object-cover shadow-lg mx-auto"
            />
            {isEditing && (
              <div className="mt-4">
                <label htmlFor="profilePictureInput" className="cursor-pointer bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 text-sm block">
                  {translate('changePhoto')}
                </label>
                <input 
                  type="file" 
                  id="profilePictureInput" 
                  accept="image/*" 
                  onChange={handlePictureChange} 
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="flex-grow w-full">
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">{translate('name')}</label>
                  <p className="text-xl text-gray-800">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">{translate('email')}</label>
                  <p className="text-xl text-gray-800">{user.email}</p>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-500">{translate('phoneNumber')}</label>
                  <p className="text-xl text-gray-800">{user.phoneNumber || 'Not provided'}</p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="mt-4" leftIcon={<i className="fas fa-edit"></i>}>
                  {translate('editProfile')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="name"
                  label={translate('name')}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  id="email"
                  label={translate('email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  id="phoneNumber"
                  label={translate('phoneNumber')}
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Your mobile number (optional)"
                />
                <div className="flex space-x-4 mt-6">
                  <Button type="submit" leftIcon={<i className="fas fa-save"></i>}>{translate('save')}</Button>
                  <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); setMessage(''); setError(''); }}>
                    {translate('cancel')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
