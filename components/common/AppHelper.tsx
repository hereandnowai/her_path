
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { useLanguage } from '../../contexts/LanguageContext';
import { ChatMessage, Language } from '../../types';
import ChatInput from './ChatInput';

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


const AppHelper: React.FC = () => {
    const { translate, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const apiKey = process.env.API_KEY;

    // The initial welcome message
    const welcomeMessage: ChatMessage = {
        sender: 'ai',
        text: translate('appHelperWelcome'),
        timestamp: new Date()
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const getSystemInstruction = (currentLanguage: string) => `
You are 'HerPath Helper', a friendly and knowledgeable AI assistant for the HerPath app. Your icon is a heart because you are here to help users with love and care. Your purpose is to guide users through the app, explaining what each feature does and how to use it.
You MUST respond in the user's preferred language: ${currentLanguage}.
Assume the user has very basic knowledge of using apps. Explain things in simple, step-by-step points. Use emojis to make explanations friendly and clear.

You are an expert on the following HerPath app features:
- **Home:** The main dashboard with quick links.
- **Smart Pathway:** A feature to get personalized career and education guidance. To use it, the user fills a form with their details and goals, and the AI generates a step-by-step plan.
- **Document Pal:** A tool to understand complex documents. Users upload a photo of a document (like a bill or form), and the AI explains it in simple terms.
- **Women Awareness (Age-specific):** Users enter their age to get relevant health and life awareness tips. It also includes a chat with a caring AI partner.
- **Women Law Awareness (18+):** A section that explains important Indian laws concerning women's rights and safety. Users can click on a law to see details.
- **Awareness & Life Skills:** Provides guidance on topics like mental well-being, health, safety, and financial literacy.
- **Learn to Use Apps:** Helps users discover other useful mobile apps (like YouTube, WhatsApp) for their goals. Users type a goal, and the AI suggests apps.
- **Success Stories:** A feature that generates inspiring fictional stories of women overcoming challenges to empower users.
- **Brain Quizzes:** A fun game section where users can test their knowledge on various topics.
- **Emergency Contacts:** A list of national emergency numbers (Police, Helpline) and a place for users to add their own personal contacts.
- **Profile & Settings:** Users can edit their profile, change the app language, and log out.

When a user asks how to use a feature, provide clear, numbered steps.
Example for "How do I use Smart Pathway?":
"Of course! Here's how to use the Smart Pathway feature:
1.  Go to the menu and tap on 'Smart Pathway'.
2.  You will see a form. Fill it out with your details, like your education and what you want to achieve.
3.  Tap the 'Generate Pathway' button at the bottom.
4.  The AI will create a special plan just for you!
Let me know if you want to know about another feature! 😊"

Always be encouraging and patient. If you don't know an answer, politely say that you can only help with questions about using the HerPath app.
`;

    const initializeChat = () => {
        if (!apiKey || apiKey === 'MISSING_API_KEY' || chat) return;

        const lang = language === Language.HI ? 'Hindi' : language === Language.TA ? 'Tamil' : 'English';
        const systemInstruction = getSystemInstruction(lang);
        const ai = new GoogleGenAI({ apiKey });
        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash-preview-04-17',
            config: {
                systemInstruction,
                temperature: 0.5
            }
        });
        setChat(chatSession);
        setChatMessages([welcomeMessage]);
    };

    const toggleHelper = () => {
        const newIsOpenState = !isOpen;
        setIsOpen(newIsOpenState);
        if (newIsOpenState && !chat) {
            initializeChat();
        } else if (newIsOpenState && chatMessages.length === 0) {
            // If re-opened and chat was empty, show welcome message
            setChatMessages([welcomeMessage]);
        }
    };

    const handleSendMessage = async (message: { text: string; file: File | null }) => {
        if (!chat || isLoading) return;
        
        const { text, file } = message;
        if (!text.trim() && !file) return;

        let imagePreviewUrl: string | undefined = undefined;
        if (file && file.type.startsWith("image/")) {
            imagePreviewUrl = URL.createObjectURL(file);
        }
        
        const userMessage: ChatMessage = { sender: 'user', text, timestamp: new Date(), image: imagePreviewUrl };
        setChatMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const messageParts: Part[] = [];
            if (text.trim()) {
                messageParts.push({ text: text.trim() });
            }
            if (file) {
                const filePart = await fileToGenerativePart(file);
                messageParts.push(filePart);
            }
            
            const response: GenerateContentResponse = await chat.sendMessage({ message: messageParts });
            const aiText = response.text;
            const aiMessage: ChatMessage = { sender: 'ai', text: aiText, timestamp: new Date() };
            setChatMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
            console.error("App Helper AI error:", error);
            const errorMessage: ChatMessage = { sender: 'ai', text: "I'm having a little trouble right now. Please try again in a moment.", timestamp: new Date() };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleHelper}
                className="fixed bottom-6 right-6 bg-pink-500 text-white w-16 h-16 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 ease-in-out flex items-center justify-center z-50 transform hover:scale-110"
                aria-label="Open HerPath Helper"
            >
                <i className="fas fa-heart text-2xl animate-pulse"></i>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={toggleHelper}></div>
            )}
            
            <div
                className={`fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="appHelperTitle"
            >
                <header className="flex items-center justify-between p-4 bg-teal-600 text-white rounded-t-2xl">
                    <div className="flex items-center">
                        <i className="fas fa-heart text-xl mr-3"></i>
                        <h3 id="appHelperTitle" className="font-bold text-lg">{translate('appHelperTitle', 'HerPath Helper')}</h3>
                    </div>
                    <button onClick={toggleHelper} className="p-1 rounded-full hover:bg-teal-700" aria-label="Close helper">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </header>
                
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {chatMessages.map((msg, index) => (
                         <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-sm p-3 rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-teal-500 text-white' : 'bg-white text-gray-800'}`}>
                                 {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-w-xs" />}
                                <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-xs p-3 rounded-lg shadow-sm bg-white text-gray-800">
                            <i className="fas fa-spinner fa-spin mr-2 text-teal-500"></i>
                            <span className="text-sm">{translate('aiTyping')}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t">
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        placeholder={translate('appHelperPlaceholder', 'Ask about app features...')}
                        apiKeyAvailable={!!apiKey && apiKey !== 'MISSING_API_KEY'}
                        showAttachmentButton={true}
                    />
                </div>
            </div>
        </>
    );
};

export default AppHelper;