
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
// import { ThemeProvider } from './contexts/ThemeContext.tsx'; // ThemeProvider import removed
import MainLayout from './components/layout/MainLayout.tsx';
import WelcomeScreen from './screens/WelcomeScreen.tsx';
import RegistrationScreen from './screens/auth/RegistrationScreen.tsx';
import LoginScreen from './screens/auth/LoginScreen.tsx';
import HomeScreen from './screens/dashboard/HomeScreen.tsx'; 
// ProfileScreen import removed as route is removed for now
import SettingsScreen from './screens/settings/SettingsScreen.tsx';

// Updated imports for placeholder screens:
import { 
  EmergencyContactsScreen,
  HelpScreen,
} from './screens/PlaceholderScreen.tsx'; 

import AwarenessLifeSkillsScreen from './screens/awareness/AwarenessLifeSkillsScreen.tsx';
import { WomenAwarenessScreen } from './screens/awareness/WomenAwarenessScreen.tsx'; // Changed to named import
import WomenLawAwarenessScreen from './screens/awareness/WomenLawAwarenessScreen.tsx';
import LearnToUseAppsScreen from './screens/digitalLearning/LearnToUseAppsScreen.tsx';
import GuidancePathwayScreen from './screens/guidance/GuidancePathwayScreen.tsx';
import BrainQuizzesScreen from './screens/games/BrainQuizzesScreen.tsx'; 
import { APP_ROUTES } from './constants.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <ReactRouterDOM.Navigate to={APP_ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    // <ThemeProvider> {/* ThemeProvider wrapper removed */}
      <LanguageProvider>
        <AuthProvider>
          <ReactRouterDOM.HashRouter>
            <ReactRouterDOM.Routes>
              <ReactRouterDOM.Route path={APP_ROUTES.WELCOME} element={<WelcomeScreen />} />
              <ReactRouterDOM.Route path={APP_ROUTES.REGISTER} element={<RegistrationScreen />} />
              <ReactRouterDOM.Route path={APP_ROUTES.LOGIN} element={<LoginScreen />} />
              
              <ReactRouterDOM.Route 
                path={APP_ROUTES.HOME} 
                element={
                  <ProtectedRoute>
                    <MainLayout><HomeScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
               <ReactRouterDOM.Route 
                path={APP_ROUTES.SETTINGS} 
                element={
                  <ProtectedRoute>
                    <MainLayout><SettingsScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
               <ReactRouterDOM.Route 
                path={APP_ROUTES.WOMEN_AWARENESS} // This is for age-specific awareness
                element={
                  <ProtectedRoute>
                    <MainLayout><WomenAwarenessScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <ReactRouterDOM.Route 
                path={APP_ROUTES.WOMEN_LAW_AWARENESS} // New route for Law Awareness
                element={
                  <ProtectedRoute>
                    <MainLayout><WomenLawAwarenessScreen /></MainLayout> 
                  </ProtectedRoute>
                } 
              />
              {/* SCHEMES_BENEFITS Route Removed 
              <ReactRouterDOM.Route 
                path={APP_ROUTES.SCHEMES_BENEFITS} 
                element={
                  <ProtectedRoute>
                    <MainLayout><GovernmentSchemesScreen /></MainLayout> 
                  </ProtectedRoute>
                } 
              />
              */}
              <ReactRouterDOM.Route 
                path={APP_ROUTES.BRAIN_QUIZZES} 
                element={
                  <ProtectedRoute>
                    <MainLayout><BrainQuizzesScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <ReactRouterDOM.Route 
                path={APP_ROUTES.EMERGENCY_CONTACTS} 
                element={
                  <ProtectedRoute>
                    <MainLayout><EmergencyContactsScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
               <ReactRouterDOM.Route 
                path={APP_ROUTES.HELP} 
                element={
                  <ProtectedRoute>
                    <MainLayout><HelpScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
               <ReactRouterDOM.Route 
                path={APP_ROUTES.SMART_PATHWAY}
                element={
                  <ProtectedRoute>
                    <MainLayout><GuidancePathwayScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <ReactRouterDOM.Route 
                path={APP_ROUTES.AWARENESS_LIFE_SKILLS} 
                element={
                  <ProtectedRoute>
                    <MainLayout><AwarenessLifeSkillsScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <ReactRouterDOM.Route 
                path={APP_ROUTES.LEARN_TO_USE_APPS} 
                element={
                  <ProtectedRoute>
                    <MainLayout><LearnToUseAppsScreen /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <ReactRouterDOM.Route path="*" element={<ReactRouterDOM.Navigate to={APP_ROUTES.WELCOME} replace />} />
            </ReactRouterDOM.Routes>
          </ReactRouterDOM.HashRouter>
        </AuthProvider>
      </LanguageProvider>
    // </ThemeProvider> // ThemeProvider wrapper removed
  );
};

export default App;
