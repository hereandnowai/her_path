
import React, { useState, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language, SuccessStory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { usePdfDownloader } from '../../hooks/usePdfDownloader.ts';
import DownloadButton from '../../components/common/DownloadButton.tsx';

const SuccessStoriesScreen: React.FC = () => {
  const { translate, language } = useLanguage();
  const { user } = useAuth();
  const [story, setStory] = useState<SuccessStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const storyRef = useRef<HTMLDivElement>(null);
  const { downloadPdf, isDownloading } = usePdfDownloader();

  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });
  
  const handleDownload = () => {
    if (story && storyRef.current) {
        downloadPdf(storyRef.current, `HerPath_Success_Story_${story.protagonistName.replace(/\s/g, '_')}`);
    }
  };

  const parseStory = (responseText: string): SuccessStory | null => {
    try {
      let jsonStr = responseText.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
      
      const parsedData = JSON.parse(jsonStr);

      if (parsedData.title && parsedData.protagonistName && parsedData.challenge && Array.isArray(parsedData.stepsTaken)) {
        return parsedData;
      }
      console.warn('Parsed data is not a valid success story:', parsedData);
      return null;
    } catch (e) {
      console.error('Failed to parse JSON response for success story:', e, "\nRaw Text:", responseText);
      return null;
    }
  };

  const getStory = async () => {
    if (!apiKey || apiKey === "MISSING_API_KEY") {
        setError("API Key is missing. Cannot generate stories.");
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setStory(null);

    const languageName = language === Language.HI ? 'Hindi' : (language === Language.TA ? 'Tamil' : 'Simple English');
    const userContext = user ? `The user reading this is named ${user.name}.` : "The user reading this is a woman in India seeking empowerment.";
    
    const systemInstruction = `
You are a master storyteller AI for the HerPath app. Your purpose is to generate uplifting, fictional, but realistic success stories to inspire women and girls in India. The stories must be culturally appropriate and empowering.

Your task is to create a single success story based on the user's context.
The story's language MUST be: ${languageName}.
The story should be relatable to women who might be facing challenges.

You MUST provide the output as a single, valid JSON object with the following keys. Adhere to the schema precisely.

{
  "title": "string",
  "protagonistName": "string (a common, but varied, Indian name from any region of India. Avoid using the same names repeatedly. For example: Anjali, Meena, Fatima, Simran, Lakshmi, Aisha, Kavita, etc.)",
  "challenge": "string (a realistic challenge faced by women in India)",
  "stepsTaken": [ "string", "string", "string" ],
  "outcome": "string (the positive result of her efforts)",
  "moral": "string (the key takeaway or lesson)",
  "imageSuggestion": "string (a description of an inspiring image for this story)"
}

CRITICAL RULES:
1.  **JSON ONLY**: The entire response MUST be a single, valid JSON object. No introductory text, no explanations, no markdown fences (\`\`\`json\`). Just the raw JSON object.
2.  **VALID SYNTAX**: Ensure all brackets, braces, quotes, and commas are perfectly placed. No trailing commas.
3.  **LANGUAGE**: All string values in the JSON MUST be in the requested language: ${languageName}.
4.  **Content**: The story must be positive and show how the protagonist overcame her challenges through determination, learning, and using available resources (like skills training, community help, or digital tools). It should feel real and achievable.
`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: `Generate a new success story. ${userContext}`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.8,
            }
        });

        const responseText = response.text;
        const parsedStory = parseStory(responseText);

        if (parsedStory) {
            setStory(parsedStory);
        } else {
            setError(translate('storyError'));
        }
    } catch (apiError: any) {
        console.error("Gemini API error (Success Story):", apiError);
        setError(`${translate('storyError')} (${apiError.message || 'Unknown error'})`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle 
        title={translate('successStoriesTitle')}
        subtitle={translate('successStoriesSubtitle')}
      />

      <div className="text-center mb-8">
        <Button onClick={getStory} disabled={isLoading || !apiKey || apiKey === "MISSING_API_KEY"} size="lg">
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              {translate('generatingStory')}
            </>
          ) : (
            <>
              <i className="fas fa-lightbulb mr-2"></i>
              {translate('getInspiration')}
            </>
          )}
        </Button>
        {(!apiKey || apiKey === "MISSING_API_KEY") && <p role="alert" className="text-red-500 text-sm text-center mt-2">API Key is missing. This feature is disabled.</p>}
      </div>

      {error && (
        <Card className="bg-red-50 border-l-4 border-red-500 p-4 my-6" role="alert">
          <p className="font-semibold text-red-700">{error}</p>
        </Card>
      )}

      {story ? (
        <>
        <div className="text-right">
            <DownloadButton onClick={handleDownload} isLoading={isDownloading} />
        </div>
        <Card ref={storyRef} className="shadow-2xl bg-white animate-fade-in mt-2 p-4">
          <div className="p-6 md:p-8">
            <h3 className="text-3xl font-bold text-teal-700 mb-4 text-center">{story.title}</h3>
            <div className="text-center mb-6">
              <span className="text-lg text-gray-600">A story of <strong className="text-teal-600">{story.protagonistName}</strong></span>
            </div>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><i className="fas fa-mountain text-amber-500 mr-3"></i> The Challenge</h4>
                <p>{story.challenge}</p>
              </div>

              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><i className="fas fa-shoe-prints text-blue-500 mr-3"></i> Steps She Took</h4>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  {story.stepsTaken.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><i className="fas fa-trophy text-green-500 mr-3"></i> The Outcome</h4>
                <p>{story.outcome}</p>
              </div>
            </div>

            <blockquote className="mt-8 p-4 bg-teal-50 border-l-4 border-teal-500 text-teal-800 italic text-center text-lg">
              "{story.moral}"
            </blockquote>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
                <h5 className="text-sm font-semibold text-gray-600">Visual Idea</h5>
                <p className="text-xs text-gray-500 italic">{story.imageSuggestion}</p>
            </div>
          </div>
        </Card>
        </>
      ) : (
        !isLoading && !error && (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-star text-5xl text-amber-400 mb-4"></i>
            <p className="text-xl">Click the button above to discover an inspiring story.</p>
          </div>
        )
      )}
    </div>
  );
};

export default SuccessStoriesScreen;