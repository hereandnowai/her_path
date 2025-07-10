import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Chat, Part } from "@google/genai";
import { useLanguage } from '../../contexts/LanguageContext';
import { Language, AppRecommendation, ChatMessage } from '../../types';
import SectionTitle from '../../components/common/SectionTitle';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import AppRecommendationCard from '../../components/digitalLearning/AppRecommendationCard';
import ChatInput from '../../components/common/ChatInput';
import { usePdfDownloader } from '../../hooks/usePdfDownloader.ts';
import DownloadButton from '../../components/common/DownloadButton.tsx';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const LearnToUseAppsScreen: React.FC = () => {
  const { translate, language } = useLanguage();
  const [goal, setGoal] = useState('');
  const [recommendations, setRecommendations] = useState<AppRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatAssistantLoading, setIsChatAssistantLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const { downloadPdf, isDownloading } = usePdfDownloader();

  const handleDownload = () => {
    downloadPdf(recommendationsRef.current, `HerPath_App_Recommendations_${goal.replace(/\s/g, '_')}`);
  };

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
          howToUseText: item.howToUseText,
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
          howToUseText: parsedData.howToUseText,
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
- "howToUseText": (string) Provide a very brief, step-by-step text guide (2-4 simple steps) on how to find, install, and start using the app. Example: "1. On your phone, open the app called 'Google Play Store'. 2. In the search bar at the top, type the name '[App Name]'. 3. Tap the 'Install' button. 4. Once it is finished, tap 'Open' to start using it."
- "benefits": (array of strings) 2-4 key benefits in simple bullet points.
- "safetyTips": (array of strings, optional) 1-2 crucial safety tips if relevant (e.g., for social media, financial apps).

EXAMPLE OF ONE OBJECT IN THE JSON ARRAY (Content must be in ${currentLanguage}):
{
  "name": "WhatsApp",
  "usage": "Use it to send messages and make calls to family and friends for free over the internet.",
  "howToUseText": "1. Open the Google Play Store on your phone. 2. Search for 'WhatsApp'. 3. Tap the 'Install' button. 4. Open the app and follow the steps to enter your phone number.",
  "benefits": ["Free to use with Wi-Fi", "Easy way to stay connected", "Can share photos and videos"],
  "safetyTips": ["Do not share your personal information with unknown numbers.", "Be careful about clicking on unknown links sent in messages."]
}

IMPORTANT INSTRUCTIONS:
- Generate 4 to 6 relevant app/website recommendations based on the user's goal (or the trending topics if the goal is vague).
- Prioritize safe, verified, and free or very low-cost apps/websites.
- Keep all descriptions, benefits, and tips extremely simple, clear, and easy to understand, suitable for users with low literacy or who are first-time app users.
- ALL string values within the JSON output must be in ${currentLanguage}.
- DO NOT provide any URLs, web links, or video links. The 'howToUseText' must be the only guide.
- Only output the JSON array. Do NOT include any text before or after the JSON array. Do NOT use markdown code fences (like \`\`\`json).
- If the array contains multiple objects, ensure they are separated by a comma (,) ONLY. The entire response must be a single, valid JSON array.
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
             setRecommendations([{ id: 'debug-raw', name: 'Debug Info', usage: 'Failed to parse or no valid recommendations. Raw response below.', benefits: [], rawResponse: responseText}]);
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
          setRecommendations([{ id: 'debug-apierror', name: 'API Error', usage: apiError.message, benefits: []}]);
       }
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleChatSubmit = async (message: { text: string; file: File | null }) => {
    if (!chatSession || isChatAssistantLoading) return;
    
    const { text, file } = message;
    if (!text.trim() && !file) return;

    let imagePreviewUrl: string | undefined = undefined;
    if (file && file.type.startsWith("image/")) {
      imagePreviewUrl = URL.createObjectURL(file);
    }

    const userMessage: ChatMessage = { sender: 'user', text, timestamp: new Date(), image: imagePreviewUrl };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatAssistantLoading(true);

    try {
      const messageParts: Part[] = [];
      if (text.trim()) {
        messageParts.push({ text: text.trim() });
      }
      if (file) {
        const filePart = await fileToGenerativePart(file);
        messageParts.push(filePart);
      }
      
      const response = await chatSession.sendMessage({message: messageParts});
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
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">{translate('appRecommendations')}</h2>
                <DownloadButton onClick={handleDownload} isLoading={isDownloading} className="!mt-0" />
            </div>
          <div ref={recommendationsRef} className="p-4 bg-white rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec) => (
                <AppRecommendationCard key={rec.id} recommendation={rec} />
                ))}
            </div>
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
                  {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-w-xs" />}
                  {msg.text && <p className="whitespace-pre-wrap text-sm">{msg.text}</p>}
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
          <ChatInput
            onSendMessage={handleChatSubmit}
            isLoading={isChatAssistantLoading}
            placeholder={translate('typeYourQuestion')}
            apiKeyAvailable={!!apiKey && apiKey !== 'MISSING_API_KEY'}
           />
        </Card>
      )}
    </div>
  );
};

export default LearnToUseAppsScreen;