
import React from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import { useLanguage } from '../../contexts/LanguageContext';
// import SuccessStoryVideoCard from '../../components/inspiration/SuccessStoryVideoCard';
// import { successStories } from '../../data/successStoriesData'; // Import actual data

const SuccessStoriesScreen: React.FC = () => {
  const { translate } = useLanguage();

  // Placeholder: The 'motivationalStories' key might not exist in UI_TEXT yet.
  // If it doesn't, it will fall back to "Motivational Stories".
  // This route APP_ROUTES.MOTIVATIONAL_STORIES was also marked as removed.
  const title = translate('motivationalStories', 'Success Stories'); 

  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle 
        title={title}
        subtitle={translate('appTagline')} // Or a more specific subtitle
      />
      <Card>
        <div className="text-center py-12">
          <i className="fas fa-star text-5xl text-amber-400 dark:text-amber-500 mb-4" aria-hidden="true"></i>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {title} {translate('featureComingSoon', 'feature is under development.')}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {translate('checkBackLater', 'Please check back later for updates.')}
          </p>
          {/* 
          // Example of how you might map through actual stories:
          {successStories && successStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {successStories.map((story) => (
                <SuccessStoryVideoCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-gray-500">
              No success stories are available at the moment. Please check back soon!
            </p>
          )}
          */}
        </div>
      </Card>
    </div>
  );
};

export default SuccessStoriesScreen;