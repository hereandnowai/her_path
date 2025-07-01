import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
// import { useTheme } from '../../contexts/ThemeContext.tsx'; // useTheme import removed
import { Language } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SectionTitle from '../../components/common/SectionTitle';

const SettingsScreen: React.FC = () => {
  const { language, setLanguage, translate } = useLanguage();
  // const { theme, setTheme } = useTheme(); // theme state and functions removed
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('herPathNotifications') === 'true'
  );

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const handleNotificationToggle = () => {
    const newSetting = !notificationsEnabled;
    setNotificationsEnabled(newSetting);
    localStorage.setItem('herPathNotifications', String(newSetting));
    alert(`Push notifications ${newSetting ? 'enabled' : 'disabled'}. (This is a simulation)`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <SectionTitle title={translate('settings')} />

      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">{translate('language')}</h3>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
        >
          <option value={Language.EN} className="bg-white text-black">English</option>
          <option value={Language.HI} className="bg-white text-black">हिन्दी (Hindi)</option>
          <option value={Language.TA} className="bg-white text-black">தமிழ் (Tamil)</option>
        </select>
      </Card>

      {/* App Theme Card Removed */}

      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">{translate('notifications')}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg text-gray-600">{translate('enablePushNotifications')}</span>
          <label htmlFor="notificationToggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="notificationToggle" 
                className="sr-only peer" 
                checked={notificationsEnabled}
                onChange={handleNotificationToggle}
              />
              <div className="block bg-gray-300 peer-checked:bg-teal-500 w-14 h-8 rounded-full transition"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:transform peer-checked:translate-x-6"></div>
            </div>
          </label>
        </div>
        {notificationsEnabled && <p className="text-sm text-green-600 mt-2">You will receive updates and opportunities.</p> }
        {!notificationsEnabled && <p className="text-sm text-gray-500 mt-2">You might miss important updates.</p> }
      </Card>

      {/* Voice Navigation Card Removed as it's "coming soon"
       <Card>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Voice Navigation (Beta)</h3>
        <p className="text-gray-600 mb-2">Enable voice commands to navigate the app. (Feature coming soon)</p>
        <Button variant="secondary" disabled>Enable Voice Navigation</Button>
      </Card>
      */}
    </div>
  );
};

export default SettingsScreen;