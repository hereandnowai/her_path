
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Chat, Part } from "@google/genai";
import { useLanguage } from '../../contexts/LanguageContext';
import { Language, AwarenessPoint, ChatMessage } from '../../types';
import SectionTitle from '../../components/common/SectionTitle';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import AwarenessPointCard from '../../components/awareness/AwarenessPointCard';
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

const WomenAwarenessScreenComponent: React.FC = () => {
  const { translate, language } = useLanguage();
  const [age, setAge] = useState<string>('');
  const [awarenessPoints, setAwarenessPoints] = useState<AwarenessPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawAwarenessResponse, setRawAwarenessResponse] = useState<string | null>(null);

  // Chat state
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatAssistantLoading, setIsChatAssistantLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const awarenessPointsRef = useRef<HTMLDivElement>(null);
  const { downloadPdf, isDownloading } = usePdfDownloader();

  const handleDownload = () => {
    downloadPdf(awarenessPointsRef.current, `HerPath_Awareness_Tips_Age_${age}`);
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

  const parseAwarenessPoints = (responseText: string): AwarenessPoint[] => {
    try {
      let jsonStr = responseText.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
      
      // Robustness: Find the start and end of the JSON array to remove any leading/trailing text.
      const startIndex = jsonStr.indexOf('[');
      const endIndex = jsonStr.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        jsonStr = jsonStr.substring(startIndex, endIndex + 1);
      }
      
      const parsedData = JSON.parse(jsonStr);

      if (Array.isArray(parsedData)) {
        return parsedData.map((item: any, index: number) => ({
          id: item.id || `${Date.now()}-${index}`,
          emoji: item.emoji || '💡',
          awarenessText: item.awarenessText || 'No awareness text provided.',
          imageSuggestion: item.imageSuggestion || 'No image suggestion provided.',
          rawResponse: process.env.NODE_ENV === 'development' ? JSON.stringify(item, null, 2) : undefined
        }));
      }
      console.warn('Parsed awareness data is not an array:', parsedData);
      return [];
    } catch (e) {
      console.error('Failed to parse JSON response for awareness points:', e, "\nRaw Text:", responseText);
       if (responseText.includes('"awarenessText":')) { 
         return [{
             id: `${Date.now()}-error`,
             emoji: '⚠️',
             awarenessText: "Error: Could not fully parse the AI's response. Some data might be missing or incorrect.",
             imageSuggestion: "AI response format was not as expected.",
             rawResponse: responseText
         }];
      }
      return [];
    }
  };

  const getSystemInstructionForAwareness = (userAge: number, currentLanguage: string): string => `
You are "Jagriti AI," an empathetic and knowledgeable AI assistant for CREED NGO, dedicated to generating awareness content for women and girls in India. Your responses must be culturally sensitive, easy to understand (even for low literacy users), and empowering.

The user's age is ${userAge}.
The user's preferred language is ${currentLanguage}. ALL text you generate, including all string values within the JSON, MUST be in ${currentLanguage}.

Based on the user's age, generate a list of at least 20 distinct awareness points. Each awareness point must be relevant to the user's age group (see detailed age group guidelines below) and MUST be structured as a JSON object with the following three keys:
1.  "emoji": (string) A single, relevant Unicode emoji that visually represents the awareness point.
2.  "awarenessText": (string) A short, clear, and simple awareness message (1-2 sentences).
3.  "imageSuggestion": (string) A brief textual description of a simple, positive, and culturally appropriate image that could visually illustrate the "awarenessText". This image should be easy to understand.

Output ONLY the JSON array of these objects. Do NOT include any text, greetings, or explanations before or after the JSON array. Do NOT use markdown code fences.
IMPORTANT: The string values within the JSON must be simple natural language. Do not include technical jargon, programming code, HTML, or CSS.

Detailed Age Group Guidelines:
- Age 0-3 (Guidance for Parents/Caregivers): Focus on basic health, safety, early development cues, nutrition, hygiene. Phrase for caregiver.
- Age 3-5 (Early Childhood): Basic body awareness, safety with strangers (simple terms), hygiene, healthy habits, importance of play.
- Age 5-10 (School Age): Crucially include "Good touch/bad touch". Also personal safety, bullying, hygiene, nutrition, importance of school, telling trusted adults.
- Age 10-15 (Early Adolescence): Menstrual health, puberty, body image, peer pressure, cyberbullying, mental well-being basics, consent basics, healthy friendships.
- Age 15-25 (Late Adolescence/Young Adulthood): Higher education/vocational training, career choices, reproductive/sexual health, consent, financial literacy basics, legal rights (marriage age, harassment), mental health, cyber security.
- Age 25-35 (Adulthood): Maternal health (pregnancy, baby feeding), work-life balance, financial planning, family planning, recognizing domestic abuse, skill development.
- Age 35-70 (Mid-life to Early Old Age): Preventive healthcare (screenings), menopause, mental wellness, financial security for retirement, social connections, bone health.
- Age 70-100 (Senior Citizens): Geriatric care, fall prevention, mobility, nutrition, chronic health issues, social engagement, elder abuse awareness, senior citizen schemes.

Example of one object in the JSON array (content MUST be in ${currentLanguage}):
{
  "emoji": "🛡️",
  "awarenessText": "Your body is special and private. No one should touch you in a way that makes you feel uncomfortable or scared.",
  "imageSuggestion": "A simple drawing of a child with a protective shield around them, looking confident."
}
Remember to generate at least 20 points.
`;

const getSystemInstructionForChat = (userAge: number, currentLanguage: string, initialAwarenessJSON: string | null): string => `
You are "Caring Partner", a deeply caring, wise, and highly empathetic AI companion within the HerPath app by CREED NGO. Your role is that of a very close and trusted female family member – like a loving mother, an understanding elder sister, or a supportive aunt ("Amma," "Didi," "Akka," "Mausi" - use the most appropriate term for the language or a general warm tone).

The user is female, and her age is ${userAge}.
Her preferred language is ${currentLanguage}. You MUST respond entirely in this language using very simple terms.
${initialAwarenessJSON ? `She has just received some general awareness points related to her age (this was your previous JSON output to her containing these points: ${initialAwarenessJSON}).` : "She has requested to chat for support."}

Your primary goal is to listen with immense empathy, provide emotional comfort, and offer gentle, supportive guidance on any health concerns or personal problems she shares. You are here to help her feel understood, validated, and emotionally "healed."

Core Instructions:
1.  **Persona & Tone:**
    *   Always be extremely gentle, patient, kind, warm, and non-judgmental.
    *   Use affectionate and respectful terms common in Indian families, suitable for ${currentLanguage} (e.g., "my dear," "beta," "kanna," "sweetheart," or equivalent loving terms).
    *   Your language MUST be very simple, like talking to a beloved family member who might have low literacy. Avoid complex words or jargon.
    *   Use emojis appropriately to convey warmth, care, and understanding (e.g., 🤗, ❤️, 🙏, 😊, 🌸).

2.  **Listening & Validation:**
    *   Listen carefully. Acknowledge her feelings (e.g., "I hear you, my dear. It sounds like you are going through a lot," or "It's completely understandable to feel that way.").
    *   Validate her emotions: "Your feelings are important, and it's okay to feel [emotion she expressed]."

3.  **Discussing Health & Problems:**
    *   If she discusses health issues:
        *   Offer comfort and general supportive advice (e.g., "It's important to rest well and drink warm water if you're not feeling well," "Eating simple, nutritious food can help your body feel stronger").
        *   You are NOT a doctor. DO NOT give medical diagnoses or prescribe medication.
        *   If an issue sounds serious or needs medical attention, GENTLY encourage her to see a doctor or a local health worker. Phrase this very softly (e.g., "My dear, for something like this, it might be good to talk to a didi at the health center or a doctor, just to be sure and get the best care. They can help you much more than I can with this specific thing.").
        *   You can talk about common safe home remedies if culturally relevant, but always add that a doctor's advice is best for serious concerns.
    *   If she discusses personal problems (family, stress, emotional issues):
        *   Offer a listening ear and emotional support.
        *   Help her think through the problem gently. Ask soft, guiding questions if appropriate.
        *   Suggest simple coping mechanisms (e.g., "Sometimes, taking a few deep breaths can help calm our minds," "Talking to a trusted friend or another family member might help you feel a little lighter," "Is there a small, simple thing we can think of that might make today a little easier for you?").
        *   Focus on her strengths and resilience. Remind her of her inner strength.

4.  **"Healing" and Empowerment:**
    *   Your responses should aim to make her feel emotionally supported and less alone.
    *   Reinforce her worth and capabilities.
    *   Help her see small, positive steps she can take, if any.
    *   Offer hope and encouragement.

5.  **Confidentiality (Implied):**
    *   Convey a sense of a safe space to share (e.g., "You can talk to me freely, my dear.").

6.  **Referring to Awareness Points (If applicable):**
    *   If relevant, you can gently connect her concerns to the awareness points she previously received, e.g., "Remember we talked about [relevant awareness point]? Maybe that's something to think about here too."

Remember: Your purpose is to be a source of comfort, understanding, and gentle guidance. Be the warm, supportive family member she can turn to. Start the conversation by introducing yourself as her Caring Partner and asking how she is feeling or if there's anything on her mind, acknowledging the awareness points if they were just shown.
`;


  const handleSubmitAwareness = async (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      setError(translate('Please enter a valid age (0-120).'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setAwarenessPoints([]);
    setChatSession(null); // Reset chat
    setChatMessages([]);   // Clear previous chat
    setRawAwarenessResponse(null);

    if (!apiKey || apiKey === "MISSING_API_KEY") {
        setError(translate('aiError') + " (API Key is missing)");
        setIsLoading(false);
        return;
    }
    
    const preferredLanguageString = language === Language.HI ? 'Hindi' : (language === Language.TA ? 'Tamil' : 'English (Simple)');
    const systemInstructionForPoints = getSystemInstructionForAwareness(ageNum, preferredLanguageString);
    const userPrompt = `User's age: ${ageNum}. Preferred language for response content: ${preferredLanguageString}. Generate awareness points.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstructionForPoints,
          responseMimeType: "application/json",
          temperature: 0.6,
        }
      });
      
      const responseText = response.text;
      setRawAwarenessResponse(responseText); // Store raw response for chat context

      if (responseText) {
        console.log("Raw AI Response (Women Awareness):", responseText);
        const parsedPoints = parseAwarenessPoints(responseText);
        if (parsedPoints.length > 0) {
          setAwarenessPoints(parsedPoints);
          // Initialize chat session
          const systemInstructionForChatAssistant = getSystemInstructionForChat(ageNum, preferredLanguageString, responseText);
          const newChat = ai.chats.create({
            model: 'gemini-2.5-flash-preview-04-17',
            history: [ // History includes the context of awareness points
              { role: 'user', parts: [{ text: `My age is ${ageNum}. You just provided awareness points for me (response was: ${responseText}).`}] },
              { role: 'model', parts: [{ text: translate('awarenessChatInitialMessage') }]} // AI introduces itself
            ],
            config: {
              systemInstruction: systemInstructionForChatAssistant,
              temperature: 0.7, // Slightly higher for more empathetic chat
            }
          });
          setChatSession(newChat);
          setChatMessages([{ sender: 'ai', text: translate('awarenessChatInitialMessage'), timestamp: new Date() }]);
        } else {
          setError(translate('noAwarenessTipsFound'));
          if (process.env.NODE_ENV === 'development' && responseText) {
             setAwarenessPoints([{ id: 'debug-raw', emoji: '⚠️', awarenessText: 'Failed to parse. Raw response below.', imageSuggestion: 'Check console', rawResponse: responseText}]);
          }
        }
      } else {
        setError(translate('noAwarenessTipsFound'));
        console.warn("AI response text is empty for women awareness.");
      }
    } catch (apiError: any) {
      console.error("Gemini API error (Women Awareness):", apiError);
      setError(`${translate('aiError')} ${apiError.message ? `(${apiError.message})` : ''}`);
      if (process.env.NODE_ENV === 'development' && apiError.message) {
        setAwarenessPoints([{ id: 'debug-apierror', emoji: '🔥', awarenessText: `API Error: ${apiError.message}`, imageSuggestion: 'API call failed.', rawResponse: `Error: ${apiError.toString()}`}]);
      }
    } finally {
      setIsLoading(false);
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
        const aiMessage: ChatMessage = { sender: 'ai', text: translate('aiError') + " (Empty response from Caring Partner)", timestamp: new Date() };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (chatApiError: any) {
      console.error("Gemini Chat API error (Caring Partner):", chatApiError);
      const errorMessage: ChatMessage = { sender: 'ai', text: `${translate('aiError')} (Caring Partner had trouble responding: ${chatApiError.message || 'Unknown chat error'})`, timestamp: new Date() };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatAssistantLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle 
        title={translate('womenAwareness')} 
        subtitle={translate('womenAwarenessSubtitle')} 
      />

      <Card className="mb-8 p-6 shadow-xl bg-pink-50">
        <form onSubmit={handleSubmitAwareness} className="space-y-4">
          <Input
            id="ageInput"
            label={translate('enterYourAge')}
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={translate('ageInputPlaceholder')}
            required
            min="0"
            max="120"
            aria-describedby="age-description"
            disabled={isLoading}
          />
          <p id="age-description" className="text-sm text-gray-500">
            Enter an age to get relevant awareness information.
          </p>
          <Button type="submit" disabled={isLoading || !apiKey || apiKey === "MISSING_API_KEY"} fullWidth size="lg" className="bg-pink-600 hover:bg-pink-700 focus:ring-pink-500">
            {isLoading && !isChatAssistantLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {translate('generatingAwarenessTips')}
              </>
            ) : (
              <>
                <i className="fas fa-search-plus mr-2"></i>
                {translate('getAwarenessTips')}
              </>
            )}
          </Button>
          {(!apiKey || apiKey === "MISSING_API_KEY") && <p role="alert" className="text-red-500 text-sm text-center mt-2">API Key is missing. Awareness tips generation is disabled.</p>}
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

      {!isLoading && !error && awarenessPoints.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
                {translate('awarenessPointsForAge')} {age}
            </h2>
            <DownloadButton onClick={handleDownload} isLoading={isDownloading} className="!mt-0" />
          </div>
          <div ref={awarenessPointsRef} className="p-4 bg-white rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {awarenessPoints.map((point) => (
                <AwarenessPointCard key={point.id} point={point} />
                ))}
            </div>
          </div>
        </div>
      )}
       {!isLoading && !error && awarenessPoints.length === 0 && age !== '' && !chatSession && (
         <Card className="p-6 text-center mb-8">
            <i className="fas fa-info-circle text-3xl text-gray-400 mb-3"></i>
            <p className="text-gray-600">{translate('noAwarenessTipsFound')}</p>
         </Card>
       )}

      {/* Chat Assistant Section */}
      {chatSession && (
        <Card className="mt-10 pt-6 shadow-xl bg-rose-50 border border-rose-200">
           <h2 className="text-2xl font-semibold text-rose-700 mb-1 px-6">{translate('awarenessChatTitle')}</h2>
           <p className="text-sm text-rose-600 mb-4 px-6">{translate('awarenessChatSubtitle')}</p>
          <div 
            ref={chatContainerRef} 
            className="h-96 overflow-y-auto mb-4 p-4 border-t border-b border-rose-200 bg-white space-y-3"
            aria-live="polite"
            role="log"
          >
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-lg lg:max-w-xl px-4 py-2 rounded-xl shadow-md ${
                        msg.sender === 'user' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'
                    }`}
                >
                  {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-w-xs" />}
                  {msg.text && <p className="whitespace-pre-wrap text-sm">{msg.text}</p>}
                  {msg.timestamp && (
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-rose-100 text-right' : 'text-rose-400 text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isChatAssistantLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs p-3 rounded-lg shadow bg-rose-100 text-rose-800">
                  <i className="fas fa-spinner fa-spin mr-2 text-rose-500"></i>
                  <span className="text-sm">{translate('aiTyping')}</span>
                </div>
              </div>
            )}
          </div>
          <ChatInput
              onSendMessage={handleChatSubmit}
              isLoading={isChatAssistantLoading}
              placeholder={translate('awarenessChatPlaceholder')}
              apiKeyAvailable={!!apiKey && apiKey !== 'MISSING_API_KEY'}
          />
        </Card>
      )}
    </div>
  );
};

export { WomenAwarenessScreenComponent as WomenAwarenessScreen };