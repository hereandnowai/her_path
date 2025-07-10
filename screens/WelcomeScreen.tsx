import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES, APP_NAME, APP_TAGLINE } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import HerPathLogo from '../../components/common/HerPathLogo.tsx';
import Button from '../../components/common/Button.tsx';

const WelcomeScreen = () => {
  const { translate } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#14746f] p-6">
      <div className="text-center max-w-2xl mx-auto">
        <HerPathLogo size={120} className="mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          {translate('welcomeToHerPath', `Welcome to ${APP_NAME}`)}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl mx-auto">
          {translate('appTagline', APP_TAGLINE)}
        </p>
        <Button 
          as={Link} 
          to={APP_ROUTES.REGISTER} 
          size="lg" 
          variant="secondary"
          className="shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          {translate('getStarted')}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;