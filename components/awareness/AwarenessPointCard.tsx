
import React from 'react';
import { AwarenessPoint } from '../../types';
import Card from '../common/Card';
import { useLanguage } from '../../contexts/LanguageContext';

interface AwarenessPointCardProps {
  point: AwarenessPoint;
}

const AwarenessPointCard: React.FC<AwarenessPointCardProps> = ({ point }) => {
  const { translate } = useLanguage();
  // Placeholder image URL removed: const placeholderImageUrl = `https://picsum.photos/seed/${encodeURIComponent(point.imageSuggestion.slice(0,20) + point.id)}/300/200`;

  return (
    <Card className="flex flex-col h-full shadow-lg border border-gray-100 bg-white" hoverEffect>
      <div className="p-5 text-center">
        <div className="text-5xl mb-3" aria-hidden="true">{point.emoji}</div>
        <p className="text-gray-700 text-base mb-4 leading-relaxed">{point.awarenessText}</p>
        
        <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold text-teal-600 mb-2">{translate('imageSuggestion')}:</h4>
            {/* Removed img tag that used placeholderImageUrl */}
            <p className="text-xs text-gray-500 italic p-2 bg-gray-50 rounded">{point.imageSuggestion}</p>
        </div>
        {point.rawResponse && (
            <details className="mt-4 text-xs text-gray-400 text-left">
                <summary className="cursor-pointer">View Raw AI Data (Debug)</summary>
                <pre className="whitespace-pre-wrap bg-gray-50 p-1 rounded max-h-32 overflow-y-auto">{point.rawResponse}</pre>
            </details>
        )}
      </div>
    </Card>
  );
};

export default AwarenessPointCard;