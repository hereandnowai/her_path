

import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { WomenLaw, Language } from '../../types';
import { womenLawsData } from '../../data/womenLawsData';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { usePdfDownloader } from '../../hooks/usePdfDownloader.ts';
import DownloadButton from '../../components/common/DownloadButton.tsx';

const LawDetailSection: React.FC<{ titleKey: string; content: WomenLaw['fullForm'] }> = ({ titleKey, content }) => {
  const { translate } = useLanguage();
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
  
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { downloadPdf, isDownloading } = usePdfDownloader();

  const handleDownload = (lawId: string, lawNameKey: string) => {
    const lawName = translate(lawNameKey, lawId);
    downloadPdf(contentRefs.current[lawId], `HerPath_Law_Awareness_${lawName.replace(/\s/g, '_')}`);
  };

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
              <details open={expandedLawId === law.id}>
                <summary
                    className="p-4 md:p-6 cursor-pointer hover:bg-teal-50 flex justify-between items-center list-none"
                    onClick={(e) => { e.preventDefault(); toggleLawExpansion(law.id); }}
                    role="button"
                    tabIndex={0}
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
                </summary>
              
                <div id={`law-details-${law.id}`} className="p-4 md:p-6 border-t border-gray-200 bg-white">
                  <div ref={el => { contentRefs.current[law.id] = el; }} className="p-4 bg-white rounded-lg">
                    <h3 className="text-2xl font-semibold text-teal-800 mb-4">
                        {translate(law.lawNameKey, law.lawNameKey.replace('lawName', ''))}
                    </h3>
                    <LawDetailSection titleKey="lawFullForm" content={law.fullForm} />
                    <LawDetailSection titleKey="lawApplicability" content={law.applicability} />
                    <LawDetailSection titleKey="lawCrimesCovered" content={law.crimesCovered} />
                    <LawDetailSection titleKey="lawVictimRights" content={law.victimRights} />
                    <LawDetailSection titleKey="lawPunishmentPenalty" content={law.punishmentPenalty} />
                    <LawDetailSection titleKey="lawRealLifeExample" content={law.realLifeExample} />
                  </div>
                  <div className="text-right mt-4">
                      <DownloadButton onClick={() => handleDownload(law.id, law.lawNameKey)} isLoading={isDownloading} className="!mt-0"/>
                  </div>
                </div>
              </details>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WomenLawAwarenessScreen;