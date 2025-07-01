
import React from 'react';
import Card from '../common/Card';
import { useLanguage } from '../../contexts/LanguageContext';
// Assuming SuccessStory type might be imported from data if it's used directly
// import { SuccessStory } from '../../data/successStoriesData';

// Placeholder props, can be aligned with SuccessStory interface from data
interface SuccessStoryVideoCardProps {
  story?: { // Simplified inline or use imported SuccessStory
    id: string;
    title: { [lang: string]: string };
    description: { [lang: string]: string };
    videoUrl?: string;
    imageUrl?: string;
  };
  className?: string;
}

const SuccessStoryVideoCard: React.FC<SuccessStoryVideoCardProps> = ({ story, className }) => {
  const { language, translate } = useLanguage();
  const currentTitle = story?.title?.[language] || story?.title?.['en'] || translate('loading', 'Loading title...');
  const currentDescription = story?.description?.[language] || story?.description?.['en'] || translate('loading', 'Loading description...');

  const getYouTubeEmbedUrl = (videoUrl?: string): string | null => {
    if (!videoUrl) return null;
    try {
      const url = new URL(videoUrl);
      let videoId = null;
      if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
        videoId = url.searchParams.get('v');
      } else if (url.hostname === 'youtu.be') {
        videoId = url.pathname.substring(1);
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      console.error("Invalid video URL for embed:", videoUrl, e);
      return null;
    }
  };

  const videoEmbedUrl = getYouTubeEmbedUrl(story?.videoUrl);

  return (
    <Card className={`flex flex-col h-full shadow-lg ${className}`}>
      <div className="p-5">
        {story?.imageUrl && !videoEmbedUrl && (
          <img src={story.imageUrl} alt={currentTitle} className="w-full h-48 object-cover rounded-t-md mb-4" />
        )}
        {videoEmbedUrl && (
          <div className="aspect-video mb-4">
            <iframe
              width="100%"
              height="100%"
              src={videoEmbedUrl}
              title={currentTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        )}
        <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-400 mb-2">{currentTitle}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
          {currentDescription}
        </p>
      </div>
      <div className="mt-auto p-5 border-t border-gray-200 dark:border-slate-700">
        <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold text-sm">
          {translate('viewDetails', 'View Details')} <i className="fas fa-arrow-right text-xs ml-1"></i>
        </button>
      </div>
    </Card>
  );
};

export default SuccessStoryVideoCard;