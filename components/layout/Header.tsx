import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { APP_ROUTES, APP_NAME, APP_TAGLINE, NGO_NAME } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
// import { useTheme } from '../../contexts/ThemeContext.tsx'; // useTheme import removed
import CreedLogo from '../common/CreedLogo';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { translate } = useLanguage();
  // const { theme, toggleTheme } = useTheme(); // theme context usage removed

  return (
    <header className="bg-teal-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="text-white mr-4 p-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-white md:hidden"
            aria-label="Open sidebar"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <ReactRouterDOM.Link to={APP_ROUTES.HOME} className="flex items-center space-x-2">
            <CreedLogo size={40} className="text-white" />
            <div>
              <h1 className="text-xl font-bold">{translate('appName', APP_NAME)}</h1>
              <p className="text-xs hidden sm:block opacity-90">{translate('appTagline', APP_TAGLINE)}</p>
            </div>
          </ReactRouterDOM.Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-sm font-semibold hidden lg:block">{translate('ngoName', NGO_NAME)}</span>
           {/* Notifications button removed as it's a "coming soon" placeholder
           <button 
            className="p-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-white"
            title={translate('notifications')}
            aria-label={translate('notifications')}
          >
            <i className="fas fa-bell text-lg"></i>
          </button>
          */}
          {/* Theme Toggle Button Removed */}
        </div>
      </div>
    </header>
  );
};

export default Header;