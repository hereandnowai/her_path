
import React from 'react';
import { AppRecommendation, Language } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

interface AppRecommendationCardProps {
  recommendation: AppRecommendation;
}

const AppRecommendationCard: React.FC<AppRecommendationCardProps> = ({ recommendation }) => {
  const { translate } = useLanguage();

  const getYouTubeEmbedUrl = (videoUrl: string): string | null => {
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

  const videoEmbedUrl = recommendation.howToUseVideoLink ? getYouTubeEmbedUrl(recommendation.howToUseVideoLink) : null;

  return (
    <Card className="flex flex-col h-full shadow-lg border border-gray-200" hoverEffect>
      <div className="p-5">
        <h3 className="text-2xl font-semibold text-teal-700 mb-3">{recommendation.name}</h3>
        
        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-700 mb-1">{translate('usageDescription')}:</h4>
          <p className="text-gray-600 text-sm">{recommendation.usage}</p>
        </div>

        {(recommendation.howToUseVideoLink || recommendation.howToUseText) && (
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">{translate('howToUse')}:</h4>
            {videoEmbedUrl && (
              <div className="aspect-video mb-2">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoEmbedUrl}
                  title={`YouTube video player for ${recommendation.name}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            )}
            {recommendation.howToUseVideoLink && !videoEmbedUrl && (
                 <Button 
                    as="a" 
                    href={recommendation.howToUseVideoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    variant="link"
                    size="sm"
                    className="mb-2 text-sm"
                    leftIcon={<i className="fas fa-video"></i>}
                >
                    {translate('watchVideoGuide')}
                </Button>
            )}
            {recommendation.howToUseText && (
              <p className="text-gray-600 text-sm whitespace-pre-line bg-gray-50 p-2 rounded">
                {recommendation.howToUseText}
              </p>
            )}
          </div>
        )}

        <div className="mb-4">
            <Button 
                as="a" 
                href={recommendation.officialLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                variant="secondary"
                size="sm"
                className="w-full"
                leftIcon={<i className="fas fa-external-link-alt"></i>}
            >
                {translate('visitWebsite')} - {recommendation.name}
            </Button>
        </div>
        
        {recommendation.benefits && recommendation.benefits.length > 0 && (
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-1">{translate('benefits')}:</h4>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 pl-4">
              {recommendation.benefits.map((benefit, index) => (
                <li key={index}><i className="fas fa-check-circle text-green-500 mr-2"></i>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendation.safetyTips && recommendation.safetyTips.length > 0 && (
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <h4 className="text-md font-semibold text-amber-700 mb-1">{translate('safetyTips')}:</h4>
            <ul className="list-disc list-inside text-amber-600 text-sm space-y-1 pl-4">
              {recommendation.safetyTips.map((tip, index) => (
                <li key={index}><i className="fas fa-exclamation-triangle text-amber-500 mr-2"></i>{tip}</li>
              ))}
            </ul>
          </div>
        )}
         {recommendation.rawResponse && (
            <details className="mt-4 text-xs text-gray-500">
                <summary>View Raw AI Data (Debug)</summary>
                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded max-h-48 overflow-y-auto">{recommendation.rawResponse}</pre>
            </details>
        )}
      </div>
    </Card>
  );
};

export default AppRecommendationCard;