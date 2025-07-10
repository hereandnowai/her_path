


import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_ROUTES, APP_NAME } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import HerPathLogo from '../common/HerPathLogo';
import { Language } from '../../types';
import Button from '../common/Button';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavItem: React.FC<{ to: string; icon: string; labelKey: string; onClick?: () => void }> = ({ to, icon, labelKey, onClick }) => {
  const { translate } = useLanguage();
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-lg hover:bg-teal-700 rounded-md transition-colors duration-150 ${
          isActive ? 'bg-teal-700 font-semibold' : ''
        }`
      }
    >
      <i className={`fas ${icon} w-6 mr-3`}></i>
      {translate(labelKey)}
    </NavLink>
  );
};

const NavGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-teal-200 tracking-wider">{title}</h3>
    {children}
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { translate, language, setLanguage } = useLanguage();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.LOGIN);
    if (window.innerWidth < 768) { // Close sidebar on mobile after action
        toggleSidebar();
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };
  
  const handleNavItemClick = () => {
    if (window.innerWidth < 768) { // Close sidebar on mobile after navigation
        toggleSidebar();
    }
  }

  const handleProfileClick = () => {
    navigate(APP_ROUTES.PROFILE);
    handleNavItemClick();
  }

  const navLinks = {
      main: [
        { to: APP_ROUTES.HOME, icon: 'fa-home', labelKey: 'home' },
      ],
      empowerment: [
        { to: APP_ROUTES.SMART_PATHWAY, icon: 'fa-route', labelKey: 'smartPathway' },
        { to: APP_ROUTES.DOCUMENT_PAL, icon: 'fa-file-alt', labelKey: 'documentPal' },
      ],
      learning: [
        { to: APP_ROUTES.WOMEN_AWARENESS, icon: 'fa-venus', labelKey: 'womenAwareness' },
        { to: APP_ROUTES.WOMEN_LAW_AWARENESS, icon: 'fa-gavel', labelKey: 'womenLawAwarenessTitle' },
        { to: APP_ROUTES.AWARENESS_LIFE_SKILLS, icon: 'fa-lightbulb', labelKey: 'awarenessLifeSkills' },
        { to: APP_ROUTES.LEARN_TO_USE_APPS, icon: 'fa-mobile-alt', labelKey: 'learnToUseApps' },
      ],
      engagement: [
        { to: APP_ROUTES.SUCCESS_STORIES, icon: 'fa-star', labelKey: 'successStories' },
        { to: APP_ROUTES.BRAIN_QUIZZES, icon: 'fa-brain', labelKey: 'brainQuizzes' },
      ],
      support: [
        { to: APP_ROUTES.EMERGENCY_CONTACTS, icon: 'fa-phone-alt', labelKey: 'emergencyContacts' },
        { to: APP_ROUTES.HELP, icon: 'fa-question-circle', labelKey: 'helpSupport' },
        { to: APP_ROUTES.SETTINGS, icon: 'fa-cog', labelKey: 'settings' },
      ]
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-teal-600 text-white w-72 p-5 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:w-72 transition-transform duration-300 ease-in-out z-40 shadow-lg flex flex-col`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between mb-2 md:justify-center">
          <Link to={APP_ROUTES.HOME} className="flex items-center space-x-2" onClick={handleNavItemClick}>
            <HerPathLogo size={50} />
            <span className="text-2xl font-bold">{translate('appName', APP_NAME)}</span>
          </Link>
          <button onClick={toggleSidebar} className="md:hidden text-white p-2 hover:bg-teal-700 rounded-md" aria-label="Close sidebar">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {/* Language Switcher */}
        <div className="mb-4 px-2">
            <label htmlFor="sidebarLanguageSelect" className="sr-only">{translate('selectLanguage')}</label>
            <select
                id="sidebarLanguageSelect"
                value={language}
                onChange={handleLanguageChange}
                className="w-full p-2.5 text-base bg-teal-700 border border-teal-500 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-white text-white"
            >
                <option value={Language.EN} className="bg-white text-black">English</option>
                <option value={Language.HI} className="bg-white text-black">हिन्दी (Hindi)</option>
                <option value={Language.TA} className="bg-white text-black">தமிழ் (Tamil)</option>
            </select>
        </div>
        
        {user && (
          <div className="mb-4 p-3 bg-teal-700 rounded-lg text-center">
            <img src={user.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.name)}`} alt="User profile" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-teal-500" />
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm text-teal-200">{user.email}</p>
            <Button onClick={handleProfileClick} variant="link" size="sm" className="!text-white !hover:text-teal-200 mt-2">
                {translate('profile')}
            </Button>
          </div>
        )}

        <nav className="flex-grow overflow-y-auto space-y-1 pr-1 pb-2" role="navigation">
           <NavGroup title="Main">
             {navLinks.main.map(link => <NavItem key={link.to} {...link} onClick={handleNavItemClick} />)}
           </NavGroup>
           <NavGroup title="Empowerment Tools">
             {navLinks.empowerment.map(link => <NavItem key={link.to} {...link} onClick={handleNavItemClick} />)}
           </NavGroup>
            <NavGroup title="Awareness & Learning">
             {navLinks.learning.map(link => <NavItem key={link.to} {...link} onClick={handleNavItemClick} />)}
           </NavGroup>
            <NavGroup title="Engagement">
             {navLinks.engagement.map(link => <NavItem key={link.to} {...link} onClick={handleNavItemClick} />)}
           </NavGroup>
            <NavGroup title="Support">
             {navLinks.support.map(link => <NavItem key={link.to} {...link} onClick={handleNavItemClick} />)}
           </NavGroup>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-lg bg-red-500 hover:bg-red-600 rounded-md transition-colors duration-150"
          >
            <i className="fas fa-sign-out-alt w-6 mr-3"></i>
            {translate('logout')}
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-teal-500 text-center">
          <p className="text-xs text-teal-200">
            Developed by RASHINI S [AI PRODUCT ENGINEER ] HEREANDNOW AI RESEARCH INSTITUTE
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;