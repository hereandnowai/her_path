
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai"; // Added Chat
import { useLanguage } from '../../contexts/LanguageContext';
import SectionTitle from '../../components/common/SectionTitle';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { GUIDANCE_CATEGORIES, UI_TEXT } from '../../constants';
import { 
  Language,
  GeneratedGuidance,
  PathwayStep,
  PathwayStepResource,
  EducationalPathwayModule,
  LifeAwarenessModule,
  LifeAwarenessTopic,
  LifeAwarenessGuidancePoint,
  SchemeOrRightItem,
  DigitalLearningTip,
  MotivationalSupportModule,
  ChatMessage // Added ChatMessage
} from '../../types'; 

const GuidancePathwayScreen: React.FC = () => {
  const { translate, language } = useLanguage();
  const [category, setCategory] = useState<string>(GUIDANCE_CATEGORIES[0].id);
  const [educationLevel, setEducationLevel] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [challenges, setChallenges] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedGuidance, setGeneratedGuidance] = useState<GeneratedGuidance | null>(null);

  // State for chat functionality
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);


  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable is not set. Gemini API calls will fail.");
  }
  const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

  useEffect(() => {
    // Scroll to bottom of chat history when new messages are added
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const extractUrl = (text: string): string | undefined => {
    const urlRegex = /(https?:\/\/[^\s()]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : undefined;
  };
  
  const parseGeneratedGuidanceText = (text: string): GeneratedGuidance => {
    console.log("Starting to parse generated guidance text.");
    const guidance: GeneratedGuidance = { rawResponse: text }; 
    const moduleSeparator = "--- END OF MODULE ---";
    const modulesText = text.split(moduleSeparator);

    // Module 1: Educational Pathway
    try {
      if (modulesText[0]) {
        console.log("Parsing Module 1: Educational Pathway");
        const pathwayModule: EducationalPathwayModule = { steps: [] };
        const stepsRaw = modulesText[0].replace(/1️⃣\s*EDUCATIONAL\s*&\s*CAREER\s*PATHWAY.*?(\r\n|\r|\n)/i, '').split("---").map(s => s.trim()).filter(s => s);
        stepsRaw.forEach(stepRaw => {
          const step: PathwayStep = { stepTitle: '', dos: [], donts: [], resources: [], tip: '' };
          const lines = stepRaw.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l);
          let resourcesStrAccumulator = "";
          lines.forEach(line => {
            if (line.match(/^Step \d+\s*[:\-]?\s*.*/i)) step.stepTitle = line;
            else if (line.match(/^DO\s*[:\-]?\s*/i)) step.dos.push(line.replace(/^DO\s*[:\-]?\s*/i, '').trim());
            else if (line.match(/^DON'T\s*[:\-]?\s*/i)) step.donts.push(line.replace(/^DON'T\s*[:\-]?\s*/i, '').trim());
            else if (line.match(/^(?:Resources\s*[:\-]?\s*|🎥|📘|📓|🌐)/i)) {
                resourcesStrAccumulator += line.replace(/^(?:Resources\s*[:\-]?\s*)/i, '').trim() + "\n";
            }
            else if (line.match(/^Tip\s*[:\-]?\s*/i)) step.tip = line.replace(/^Tip\s*[:\-]?\s*/i, '').trim();
          });

          if (resourcesStrAccumulator) {
            const resItems = resourcesStrAccumulator.trim().split(/\s*,\s*(?![^\[]*\]\([^\)]*\))|\s*\n\s*(?=(?:🎥|📘|📓|🌐))/g);
            resItems.forEach(resItemStr => {
              if (!resItemStr.trim()) return;
              let name = resItemStr.trim();
              let type: string | undefined = undefined;
              let url: string | undefined = undefined;
              const markdownLinkMatch = name.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
              if (markdownLinkMatch) {
                name = markdownLinkMatch[1].trim();
                url = markdownLinkMatch[2].trim();
              }
              const typeMatchExplicit = name.match(/\(Type:\s*([^)]+)\)/i);
              if (typeMatchExplicit) {
                type = typeMatchExplicit[1].trim();
                name = name.replace(/\(Type:\s*[^)]+\)/i, '').trim();
              } else if (resItemStr.startsWith('🎥')) type = 'Video';
              else if (resItemStr.startsWith('📘')) type = 'Book/PDF';
              else if (resItemStr.startsWith('📓')) type = 'Notes/Material';
              else if (resItemStr.startsWith('🌐')) type = 'Website/Platform';
              name = name.replace(/^(?:🎥|📘|📓|🌐)\s*/, '').trim();
              if (!url) {
                  const urlMatchExplicit = resItemStr.match(/URL:\s*(https?:\/\/[^\s)]+)/i);
                  if (urlMatchExplicit) {
                      url = urlMatchExplicit[1].trim();
                      name = name.replace(/URL:\s*https?:\/\/[^\s)]+/i, '').trim();
                  } else {
                      const potentialUrl = extractUrl(name);
                      if(potentialUrl && name.startsWith(potentialUrl)) {
                          url = potentialUrl;
                          name = name.replace(potentialUrl, '').trim() || potentialUrl;
                      }
                  }
              }
              name = name.replace(/→\s*$/, '').trim();
              if (name) {
                step.resources.push({ name, type, url });
              }
            });
          }
          if (step.stepTitle) pathwayModule.steps.push(step);
        });
        if(pathwayModule.steps.length > 0) guidance.educationalPathway = pathwayModule;
      }
    } catch (e: any) {
      console.error("Error parsing Educational Pathway:", e.message, modulesText[0]);
    }

    // Module 2 (was 3): Life Awareness & Safety Module
    try {
      if (modulesText[1]) { 
        console.log("Parsing Module 2 (was 3): Life Awareness & Safety");
        const lifeAwarenessRaw = modulesText[1].replace(/2️⃣\s*LIFE\s*AWARENESS\s*&\s*SAFETY\s*MODULE.*?(\r\n|\r|\n)/i, '').trim(); 
        const module: LifeAwarenessModule = { ageGroupFocus: '', topics: [] };
        const ageGroupMatch = lifeAwarenessRaw.match(/^Age Group Focus\s*[:\-]?\s*(.*)/i);
        if (ageGroupMatch) module.ageGroupFocus = ageGroupMatch[1].trim();
        const topicsRaw = lifeAwarenessRaw.split(/Key Topic\s*[:\-]?\s*/i).slice(1);
        topicsRaw.forEach(topicStr => {
            const topic: LifeAwarenessTopic = { topicTitle: '', guidancePoints: [] };
            const lines = topicStr.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l);
            if (lines.length > 0) {
                topic.topicTitle = lines[0]; 
                let currentGuidancePoint: LifeAwarenessGuidancePoint | null = null;
                lines.slice(1).forEach(line => {
                    if (line.match(/^Guidance Point\s*[:\-]?\s*/i)) {
                        currentGuidancePoint = { point: line.replace(/^Guidance Point\s*[:\-]?\s*/i, "").trim() };
                        topic.guidancePoints.push(currentGuidancePoint);
                    } else if (line.match(/^Visual Cue\s*[:\-]?\s*/i) && currentGuidancePoint) {
                        currentGuidancePoint.visualCue = line.replace(/^Visual Cue\s*[:\-]?\s*/i, "").trim();
                    } else if (line.match(/^\(Audio Tip\s*[:\-]?\s*/i)) { 
                        topic.audioTip = line.replace(/^\(Audio Tip\s*[:\-]?\s*/i, "").replace(")", "").trim();
                    }
                });
            }
            if(topic.topicTitle) module.topics.push(topic);
        });
        if(module.ageGroupFocus || module.topics.length > 0) guidance.lifeAwarenessModule = module;
      }
    } catch (e: any) {
      console.error("Error parsing Life Awareness:", e.message, modulesText[1]); 
    }

    // Module 3 (was 4): Scholarships, Government Schemes & Women's Rights
    try {
      if (modulesText[2]) { 
        console.log("Parsing Module 3 (was 4): Schemes & Rights");
        const schemesModule: SchemeOrRightItem[] = [];
        const itemsRaw = modulesText[2].replace(/3️⃣\s*SCHOLARSHIPS,\s*GOVERNMENT\s*SCHEMES\s*&\s*WOMEN'S\s*RIGHTS.*?(\r\n|\r|\n)/i, '').split(/\r\n|\r|\n(?=(?:👩‍🎓|💰|⚖))/).map(s => s.trim()).filter(s => s); 
        itemsRaw.forEach(itemStr => {
            const match = itemStr.match(/^(👩‍🎓|💰|⚖)\s*(Scholarship|Scheme|Right)\s*[:\-]?\s*(.*)/i);
            if (match) {
                const item: SchemeOrRightItem = {
                    emoji: match[1],
                    type: match[2],
                    name: match[3].trim(),
                    details: '',
                    howToAccess: '',
                };
                const detailMatch = itemStr.match(/Details\s*[:\-]?\s*([^(\r\n|\r|\n)]*)/i);
                if (detailMatch) item.details = detailMatch[1].trim();
                const accessMatch = itemStr.match(/How to Access\s*[:\-]?\s*([^(\r\n|\r|\n)]*)/i);
                if (accessMatch) {
                   item.howToAccess = accessMatch[1].trim();
                   item.url = extractUrl(item.howToAccess);
                }
                const sourceMatch = itemStr.match(/Source\s*[:\-]?\s*([^(\r\n|\r|\n)]*)/i);
                if (sourceMatch) {
                  item.source = sourceMatch[1].trim();
                  if(!item.url) item.url = extractUrl(item.source);
                }
                schemesModule.push(item);
            }
        });
        if(schemesModule.length > 0) guidance.schemesAndRights = schemesModule;
      }
    } catch (e: any) {
      console.error("Error parsing Schemes & Rights:", e.message, modulesText[2]); 
    }
    
    // Module 4 (was 5): Digital Learning & App Usage Training
    try {
      if (modulesText[3]) { 
        console.log("Parsing Module 4 (was 5): Digital Learning");
        const digitalLearningModule: DigitalLearningTip[] = [];
        const appsRaw = modulesText[3].replace(/4️⃣\s*DIGITAL\s*LEARNING\s*&\s*APP\s*USAGE\s*TRAINING.*?(\r\n|\r|\n)/i, '').split(/App\s*[:\-]?\s*/i).slice(1).map(s => s.trim()).filter(s => s); 
        appsRaw.forEach(appStr => {
            const lines = appStr.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l);
            if (lines.length === 0) return;
            const appName = lines[0];
            const tip: DigitalLearningTip = { app: appName, howToUse: '', exampleSearchOrTask: ''};
            let howToUseStartIndex = lines.findIndex(l => l.match(/^How to Use\s*[:\-]?\s*/i));
            if (howToUseStartIndex !== -1) {
                let howToUseEndIndex = lines.slice(howToUseStartIndex + 1).findIndex(l => l.match(/^(Example Search\/Task|Visual Cue|\(Audio Tip)\s*[:\-]?\s*/i));
                if (howToUseEndIndex === -1) howToUseEndIndex = lines.length - (howToUseStartIndex + 1); else howToUseEndIndex += howToUseStartIndex +1;
                tip.howToUse = lines.slice(howToUseStartIndex, howToUseEndIndex + 1).join('\n').replace(/^How to Use\s*[:\-]?\s*/i, "").trim();
            }
            const exampleSearchLine = lines.find(l => l.match(/^Example Search\/Task\s*[:\-]?\s*/i));
            if (exampleSearchLine) tip.exampleSearchOrTask = exampleSearchLine.replace(/^Example Search\/Task\s*[:\-]?\s*/i, "").trim();
            const visualCueLine = lines.find(l => l.match(/^Visual Cue\s*[:\-]?\s*/i));
            if (visualCueLine) tip.visualCue = visualCueLine.replace(/^Visual Cue\s*[:\-]?\s*/i, "").trim();
            const audioTipLine = lines.find(l => l.match(/^\(Audio Tip\s*[:\-]?\s*/i));
            if (audioTipLine) tip.audioTip = audioTipLine.replace(/^\(Audio Tip\s*[:\-]?\s*/i, "").replace(")", "").trim();
            
            // Ensure How to Use and Example Task are not empty before pushing
            if (tip.howToUse.trim() !== "" && tip.exampleSearchOrTask.trim() !== "") {
              digitalLearningModule.push(tip);
            }
        });
        if(digitalLearningModule.length > 0) guidance.digitalLearningTips = digitalLearningModule;
      }
    } catch (e: any) {
      console.error("Error parsing Digital Learning:", e.message, modulesText[3]); 
    }

    // Module 5 (was 6): Motivational Support + Next Step
    try {
      if (modulesText[4]) { 
        console.log("Parsing Module 5 (was 6): Motivational Support");
        const motivationalModule: MotivationalSupportModule = { personalizedEncouragement: '', quote: '', nextStep: '', reminder: ''};
        const lines = modulesText[4].replace(/5️⃣\s*MOTIVATIONAL\s*SUPPORT\s*\+\s*NEXT\s*STEP.*?(\r\n|\r|\n)/i, '').split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l); 
        lines.forEach(line => {
            if (line.match(/^🌟 Personalized Encouragement\s*[:\-]?\s*/i)) motivationalModule.personalizedEncouragement = line.replace(/^🌟 Personalized Encouragement\s*[:\-]?\s*/i, '').trim().replace(/^"|"$/g, '');
            else if (line.match(/^🌟 Motivational Quote\s*[:\-]?\s*/i)) motivationalModule.quote = line.replace(/^🌟 Motivational Quote\s*[:\-]?\s*/i, '').trim().replace(/^"|"$/g, '');
            else if (line.match(/^✅ Your Next Step\s*[:\-]?\s*/i)) motivationalModule.nextStep = line.replace(/^✅ Your Next Step\s*[:\-]?\s*/i, '').trim();
            else if (line.match(/^🔁 Remember\s*[:\-]?\s*/i)) motivationalModule.reminder = line.replace(/^🔁 Remember\s*[:\-]?\s*/i, '').trim().replace(/^"|"$/g, '');
        });
         if(motivationalModule.personalizedEncouragement || motivationalModule.quote || motivationalModule.nextStep) guidance.motivationalSupport = motivationalModule;
      }
    } catch(e: any) {
      console.error("Error parsing Motivational Support:", e.message, modulesText[4]); 
    }
    console.log("Finished parsing. Generated guidance object:", JSON.parse(JSON.stringify(guidance)));
    return guidance;
  };

  const systemInstruction = `
You are HerPath AI, an extremely intelligent, empathetic, patient, and highly supportive AI assistant for CREED NGO. Your primary role is to act as a role-model mentor or a knowledgeable elder sister. You provide comprehensive, actionable guidance to females aged 4 to 60 in India, focusing on rural and underprivileged users.
Your guidance MUST be empowering, culturally sensitive, practical, and in the user's selected language (or simple English if English is chosen). Use "we" language frequently (e.g., "Let's explore...", "We can look into this together...", "We are strong!") to foster a sense of partnership and encouragement.
Acknowledge potential difficulties (like limited internet, financial stress, family pressure if mentioned by user) and offer reassurance and practical, low-cost/free solutions. Your tone should be exceptionally friendly, respectful, caring, and patient. Use emojis appropriately to make content engaging and easy to understand. Break down complex information into very small, simple steps.

Output Modules (for initial pathway generation):
Strictly generate all the following 5 modules in order. Each module's content MUST be followed by "--- END OF MODULE ---". Modules must not be nested.

1️⃣ EDUCATIONAL & CAREER PATHWAY (Your Foundational Roadmap)
   - This module is the user's initial step-by-step roadmap.
   - For each step in the pathway:
     Step [Number]: [Emoji relevant to step] [Clear Step Title/Action]
       DO: [Simple, actionable advice 1. Be very specific and easy to follow.]
       DO: [Simple, actionable advice 2 (optional)]
       DON'T: [Thing to avoid 1. Explain gently why.]
       DON'T: [Thing to avoid 2 (optional)]
       Resources: [Provide 2-4 resources using the emoji prefixes below. Each resource should have Name (Type: e.g., Video, Book PDF, Notes, Website - URL: MUST include a valid, publicly accessible URL. If a specific URL is unknown, provide a general official portal URL like 'https://www.swayam.gov.in', 'https://www.diksha.gov.in', 'https://epathshala.nic.in' or a descriptive placeholder like 'https://example.gov.in/search?q=[Resource+Name]' and CLEARLY STATE it's a general/placeholder link. Explain what the resource is for in simple terms.)]
         🎥 [Video Name (Type: Video - URL: ...)]
         📘 [Book Name (Type: Book with free PDF - URL: ...)]
         📓 [Notes/Material Name (Type: Downloadable Notes - URL: ...)]
         🌐 [Website/Platform Name (Type: Useful Website - URL: ...)]
       Tip: [Short motivational or practical life skill tip. Be very encouraging! e.g., "Remember, asking questions is a sign of strength! We can learn anything step-by-step."]
     --- (Use three hyphens as a separator ONLY BETWEEN steps within this module)
   - If user has no specific goal, suggest 2-3 suitable career paths relevant to their age and education level, and build the pathway towards one of them.
--- END OF MODULE ---

2️⃣ LIFE AWARENESS & SAFETY MODULE
   - Provide visual and emotional guidance tailored to the user's age group. Keep explanations extremely simple and respectful.
   - Structure:
     Age Group Focus: [e.g., For young girls (13-17 years)]
     Key Topic: [e.g., Staying Safe Online]
       Guidance Point: [Simple, empathetic advice 1. e.g., "Think of your password like a secret key to your diary, don't share it with anyone except your trusted elders."]
       Guidance Point: [Simple, empathetic advice 2]
       Visual Cue: [Suggest an easy-to-understand visual, e.g., "Illustration of a girl happily using a computer with a parent nearby", "A cartoon showing a lock on a phone screen"]
     Key Topic: [e.g., Understanding Good Touch and Bad Touch (for younger users if appropriate, otherwise focus on consent for older users)]
       Guidance Point: [Simple, empathetic advice. e.g., "Your body is your own. It's okay to say NO if someone makes you feel uncomfortable."]
       Visual Cue: [Suggest visual. e.g., "Drawing of a child confidently saying 'No'"]
   - Include an audio tip if helpful: (Audio Tip: My dear, let's talk about this gently. Remember you are precious.)
--- END OF MODULE ---

3️⃣ SCHOLARSHIPS, GOVERNMENT SCHEMES & WOMEN'S RIGHTS
   - List 2-4 highly relevant items for India, based on user's category. Focus on widely accessible and impactful schemes/rights.
   - Format for each item:
     [Emoji: 👩‍🎓/💰/⚖] [Type: Scholarship/Scheme/Right]: [Name of item]
       Details: [Brief description of benefit in very simple terms. Mention eligibility if it's easy to explain.]
       How to Access: [Provide official URL for application/information if available and well-known (e.g., National Scholarship Portal, a major state portal). If direct link is complex or unknown, give general advice like 'Ask a teacher or at the local Panchayat office about this scheme' OR 'Search for "[Scheme Name]" on the official India government website (india.gov.in).'. Clearly state if a link is a general portal. Example URL: https://scholarships.gov.in/]
       Source: [Official website/source if available with URL. Example: Ministry of Women & Child Development website.]
--- END OF MODULE ---

4️⃣ DIGITAL LEARNING & APP USAGE TRAINING (Using a Smartphone for Learning)
   - Teach how to use common mobile apps for education. Focus on extreme simplicity. Provide for 1-2 common apps like YouTube or Web Browser.
   - For EACH App entry, you MUST provide detailed, non-empty "How to Use" and "Example Search/Task". If you cannot provide these for an app concept, OMIT that App entry.
   - Format for each app:
     App: [e.g., YouTube]
       How to Use: [MUST BE NON-EMPTY. Provide very simple, numbered, step-by-step instructions. e.g., 1. Find the YouTube icon (it's red with a white play button). Tap it. 2. Look for the magnifying glass (🔍) at the top. Tap it. 3. Slowly type what you want to learn, like "learn English". 4. Tap the search button. We can do this together, slowly!]
       Example Search/Task: [MUST BE NON-EMPTY. e.g., "Find videos to learn simple English speaking on YouTube", "How to search for 'anganwadi services' using Google search on your phone"]
       Visual Cue: [Suggest a very simple visual, e.g., "Screenshot of YouTube app icon", "Drawing of a finger tapping a search bar"]
   - (Audio Tip: Don't worry if it seems new. We can try these steps one by one. You are very capable!)
--- END OF MODULE ---

5️⃣ MOTIVATIONAL SUPPORT + YOUR NEXT STEP
   - Format:
     🌟 Personalized Encouragement: [Offer a brief, personalized word of encouragement based on the user's input, particularly their challenges or interests. E.g., "I understand that [challenge mentioned by user, e.g., 'studying with family duties'] can be hard, but your desire to learn [interest mentioned by user, e.g., 'tailoring'] is wonderful! You are strong and we believe in you."]
     🌟 Motivational Quote: "[Inspiring, simple quote relevant to their situation and culture. e.g., 'A small step every day leads to big changes.' or a local proverb if appropriate]"
     ✅ Your Next Step: "[One very clear, small, actionable suggestion to do right now or very soon. e.g., 'Let's try to watch the first 5 minutes of the English learning video we found.' or 'How about we try to write down one thing you learned today?']"
     🔁 Remember: "You are not alone on this path. HerPath and CREED are here to support you. You can always come back for more guidance. Keep shining!"
--- END OF MODULE ---

AI Behavior:
- If user input is minimal, provide general, encouraging guidance for the selected category, still following the 5-module structure for initial pathway generation.
- For follow-up chat, maintain the same persona and context. Respond conversationally to questions about the generated pathway.
- If user mentions internet issues, prioritize suggesting offline accessible resources or learning methods.
- Language: Strictly use the user's 'Preferred Language' (Hindi or simple English). Do not use Thanglish or complex vocabulary.
- Tone: Exceptionally friendly, respectful, caring, patient, like a big sister or a very kind teacher. Use empowering and positive language consistently.
- Ensure all 5 modules are generated with the "--- END OF MODULE ---" separator for the initial pathway.
`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedGuidance(null);
    setChat(null); // Reset chat on new pathway generation
    setChatHistory([]); // Clear previous chat history

    console.log("Submitting guidance request with API Key:", apiKey ? "Exists" : "MISSING");

    if (!apiKey || apiKey === "MISSING_API_KEY") {
        setError(translate('pathwayError', "API Key is missing. Cannot generate pathway."));
        setIsLoading(false);
        console.error("API Key is missing.");
        return;
    }

    const selectedCategoryObj = GUIDANCE_CATEGORIES.find(c => c.id === category);
    const categoryName = selectedCategoryObj ? UI_TEXT[selectedCategoryObj.labelKey]?.[language] || selectedCategoryObj.id : category;
    const preferredLanguageString = language === Language.HI ? 'Hindi' : 'English (Simple)';

    const userContentForPathway = `
User Details for Initial Pathway Generation:
Category: ${categoryName}
Current Education/Class: ${educationLevel || 'Not specified'}
Preferred Language: ${preferredLanguageString}
Dream / Goal: ${careerGoal || 'Not specified'}
Challenges or Barriers: ${challenges || 'Not specified'}
Skills Known: ${skills || 'Not specified'}
Interests/Hobbies: ${interests || 'Not specified'}

Please generate the personalized 5-module guidance pathway based on these details and the system instructions provided.
Ensure "--- END OF MODULE ---" is present after each of the 5 modules.
Make sure to provide URLs or valid placeholder URLs for resources and schemes as instructed.
Adopt a very supportive, encouraging, and mentor-like tone throughout the response, using simple language suitable for users with limited literacy.
`;

    try {
      console.log("Sending request to Gemini API for initial pathway...");
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17', 
        contents: userContentForPathway,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4, 
        }
      });
      
      const guidanceText = response.text;
      
      if (guidanceText) {
        console.log("Raw AI Response Text (Initial Pathway):", guidanceText);
        const parsedData = parseGeneratedGuidanceText(guidanceText);
        const hasContent = parsedData.educationalPathway?.steps?.length ||
                           parsedData.lifeAwarenessModule?.topics?.length ||
                           parsedData.schemesAndRights?.length ||
                           parsedData.digitalLearningTips?.length ||
                           (parsedData.motivationalSupport?.quote || parsedData.motivationalSupport?.nextStep);

        if (hasContent) {
          setGeneratedGuidance(parsedData);
          // Initialize chat after successful pathway generation
          const newChatSession = ai.chats.create({
            model: 'gemini-2.5-flash-preview-04-17',
            history: [
              { role: 'user', parts: [{ text: userContentForPathway }] }, // Context of initial user request
              { role: 'model', parts: [{ text: guidanceText }] }      // Context of AI's initial pathway
            ],
            config: {
              systemInstruction: systemInstruction, // Same system instruction for consistent persona
              temperature: 0.5, // Slightly higher temp for more conversational chat
            }
          });
          setChat(newChatSession);
          // Optional: Add a system message to chat history UI if desired
          // setChatHistory([{ sender: 'ai', text: "Your pathway is ready! Feel free to ask any questions below.", timestamp: new Date() }]);
        } else {
          console.warn("Parsing resulted in empty or incomplete guidance. Raw text was:", guidanceText);
          setError(translate('pathwayError') + " (Could not understand the generated plan. Please try again or rephrase your input.)");
           setGeneratedGuidance({ rawResponse: guidanceText + "\n\n[Debug: Parsing resulted in empty or incomplete content based on structured checks.]"});
        }
      } else {
        console.warn("Gemini API returned no text in the response for initial pathway.");
        setError(translate('pathwayError') + " (No response text from AI. Check console for details.)");
        setGeneratedGuidance({ rawResponse: "API returned no text for initial pathway. Full response logged to console." });
      }
    } catch (apiError: any) {
      console.error("Gemini API error (Initial Pathway):", apiError);
      setError(`${translate('pathwayError')} Details: ${apiError.message || 'Unknown error'}`);
      setGeneratedGuidance({ rawResponse: `API Error (Initial Pathway): ${apiError.message || 'Unknown error'}. Check console for details.` });
    } finally {
      setIsLoading(false);
      console.log("Finished processing initial pathway request.");
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chat || isChatLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: chatInput, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    const currentChatInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      console.log("Sending chat message to Gemini API:", currentChatInput);
      const response = await chat.sendMessage({message: currentChatInput});
      const aiMessageText = response.text;
      
      if (aiMessageText) {
        console.log("Raw AI Chat Response Text:", aiMessageText);
        const aiMessage: ChatMessage = { sender: 'ai', text: aiMessageText, timestamp: new Date() };
        setChatHistory(prev => [...prev, aiMessage]);
      } else {
        console.warn("Gemini Chat API returned no text in the response.");
        const aiMessage: ChatMessage = { sender: 'ai', text: "I'm sorry, I couldn't process that. Could you try asking in a different way?", timestamp: new Date() };
        setChatHistory(prev => [...prev, aiMessage]);
      }
    } catch (chatApiError: any) {
      console.error("Gemini Chat API error:", chatApiError);
      const errorMessage: ChatMessage = { sender: 'ai', text: `Sorry, I encountered an error: ${chatApiError.message || 'Unknown chat error'}. Please try again.`, timestamp: new Date() };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
      console.log("Finished processing chat message.");
    }
  };
  
  const renderPathwayStepResource = (resource: PathwayStepResource) => {
    let resourceDisplay = resource.name;
    if (resource.type) {
        resourceDisplay = `${resource.name} (${resource.type})`;
    }
    if (resource.url) {
      return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
          {resourceDisplay} <i className="fas fa-external-link-alt text-xs"></i>
        </a>
      );
    }
    return <span className="text-gray-700">{resourceDisplay}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SectionTitle title={translate('smartPathway')} subtitle="Get personalized steps for your educational and professional journey." />

      <Card className="mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-1">{translate('selectCategory')}</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
              aria-describedby="category-description"
            >
              {GUIDANCE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-white text-gray-800">{translate(cat.labelKey, cat.id.replace(/_/g, ' '))}</option>
              ))}
            </select>
            <p id="category-description" className="text-sm text-gray-500 mt-1">Select the category that best describes you.</p>
          </div>
          <Input label={translate('currentEducationLevel')} id="educationLevel" value={educationLevel} onChange={e => setEducationLevel(e.target.value)} placeholder="E.g., Class 10, 2nd Year B.Sc." />
          <Input label={translate('careerGoal')} id="careerGoal" value={careerGoal} onChange={e => setCareerGoal(e.target.value)} placeholder="E.g., Teacher, Software Engineer, Entrepreneur" />
          <Input label={translate('challengesFaced')} id="challenges" value={challenges} onChange={e => setChallenges(e.target.value)} placeholder="E.g., Limited internet, need financial aid" />
          <Input label={translate('skillsKnown')} id="skills" value={skills} onChange={e => setSkills(e.target.value)} placeholder="E.g., Hindi, English, Basic MS Office" />
          <Input label={translate('interestsHobbies')} id="interests" value={interests} onChange={e => setInterests(e.target.value)} placeholder="E.g., Reading, Cooking, Coding" />
          <Button type="submit" disabled={isLoading || !apiKey || apiKey === "MISSING_API_KEY"} fullWidth size="lg" aria-live="polite">
            {isLoading && !isChatLoading ? translate('generatingPathway') : translate('generatePathway')}
          </Button>
           {(!apiKey || apiKey === "MISSING_API_KEY") && <p role="alert" className="text-red-500 text-sm text-center mt-2">API Key is missing. Pathway generation is disabled.</p>}
        </form>
      </Card>

      {isLoading && !isChatLoading && (
        <div role="status" className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-4xl text-teal-600" aria-hidden="true"></i>
          <p className="mt-2 text-lg text-gray-600">{translate('generatingPathway')}</p>
        </div>
      )}

      {error && (
        <Card className="bg-red-50 border-l-4 border-red-500 p-4 my-4" role="alert">
          <p className="text-red-700 font-semibold">{error}</p>
        </Card>
      )}

      {generatedGuidance && (
        <div className="space-y-8 mt-10">
          {/* Pathway Display (existing logic) */}
          {generatedGuidance.educationalPathway && generatedGuidance.educationalPathway.steps.length > 0 && (
            <Card>
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">1️⃣ Educational & Career Pathway</h2>
              <div className="space-y-6">
                {generatedGuidance.educationalPathway.steps.map((step, index) => (
                  <Card key={index} className="border border-teal-200 shadow-md">
                    <h3 className="text-xl font-semibold text-teal-700 mb-3">{step.stepTitle || `${translate('step')} ${index + 1}`}</h3>
                    {step.dos.length > 0 && (<div className="mb-2"><h4 className="text-md font-medium text-green-700"><i className="fas fa-check-circle mr-2" aria-hidden="true"></i>{translate('dos')}</h4><ul className="list-disc list-inside text-gray-700 pl-4">{step.dos.map((item, i) => <li key={i}>{item}</li>)}</ul></div>)}
                    {step.donts.length > 0 && (<div className="mb-2"><h4 className="text-md font-medium text-red-700"><i className="fas fa-times-circle mr-2" aria-hidden="true"></i>{translate('donts')}</h4><ul className="list-disc list-inside text-gray-700 pl-4">{step.donts.map((item, i) => <li key={i}>{item}</li>)}</ul></div>)}
                    {step.resources.length > 0 && (<div className="mb-2"><h4 className="text-md font-medium text-blue-700"><i className="fas fa-book-reader mr-2" aria-hidden="true"></i>{translate('resources')}</h4><ul className="list-disc list-inside text-gray-700 pl-4">{step.resources.map((item, i) => <li key={i}>{renderPathwayStepResource(item)}</li>)}</ul></div>)}
                    {step.tip && (<div><h4 className="text-md font-medium text-amber-700"><i className="fas fa-lightbulb mr-2" aria-hidden="true"></i>{translate('tip')}</h4><p className="text-gray-700 italic pl-4">{step.tip}</p></div>)}
                  </Card>
                ))}
              </div>
            </Card>
          )}
          {generatedGuidance.lifeAwarenessModule && (generatedGuidance.lifeAwarenessModule.ageGroupFocus || generatedGuidance.lifeAwarenessModule.topics.length > 0) && (
            <Card>
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">2️⃣ Life Awareness & Safety</h2>
                {generatedGuidance.lifeAwarenessModule.ageGroupFocus && <p className="text-lg text-gray-700 mb-3"><strong>Focus:</strong> {generatedGuidance.lifeAwarenessModule.ageGroupFocus}</p>}
                <div className="space-y-6">
                    {generatedGuidance.lifeAwarenessModule.topics.map((topic,idx) => (
                        <Card key={idx} className="border border-gray-200 shadow-sm">
                            <h4 className="text-xl font-medium text-teal-600 mb-2">{topic.topicTitle}</h4>
                            {topic.guidancePoints.map((gp, gpIdx) => (
                                <div key={gpIdx} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0">
                                    <p className="text-gray-700 flex items-start">
                                      <i className="fas fa-lightbulb text-yellow-500 mr-2 mt-1 flex-shrink-0" aria-hidden="true"></i>
                                      <span>{gp.point}</span>
                                    </p>
                                    {gp.visualCue && (
                                      <div className="mt-2 pl-6">
                                        {/* Removed img tag that used picsum.photos */}
                                        <p className="text-xs text-gray-500 italic mt-1 p-2 bg-gray-50 rounded text-center">Visual suggestion: {gp.visualCue}</p>
                                      </div>
                                    )}
                                </div>
                            ))}
                            {topic.audioTip && <p className="text-sm text-blue-500 mt-2 pl-2 italic"><i className="fas fa-volume-up mr-1" aria-hidden="true"></i> {topic.audioTip}</p>}
                        </Card>
                    ))}
                </div>
            </Card>
          )}
          {generatedGuidance.schemesAndRights && generatedGuidance.schemesAndRights.length > 0 && (
            <Card>
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">3️⃣ Scholarships, Schemes & Rights</h2>
               <ul className="space-y-4">
                {generatedGuidance.schemesAndRights.map((item, index) => (
                  <li key={index} className="p-3 border rounded-md">
                    <h4 className="text-xl font-medium text-teal-600 mb-1">{item.emoji} {item.type}: {item.name}</h4>
                    <p className="text-gray-700 mb-1"><strong>Details:</strong> {item.details}</p>
                    <p className="text-gray-700">
                        <strong>How to Access:</strong> {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">{item.howToAccess.replace(item.url, '').trim() || item.howToAccess} <i className="fas fa-external-link-alt text-xs" aria-hidden="true"></i></a> : item.howToAccess}
                    </p>
                    {item.source && <p className="text-sm text-gray-500"><strong>Source:</strong> {extractUrl(item.source) ? <a href={extractUrl(item.source)!} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">{item.source.replace(extractUrl(item.source)!, '').trim() || item.source} <i className="fas fa-external-link-alt text-xs" aria-hidden="true"></i></a> : item.source}</p>}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        {generatedGuidance.digitalLearningTips && generatedGuidance.digitalLearningTips.length > 0 && (
            <Card>
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">4️⃣ Digital Learning Tips</h2>
                <div className="space-y-4">
                    {generatedGuidance.digitalLearningTips.map((tip, index) =>(
                        <div key={index} className="p-3 border rounded-md">
                            <h4 className="text-xl font-medium text-teal-600">App: {tip.app}</h4>
                            {tip.howToUse.split('\n').map((line, lineIdx) => (
                              <p key={lineIdx} className="text-gray-700 my-1">{lineIdx === 0 ? <strong>How to Use: </strong> : null}{line.replace(/^How to Use\s*[:\-]?\s*/i, "")}</p>
                            ))}
                            <p className="text-gray-700"><strong>Example Task:</strong> "{tip.exampleSearchOrTask}"</p>
                            {tip.visualCue && <p className="text-sm text-gray-500 italic mt-1">(Visual idea: {tip.visualCue})</p>}
                            {tip.audioTip && <p className="text-sm text-blue-500 mt-1 italic"><i className="fas fa-volume-up mr-1" aria-hidden="true"></i> {tip.audioTip}</p>}
                        </div>
                    ))}
                </div>
            </Card>
          )}
          {generatedGuidance.motivationalSupport && (generatedGuidance.motivationalSupport.personalizedEncouragement || generatedGuidance.motivationalSupport.quote || generatedGuidance.motivationalSupport.nextStep) && (
             <Card className="bg-teal-50 border-l-4 border-teal-500">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">5️⃣ Motivational Support</h2>
                {generatedGuidance.motivationalSupport.personalizedEncouragement && <p className="text-lg text-teal-800 mb-3">🌟 {generatedGuidance.motivationalSupport.personalizedEncouragement}</p>}
                {generatedGuidance.motivationalSupport.quote && <p className="text-lg italic text-teal-800 mb-3">🌟 "{generatedGuidance.motivationalSupport.quote}"</p>}
                {generatedGuidance.motivationalSupport.nextStep && <p className="text-lg text-gray-700 mb-2">✅ <strong>Your Next Step:</strong> {generatedGuidance.motivationalSupport.nextStep}</p>}
                {generatedGuidance.motivationalSupport.reminder && <p className="text-md text-gray-600">🔁 {generatedGuidance.motivationalSupport.reminder}</p>}
            </Card>
          )}
          
          {/* Chat Section */}
          {chat && (
            <Card className="mt-8">
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">Talk to HerPath AI</h2>
              <div ref={chatHistoryRef} className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl p-3 rounded-xl shadow ${msg.sender === 'user' ? 'bg-teal-500 text-white' : 'bg-white text-gray-800'}`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.timestamp && <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-teal-100' : 'text-gray-400'}`}>{msg.timestamp.toLocaleTimeString()}</p>}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xl p-3 rounded-lg shadow bg-white text-gray-800">
                      <i className="fas fa-spinner fa-spin mr-2"></i> AI is typing...
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="flex-grow !mb-0" // Override default margin bottom from Input component
                  wrapperClassName="flex-grow !mb-0"
                  disabled={isChatLoading || !apiKey || apiKey === "MISSING_API_KEY"}
                />
                <Button type="submit" disabled={isChatLoading || !chatInput.trim() || !apiKey || apiKey === "MISSING_API_KEY"}>
                  <i className="fas fa-paper-plane mr-2"></i> Send
                </Button>
              </form>
            </Card>
          )}

          {generatedGuidance.rawResponse && generatedGuidance.rawResponse.includes("[Debug: Parsing resulted in empty or incomplete content based on structured checks.]") && (
            <Card className="mt-6 border-amber-500 bg-amber-50">
              <h3 className="text-lg font-semibold text-amber-700">Debugging Information:</h3>
              <p className="text-sm text-amber-600 mb-2">The AI responded, but the application couldn't fully understand the structure of the plan. The raw response from the AI is shown below for technical review.</p>
              <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded mt-2 max-h-96 overflow-y-auto">{generatedGuidance.rawResponse}</pre>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidancePathwayScreen;