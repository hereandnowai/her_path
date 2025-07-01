
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { WomenLaw, Language } from '../../types';
import { womenLawsData } from '../../data/womenLawsData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const LawDetailSection: React.FC<{ titleKey: string; content: WomenLaw['fullForm'] }> = ({ titleKey, content }) => {
  const { translate, language } = useLanguage();
  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-teal-700 mb-2">{translate(titleKey)}</h4>
      <div className="pl-4 space-y-3">
        <div>
          <strong className="text-gray-600">{translate('inEnglish')}:</strong>
          <p className="text-gray-700 text-sm whitespace-pre-line">{content[Language.EN]}</p>
        </div>
        <div>
          <strong className="text-gray-600">{translate('inHindi')}:</strong>
          <p className="text-gray-700 text-sm whitespace-pre-line">{content[Language.HI]}</p>
        </div>
        <div>
          <strong className="text-gray-600">{translate('inTamil')}:</strong>
          <p className="text-gray-700 text-sm whitespace-pre-line">{content[Language.TA]}</p>
        </div>
      </div>
    </div>
  );
};


const WomenLawAwarenessScreen: React.FC = () => {
  const { translate } = useLanguage();
  const [expandedLawId, setExpandedLawId] = useState<string | null>(null);

  const toggleLawExpansion = (lawId: string) => {
    setExpandedLawId(prevId => (prevId === lawId ? null : lawId));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle
        title={translate('womenLawAwarenessTitle')}
        subtitle={translate('womenLawAwarenessSubtitle')}
      />

      {womenLawsData.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">
            {translate('loading')} {/* Or a message like "No laws information available yet." */}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {womenLawsData.map((law) => (
            <Card key={law.id} className="shadow-lg border border-gray-200 overflow-hidden">
              <div 
                className="p-4 md:p-6 cursor-pointer hover:bg-teal-50 flex justify-between items-center"
                onClick={() => toggleLawExpansion(law.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleLawExpansion(law.id)}
                aria-expanded={expandedLawId === law.id}
                aria-controls={`law-details-${law.id}`}
              >
                <h3 className="text-xl font-semibold text-teal-700">
                  {translate(law.lawNameKey, law.lawNameKey.replace('lawName', ''))}
                </h3>
                <i 
                    className={`fas ${expandedLawId === law.id ? 'fa-chevron-up' : 'fa-chevron-down'} text-teal-600 transition-transform duration-300`}
                    aria-hidden="true"
                ></i>
              </div>
              
              {expandedLawId === law.id && (
                <div id={`law-details-${law.id}`} className="p-4 md:p-6 border-t border-gray-200 bg-white">
                  <LawDetailSection titleKey="lawFullForm" content={law.fullForm} />
                  <LawDetailSection titleKey="lawApplicability" content={law.applicability} />
                  <LawDetailSection titleKey="lawCrimesCovered" content={law.crimesCovered} />
                  <LawDetailSection titleKey="lawVictimRights" content={law.victimRights} />
                  <LawDetailSection titleKey="lawPunishmentPenalty" content={law.punishmentPenalty} />
                  <LawDetailSection titleKey="lawRealLifeExample" content={law.realLifeExample} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WomenLawAwarenessScreen;