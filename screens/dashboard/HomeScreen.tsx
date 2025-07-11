
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import SectionTitle from '../../components/common/SectionTitle';

interface QuickLinkItemProps {
  to: string;
  icon: string;
  labelKey: string;
  bgColor: string; // e.g. 'bg-teal-500'
}

const QuickLinkItem: React.FC<QuickLinkItemProps> = ({ to, icon, labelKey, bgColor }) => {
  const { translate } = useLanguage();
  return (
    <Link to={to} className="block group">
      <Card className={`text-center ${bgColor} text-white hover:opacity-90`} hoverEffect>
        <i className={`fas ${icon} text-4xl mb-3 block`}></i>
        <span className="text-lg font-semibold">{translate(labelKey)}</span>
      </Card>
    </Link>
  );
}

const HomeScreen: React.FC = () => {
  const { translate } = useLanguage();
  const { user } = useAuth();

  const quickLinks: QuickLinkItemProps[] = [
    { to: APP_ROUTES.SMART_PATHWAY, icon: 'fa-route', labelKey: 'smartPathway', bgColor: 'bg-teal-500' },
    { to: APP_ROUTES.WOMEN_AWARENESS, icon: 'fa-venus', labelKey: 'womenAwareness', bgColor: 'bg-pink-500' },
    { to: APP_ROUTES.SUCCESS_STORIES, icon: 'fa-star', labelKey: 'successStories', bgColor: 'bg-amber-500' },
    { to: APP_ROUTES.LEARN_TO_USE_APPS, icon: 'fa-mobile-alt', labelKey: 'learnToUseApps', bgColor: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-8">
      <SectionTitle 
        title={`${translate('welcomeToHerPath').split(' ')[0]} ${user?.name?.split(' ')[0] || 'User'}!`} 
        subtitle={translate('appTagline')} 
      />

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map(link => (
          <QuickLinkItem key={link.to} {...link} />
        ))}
      </div>

      {/* Call to action for Brain Quizzes and Law Awareness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={translate('brainQuizzes')} hoverEffect className="bg-purple-50">
          <p className="text-gray-600 mb-4">Challenge yourself with fun quizzes and test your knowledge!</p>
          <Link to={APP_ROUTES.BRAIN_QUIZZES} className="text-purple-600 hover:text-purple-700 font-semibold">
            {translate('brainQuizzesTitle')} <i className="fas fa-arrow-right text-xs ml-1"></i>
          </Link>
        </Card>
         <Card title={translate('womenLawAwarenessTitle')} hoverEffect className="bg-indigo-50">
          <p className="text-gray-600 mb-4">Learn about important laws that protect and empower women in India.</p>
          <Link to={APP_ROUTES.WOMEN_LAW_AWARENESS} className="text-indigo-600 hover:text-indigo-700 font-semibold">
            {translate('womenLawAwareness')} <i className="fas fa-arrow-right text-xs ml-1"></i>
          </Link>
        </Card>
      </div>

      {/* A generic inspirational card or important notice can be placed here */}
      <Card className="bg-emerald-50 border-l-4 border-emerald-500">
        <div className="flex items-start">
          <i className="fas fa-bullhorn text-emerald-500 text-3xl mr-4 mt-1"></i>
          <div>
            <p className="text-lg text-gray-700">
              Explore all available resources and take the first step towards your goals today!
            </p>
            <p className="text-right text-gray-500 mt-2">- HerPath Team</p>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default HomeScreen;
