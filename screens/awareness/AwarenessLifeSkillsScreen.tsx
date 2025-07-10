

import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../types';
import { usePdfDownloader } from '../../hooks/usePdfDownloader.ts';
import DownloadButton from '../../components/common/DownloadButton.tsx';


interface TopicItem {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface ParsedContent {
  introduction: string;
  dos: string[];
  donts: string[];
  firstStep: string;
  quote: string;
}

const AwarenessLifeSkillsScreen: React.FC = () => {
  const { translate, language } = useLanguage();
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [topicContent, setTopicContent] = useState<{ [key: string]: { loading: boolean; error: string | null; content: ParsedContent | null } }>({});

  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { downloadPdf, isDownloading } = usePdfDownloader();

  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

  const topics: TopicItem[] = [
    { id: 'mentalWellbeing', title: 'Mental Well-being', icon: 'fa-brain', description: 'Tips for managing stress, building resilience, and seeking emotional support.' },
    { id: 'physicalHealth', title: 'Physical Health & Nutrition', icon: 'fa-running', description: 'Information on healthy eating, exercise, and hygiene.' },
    { id: 'menstrualHealth', title: 'Menstrual Health Management', icon: 'fa-calendar-alt', description: 'Understanding and managing menstruation with dignity.' },
    { id: 'safetyRights', title: 'Safety, Consent & Rights', icon: 'fa-shield-alt', description: 'Guidance on personal safety, consent, and knowing your rights.' },
    { id: 'financialLiteracy', title: 'Basic Financial Literacy', icon: 'fa-rupee-sign', description: 'Learn to manage money, save, and plan for the future.' },
    { id: 'parentingSkills', title: 'Basic Parenting Skills', icon: 'fa-baby', description: 'Resources for young mothers or those in caregiving roles.' },
  ];
  
  const parseGeneratedContent = (text: string): ParsedContent | null => {
    const content: ParsedContent = { introduction: '', dos: [], donts: [], firstStep: '', quote: '' };
    let currentSection: keyof ParsedContent | null = null;

    text.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (trimmedLine.startsWith('[INTRODUCTION]')) {
            currentSection = 'introduction';
        } else if (trimmedLine.startsWith('[DO]')) {
            currentSection = 'dos';
        } else if (trimmedLine.startsWith('[DON\'T]')) {
            currentSection = 'donts';
        } else if (trimmedLine.startsWith('[FIRST_STEP]')) {
            currentSection = 'firstStep';
        } else if (trimmedLine.startsWith('[QUOTE]')) {
            currentSection = 'quote';
        } else if (currentSection) {
            const cleanLine = trimmedLine.replace(/^- /, '');
            if (currentSection === 'dos' || currentSection === 'donts') {
                content[currentSection].push(cleanLine);
            } else {
                 content[currentSection] = (content[currentSection] ? content[currentSection] + '\n' + cleanLine : cleanLine).trim();
            }
        }
    });

    if (content.introduction || content.dos.length > 0 || content.firstStep) {
        return content;
    }
    return null;
  }

  const fetchLifeSkillDetails = useCallback(async (topicId: string, topicTitle: string) => {
    if (topicContent[topicId]?.content || topicContent[topicId]?.loading) return;

    if (!apiKey || apiKey === "MISSING_API_KEY") {
        setTopicContent(prev => ({ ...prev, [topicId]: { loading: false, error: "API Key is missing. Cannot fetch details.", content: null } }));
        return;
    }

    setTopicContent(prev => ({ ...prev, [topicId]: { loading: true, error: null, content: null } }));

    const langName = language === Language.HI ? "Hindi" : language === Language.TA ? "Tamil" : "Simple English";
    const systemInstruction = `
You are Jagriti AI, an expert and empathetic guide for the HerPath app by CREED NGO. Your audience is women and girls in India, many with low literacy. Your tone must be extremely simple, encouraging, and supportive.

Your task is to provide detailed, actionable information on a specific life skill topic.
The topic is: "${topicTitle}".
The language MUST be: ${langName}.

Provide the output in the following structured format. Use the exact tags like [INTRODUCTION].

[INTRODUCTION]
(A brief, simple, and encouraging 1-2 sentence introduction to the topic.)

[DO]
- (A practical, easy-to-do tip.)
- (Another practical tip.)
- (A third practical tip.)

[DON'T]
- (A simple thing to avoid, explained gently.)
- (Another thing to avoid.)

[FIRST_STEP]
(One very small, concrete, actionable first step the user can take today. Make it sound very achievable.)

[QUOTE]
"(A short, motivational quote relevant to the topic.)"
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: `Generate life skills content for the topic "${topicTitle}" in ${langName}.`,
            config: {
                systemInstruction,
                temperature: 0.5,
            }
        });

        const responseText = response.text;
        const parsed = parseGeneratedContent(responseText);
        
        if (parsed) {
             setTopicContent(prev => ({ ...prev, [topicId]: { loading: false, error: null, content: parsed } }));
        } else {
            throw new Error("Failed to parse the generated content from the AI.");
        }
       
    } catch (err: any) {
        console.error(`Error fetching details for ${topicTitle}:`, err);
        setTopicContent(prev => ({ ...prev, [topicId]: { loading: false, error: `Could not load details. Please try again. (${err.message})`, content: null } }));
    }
  }, [language, apiKey, topicContent]);

  const handleTopicToggle = (topicId: string, topicTitle: string) => {
    const newExpandedTopicId = expandedTopicId === topicId ? null : topicId;
    setExpandedTopicId(newExpandedTopicId);
    if (newExpandedTopicId) {
        fetchLifeSkillDetails(newExpandedTopicId, topicTitle);
    }
  };
  
  const handleDownload = (topicId: string, topicTitle: string) => {
    downloadPdf(contentRefs.current[topicId], `HerPath_LifeSkill_${topicTitle.replace(/\s/g, '_')}`);
  };
  
  const renderTopicContent = (topicId: string) => {
    const topicState = topicContent[topicId];
    if (!topicState) return null;

    if (topicState.loading) {
        return <div className="p-4 text-center"><i className="fas fa-spinner fa-spin text-teal-500 text-2xl"></i><p className="text-sm text-gray-600 mt-2">Loading details...</p></div>;
    }
    if (topicState.error) {
        return <div className="p-4 text-center text-red-600 bg-red-50 rounded-md">{topicState.error}</div>;
    }
    if (topicState.content) {
        const { introduction, dos, donts, firstStep, quote } = topicState.content;
        return (
            <div className="space-y-4">
                {introduction && <p className="text-gray-700">{introduction}</p>}
                
                {dos.length > 0 && (
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        <h4 className="font-semibold text-green-800 flex items-center"><i className="fas fa-check-circle mr-2"></i>Things To Do</h4>
                        <ul className="list-disc list-inside pl-2 mt-1 text-green-700 text-sm space-y-1">
                            {dos.map((item, index) => <li key={`do-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}

                {donts.length > 0 && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <h4 className="font-semibold text-red-800 flex items-center"><i className="fas fa-times-circle mr-2"></i>Things To Avoid</h4>
                        <ul className="list-disc list-inside pl-2 mt-1 text-red-700 text-sm space-y-1">
                            {donts.map((item, index) => <li key={`dont-${index}`}>{item}</li>)}
                        </ul>
                    </div>
                )}
                
                {firstStep && (
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <h4 className="font-semibold text-blue-800 flex items-center"><i className="fas fa-shoe-prints mr-2"></i>Your First Step</h4>
                        <p className="mt-1 text-blue-700 text-sm">{firstStep}</p>
                    </div>
                )}

                {quote && (
                    <blockquote className="p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-800 italic text-sm text-center">
                        "{quote}"
                    </blockquote>
                )}
            </div>
        );
    }
    return null;
  }

  return (
    <div>
      <SectionTitle title={translate('awarenessLifeSkills')} subtitle="Explore resources for holistic well-being and empowerment." />
      <div className="space-y-6">
        {topics.map((topic) => (
          <Card key={topic.id} className="shadow-lg p-0 overflow-hidden">
            <details open={expandedTopicId === topic.id}>
                <summary
                    className="cursor-pointer list-none flex items-center justify-between p-4 hover:bg-teal-50"
                    onClick={(e) => { e.preventDefault(); handleTopicToggle(topic.id, topic.title); }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedTopicId === topic.id}
                >
                    <div className="flex items-center">
                    <i className={`fas ${topic.icon} text-2xl text-teal-600 mr-4 w-8 text-center`}></i>
                    <div>
                        <h3 className="text-xl font-semibold text-teal-700">{topic.title}</h3>
                        <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>
                    </div>
                    <i className={`fas fa-chevron-down text-teal-600 transition-transform duration-300 ${expandedTopicId === topic.id ? 'rotate-180' : ''}`}></i>
                </summary>
                
                <div className="p-4 border-t border-gray-200">
                    <div ref={el => { contentRefs.current[topic.id] = el; }} className="p-4 bg-white rounded-lg">
                        <h3 className="text-2xl font-semibold text-teal-700 mb-4">{topic.title}</h3>
                        {renderTopicContent(topic.id)}
                    </div>
                    {topicContent[topic.id]?.content && !topicContent[topic.id]?.loading && (
                        <div className="text-right mt-4">
                            <DownloadButton onClick={() => handleDownload(topic.id, topic.title)} isLoading={isDownloading} className="!mt-0" />
                        </div>
                    )}
                </div>
            </details>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AwarenessLifeSkillsScreen;