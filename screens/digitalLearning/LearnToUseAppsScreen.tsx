
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { useLanguage } from '../../contexts/LanguageContext';
import { Language, AppRecommendation, ChatMessage } from '../../types';
import SectionTitle from '../../components/common/SectionTitle';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import AppRecommendationCard from '../../components/digitalLearning/AppRecommendationCard';

const LearnToUseAppsScreen: React.FC = () => {
  const { translate, language } = useLanguage();
  const [goal, setGoal] = useState('');
  const [recommendations, setRecommendations] = useState<AppRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatAssistantLoading, setIsChatAssistantLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const apiKey = process.env.API_KEY;
   if (!apiKey) {
    console.error("API_KEY environment variable is not set. Gemini API calls will fail.");
  }
  const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const parseRecommendations = (responseText: string): AppRecommendation[] => {
    try {
      let jsonStr = responseText.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
      
      const parsedData = JSON.parse(jsonStr);

      if (Array.isArray(parsedData)) {
        return parsedData.map((item: any, index: number) => ({
          id: item.id || `${Date.now()}-${index}`,
          name: item.name || 'Unnamed App/Website',
          usage: item.usage || 'No usage description provided.',
          howToUseVideoLink: item.howToUseVideoLink,
          howToUseText: item.howToUseText,
          officialLink: item.officialLink || '#',
          benefits: Array.isArray(item.benefits) ? item.benefits : [],
          safetyTips: Array.isArray(item.safetyTips) ? item.safetyTips : [],
          rawResponse: process.env.NODE_ENV === 'development' ? JSON.stringify(item, null, 2) : undefined
        }));
      }
      if (typeof parsedData === 'object' && parsedData !== null && parsedData.name) {
         return [{
          id: parsedData.id || `${Date.now()}-0`,
          name: parsedData.name,
          usage: parsedData.usage || 'No usage description provided.',
          howToUseVideoLink: parsedData.howToUseVideoLink,
          howToUseText: parsedData.howToUseText,
          officialLink: parsedData.officialLink || '#',
          benefits: Array.isArray(parsedData.benefits) ? parsedData.benefits : [],
          safetyTips: Array.isArray(parsedData.safetyTips) ? parsedData.safetyTips : [],
          rawResponse: process.env.NODE_ENV === 'development' ? JSON.stringify(parsedData, null, 2) : undefined
        }];
      }
      console.warn('Parsed data is not an array or a single valid object:', parsedData);
      return [];
    } catch (e: any) {
      console.error('Failed to parse JSON response:\n' + e.message + '\n\nRaw Text:\n' + responseText);
      if (responseText.includes('"name":')) {
         return [{
             id: `${Date.now()}-error`,
             name: "Error Parsing Recommendation",
             usage: "Could not fully parse the AI response. Displaying raw data if available.",
             officialLink: "#",
             benefits: [],
             rawResponse: responseText
         }];
      }
      return [];
    }
  };

  const getSystemInstructionForRecommendations = (currentGoal: string, currentLanguage: string) => `
You are an intelligent digital assistant for the HerPath app by CREED NGO. Your mission is to help underprivileged women and girls in India (ages 5-60) explore the internet, apps, and platforms for learning, working, growing, and staying safe. You guide them based on their stated interest or goal.
Assume a beginner level of digital literacy for the user. Explain things very simply.
The user's preferred language is ${currentLanguage}. ALL text you generate, including all string values within the JSON, MUST be in ${currentLanguage}.

The user's current goal/interest is: "${currentGoal}".

If the user's goal is vague (e.g., "I don't know," "anything," "help me," or empty) or they don't specify a clear goal, provide recommendations related to 3-4 of these 5 trending topics for Indian women and girls:
1. Learn English
2. Start a home business
3. Learn tailoring
4. Study again (online courses, finish education)
5. Build confidence

OUTPUT FORMAT:
For EACH app/website recommendation, you MUST provide the information in a VALID JSON format. Output a JSON array of recommendation objects. Each object in the array MUST have these exact keys with values in ${currentLanguage}:
- "name": (string) The official name of the app or website.
- "usage": (string) A simple, one-sentence description of what it is used for.
- "howToUseVideoLink": (string, optional) A publicly accessible YouTube video URL showing how to use the app/website. Prioritize providing this. If not available or not applicable, omit this key or set to null.
- "howToUseText": (string, optional) If a video link is not suitable or available, provide a very brief, step-by-step text guide (2-3 simple steps).
- "officialLink": (string) The direct, official URL to the app (e.g., Play Store, App Store if known, otherwise website) or website.
- "benefits": (array of strings) 2-4 key benefits in simple bullet points.
- "safetyTips": (array of strings, optional) 1-2 crucial safety tips if relevant (e.g., for social media, financial apps).

EXAMPLE OF ONE OBJECT IN THE JSON ARRAY (Content must be in ${currentLanguage}):
{
  "name": "Duolingo",
  "usage": "Use it to practice English daily in a fun way.",
  "howToUseVideoLink": "https://www.youtube.com/watch?v=VIDEO_ID_FOR_DUOLINGO_GUIDE",
  "howToUseText": null,
  "officialLink": "https://www.duolingo.com",
  "benefits": ["Free to use", "Works in many Indian languages", "Learn step-by-step"],
  "safetyTips": ["Don't share your password with anyone."]
}

IMPORTANT INSTRUCTIONS:
- Generate 4 to 6 relevant app/website recommendations based on the user's goal (or the trending topics if the goal is vague).
- Prioritize safe, verified, and free or very low-cost apps/websites.
- Keep all descriptions, benefits, and tips extremely simple, clear, and easy to understand, suitable for users with low literacy or who are first-time app users.
- ALL string values within the JSON output must be in ${currentLanguage}.
- Only output the JSON array. Do NOT include any text before or after the JSON array. Do NOT use markdown code fences (like \`\`\`json).
- If the array contains multiple objects, ensure they are separated by a comma (,) ONLY. No other text or characters should be between the closing brace '}' of one object and the comma, or between the comma and the opening brace '{' of the next object. The entire response must be a single, valid JSON array.
`;

const getSystemInstructionForChat = (currentGoal: string, currentLanguage: string, appRecsString: string) => `
You are a very friendly, patient, and helpful intelligent digital assistant for the HerPath app. Your role is to act like a kind digital guide or an elder sister.
The user's preferred language is ${currentLanguage}. You MUST respond entirely in this language.
The user initially asked for help with the goal: "${currentGoal}".
You have already provided the following app/website recommendations (this was your previous JSON response):
${appRecsString}

Now, the user has follow-up questions. Your tasks are:
1.  Answer their questions about the apps/websites already recommended. For example, "How do I use [App Name]?", "Tell me more about [App Name benefits]", "What should I do first on [Website Name]?". Maintain your friendly and patient persona throughout.
2.  Provide simple, step-by-step guidance if they ask for how-to instructions for any app, whether it was in your initial recommendations or one they mention.
3.  Encourage them and offer motivational support. Use "we" language (e.g., "Let's figure this out together," "We can learn this step by step") to build rapport.

4.  If the user's original goal or their follow-up questions relate to advanced fields like Artificial Intelligence (AI), Machine Learning (ML), Data Science, software development, or other specialized technology domains:
    *   Adopt the persona of a knowledgeable and encouraging mentor in these fields.
    *   Help clarify their doubts about concepts, learning paths, specific technologies, or career prospects in these areas.
    *   Provide accurate and helpful information to the best of your ability. Explain complex topics in a clear, broken-down manner.
    *   Suggest how specific apps, online platforms (like Coursera, edX, Khan Academy, NPTEL), or open-source resources can be used for learning these advanced topics. You can mention specific courses or specializations if relevant and widely known.

5.  If the user suggests an app or website not in your initial recommendations:
    *   If you have information about it, briefly describe its purpose and common uses.
    *   Crucially, always add a friendly reminder like: "That's an interesting app you mentioned! Generally, it's used for [purpose if known]. Since apps and websites change so often with new updates, it's always a good idea to check their official website or the app's help section for the very latest information and features. This way, we make sure we have the most current details!"

6.  If they ask for new recommendations for their original goal or a new goal, politely state that for new topics or a fresh set of recommendations, they can start a new search using the main form on this page, but you're happy to help them understand the current recommendations better or discuss how they relate to their learning.

7.  Keep your answers concise and easy to understand. For general topics, maintain extreme simplicity suitable for low literacy users. When discussing advanced tech topics (as per point 4), you can provide more detail, but still explain concepts clearly and patiently. Use emojis appropriately to enhance friendliness and clarity.
8.  If you need to refer to a specific app from your previous recommendations, mention its name clearly.
`;

  const handleRecommendationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoadingRecommendations(true);
    setError(null);
    setRecommendations([]);
    setChatSession(null); // Reset chat session
    setChatMessages([]);   // Clear previous chat messages

    if (!apiKey || apiKey === "MISSING_API_KEY") {
        setError(translate('aiError') + " (API Key is missing)");
        setIsLoadingRecommendations(false);
        return;
    }
    
    const preferredLanguageString = language === Language.HI ? 'Hindi' : (language === Language.TA ? 'Tamil' : 'English (Simple)');
    const systemInstructionForRecs = getSystemInstructionForRecommendations(goal, preferredLanguageString);

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: `User goal: "${goal}". Preferred language for response content: ${preferredLanguageString}.`,
        config: {
          systemInstruction: systemInstructionForRecs,
          responseMimeType: "application/json",
          temperature: 0.5,
        }
      });
      
      const responseText = response.text;
      if (responseText) {
        console.log("Raw AI Response (Recommendations):", responseText);
        const parsedRecs = parseRecommendations(responseText);
        if (parsedRecs.length > 0 && !(parsedRecs.length === 1 && parsedRecs[0].name === "Error Parsing Recommendation")) {
          setRecommendations(parsedRecs);
          // Initialize chat session
          const systemInstructionForChatAssistant = getSystemInstructionForChat(goal, preferredLanguageString, responseText);
          const newChat = ai.chats.create({
            model: 'gemini-2.5-flash-preview-04-17',
            history: [
              { role: 'user', parts: [{ text: `My goal is: "${goal}". Please give me app recommendations.` }] },
              { role: 'model', parts: [{ text: responseText }] } // The JSON recommendations
            ],
            config: {
              systemInstruction: systemInstructionForChatAssistant,
              temperature: 0.6,
            }
          });
          setChatSession(newChat);
          // Add an initial message to chat UI
           setChatMessages([{ sender: 'ai', text: translate('appRecommendations') + ". " + translate('askFollowUpQuestions'), timestamp: new Date() }]);

        } else {
           if (parsedRecs.length === 1 && parsedRecs[0].name === "Error Parsing Recommendation") {
              setError(translate('aiError') + " (Could not parse AI response)");
           } else {
             setError(translate('noSuggestionsFound'));
           }
          if (process.env.NODE_ENV === 'development' && responseText && !(parsedRecs.length === 1 && parsedRecs[0].name === "Error Parsing Recommendation")) {
             setRecommendations([{ id: 'debug-raw', name: 'Debug Info', usage: 'Failed to parse or no valid recommendations. Raw response below.', officialLink:'#', benefits: [], rawResponse: responseText}]);
          }
        }
      } else {
        setError(translate('noSuggestionsFound'));
        console.warn("AI response text is empty for recommendations.");
      }
    } catch (apiError: any) {
      console.error("Gemini API error (Recommendations):", apiError);
      setError(`${translate('aiError')} ${apiError.message ? `(${apiError.message})` : ''}`);
       if (process.env.NODE_ENV === 'development' && apiError.message) {
          setRecommendations([{ id: 'debug-apierror', name: 'API Error', usage: apiError.message, officialLink:'#', benefits: []}]);
       }
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatSession || isChatAssistantLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    const currentChatInput = chatInput;
    setChatInput('');
    setIsChatAssistantLoading(true);

    try {
      const response = await chatSession.sendMessage({message: currentChatInput});
      const aiMessageText = response.text;

      if (aiMessageText) {
        const aiMessage: ChatMessage = { sender: 'ai', text: aiMessageText, timestamp: new Date() };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        const aiMessage: ChatMessage = { sender: 'ai', text: translate('aiError') + " (Empty response)", timestamp: new Date() };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (chatApiError: any) {
      console.error("Gemini Chat API error:", chatApiError);
      const errorMessage: ChatMessage = { sender: 'ai', text: `${translate('aiError')} (${chatApiError.message || 'Unknown chat error'})`, timestamp: new Date() };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatAssistantLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle 
        title={translate('learnToUseApps')} 
        subtitle={translate('learnToUseAppsSubtitle')} 
      />

      <Card className="mb-8 p-6 shadow-xl">
        <form onSubmit={handleRecommendationSubmit} className="space-y-4">
          <Input
            id="goalInput"
            label={translate('whatIsYourGoal')}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={translate('goalInputPlaceholder')}
            required
            aria-describedby="goal-description"
          />
          <p id="goal-description" className="text-sm text-gray-500">
            Tell us what you want to achieve or learn online.
          </p>
          <Button type="submit" disabled={isLoadingRecommendations || !apiKey || apiKey === "MISSING_API_KEY"} fullWidth size="lg">
            {isLoadingRecommendations ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {translate('generatingSuggestions')}
              </>
            ) : (
              <>
                <i className="fas fa-search mr-2"></i>
                {translate('getSuggestions')}
              </>
            )}
          </Button>
          {(!apiKey || apiKey === "MISSING_API_KEY") && <p role="alert" className="text-red-500 text-sm text-center mt-2">API Key is missing. Suggestions are disabled.</p>}
        </form>
      </Card>

      {error && (
        <Card className="bg-red-50 border-l-4 border-red-500 p-4 my-6" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i>
            </div>
            <div>
              <p className="font-semibold text-red-700">Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {!isLoadingRecommendations && !error && recommendations.length > 0 && !(recommendations.length === 1 && recommendations[0].name === "Error Parsing Recommendation") && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{translate('appRecommendations')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <AppRecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
       {!isLoadingRecommendations && !error && recommendations.length === 0 && goal !== '' && !chatMessages.find(m => m.sender ==='ai' && m.text.startsWith(translate('appRecommendations'))) && ( // Check if initial AI message already shown
         <Card className="p-6 text-center">
            <i className="fas fa-info-circle text-3xl text-gray-400 mb-3"></i>
            <p className="text-gray-600">{translate('noSuggestionsFound')}</p>
         </Card>
       )}

      {/* Chat Assistant Section */}
      {chatSession && recommendations.length > 0 && !(recommendations.length === 1 && recommendations[0].name === "Error Parsing Recommendation") && (
        <Card className="mt-10 pt-6 shadow-xl">
           <h2 className="text-2xl font-semibold text-teal-700 mb-1 px-6">{translate('chatWithAssistant')}</h2>
           <p className="text-sm text-gray-500 mb-4 px-6">{translate('askAboutApps')}</p>
          <div 
            ref={chatContainerRef} 
            className="h-80 overflow-y-auto mb-4 p-4 border-t border-b border-gray-200 bg-gray-50 space-y-3"
            aria-live="polite"
          >
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-lg lg:max-w-xl px-4 py-2 rounded-xl shadow-md ${
                        msg.sender === 'user' ? 'bg-teal-500 text-white' : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                  {msg.timestamp && (
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-teal-100 text-right' : 'text-gray-400 text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isChatAssistantLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs p-3 rounded-lg shadow bg-white text-gray-800 border border-gray-200">
                  <i className="fas fa-spinner fa-spin mr-2 text-teal-500"></i>
                  <span className="text-sm">{translate('aiTyping')}</span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleChatSubmit} className="flex gap-3 p-4 pt-0">
            <Input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={translate('typeYourQuestion')}
              className="flex-grow !mb-0 text-sm"
              wrapperClassName="flex-grow !mb-0"
              disabled={isChatAssistantLoading || !apiKey || apiKey === "MISSING_API_KEY"}
              aria-label={translate('typeYourQuestion')}
            />
            <Button 
                type="submit" 
                disabled={isChatAssistantLoading || !chatInput.trim() || !apiKey || apiKey === "MISSING_API_KEY"}
                aria-label={translate('send')}
                className="px-4"
            >
              <i className="fas fa-paper-plane"></i>
              <span className="sr-only">{translate('send')}</span>
            </Button>
          </form>
           {(!apiKey || apiKey === "MISSING_API_KEY") && <p role="alert" className="text-red-500 text-xs text-center pb-2 px-4">API Key is missing. Chat assistant is disabled.</p>}
        </Card>
      )}
    </div>
  );
};

export default LearnToUseAppsScreen;