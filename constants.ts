
import { Language, Translations } from './types';

export const APP_NAME = "HerPath";
export const APP_TAGLINE = "Guiding Women Toward Brighter Futures";
export const NGO_NAME = "CREED";

export const APP_ROUTES = {
  WELCOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  HOME: '/home',
  // PROFILE: '/profile', // Removed, to be merged into Settings
  SETTINGS: '/settings',
  // EDUCATIONAL_RESOURCES: '/educational-resources', // Removed
  WOMEN_AWARENESS: '/women-awareness', // Existing women awareness (age-specific)
  // SKILL_DEVELOPMENT: '/skill-development', // Removed
  // FINANCIAL_LITERACY: '/financial-literacy', // Removed, merged into Skill Development
  // SCHEMES_BENEFITS: '/schemes-benefits', // Removed, replaced by WOMEN_LAW_AWARENESS
  WOMEN_LAW_AWARENESS: '/women-law-awareness', // New
  // SCHOLARSHIPS_GRANTS: '/scholarships-grants', // Removed, merged into SCHEMES_BENEFITS
  // HEALTH_WELLNESS: '/health-wellness', // Removed, merged into AWARENESS_LIFE_SKILLS
  // JOB_OPPORTUNITIES: '/job-opportunities', // Removed
  // MENTORSHIP_CONNECT: '/mentorship-connect', // Removed
  BRAIN_QUIZZES: '/brain-quizzes', // New
  // COMMUNITY_FORUM: '/community-forum', // Removed
  EMERGENCY_CONTACTS: '/emergency-contacts',
  // MOTIVATIONAL_STORIES: '/success-stories', // Removed
  HELP: '/help',
  SMART_PATHWAY: '/smart-pathway', // Was GUIDANCE_PATHWAY
  AWARENESS_LIFE_SKILLS: '/awareness-life-skills', 
  LEARN_TO_USE_APPS: '/learn-to-use-apps', 
};

export const UI_TEXT: Translations = {
  // General
  appName: { [Language.EN]: APP_NAME, [Language.HI]: "हरपथ", [Language.TA]: "ஹர் பாத்" },
  appTagline: { [Language.EN]: APP_TAGLINE, [Language.HI]: "महिलाओं को उज्जवल भविष्य की ओर मार्गदर्शन", [Language.TA]: "பெண்களை பிரகாசமான எதிர்காலத்தை நோக்கி வழிநடத்துதல்" },
  ngoName: { [Language.EN]: NGO_NAME, [Language.HI]: "क्रीड", [Language.TA]: "க்ரீட்" },
  loading: { [Language.EN]: "Loading...", [Language.HI]: "लोड हो रहा है...", [Language.TA]: "ஏற்றுகிறது..." },
  submit: { [Language.EN]: "Submit", [Language.HI]: "प्रस्तुत करें", [Language.TA]: "சமர்ப்பி" },
  save: { [Language.EN]: "Save", [Language.HI]: "सहेजें", [Language.TA]: "சேமி" },
  cancel: { [Language.EN]: "Cancel", [Language.HI]: "रद्द करें", [Language.TA]: "ரத்துசெய்" },
  search: { [Language.EN]: "Search", [Language.HI]: "खोजें", [Language.TA]: "தேடு" },
  viewDetails: { [Language.EN]: "View Details", [Language.HI]: "विवरण देखें", [Language.TA]: "விவரங்களைக் காண்க" },
  selectLanguage: { [Language.EN]: "Select Language", [Language.HI]: "भाषा चुने", [Language.TA]: "மொழியை தேர்ந்தெடுங்கள்" },
  send: { [Language.EN]: "Send", [Language.HI]: "भेजें", [Language.TA]: "அனுப்பு" },
  
  // Welcome Screen
  getStarted: { [Language.EN]: "Get Started", [Language.HI]: "शुरू करें", [Language.TA]: "தொடங்குங்கள்" },
  welcomeToHerPath: { [Language.EN]: `Welcome to ${APP_NAME}`, [Language.HI]: `हरपथ में आपका स्वागत है`, [Language.TA]: `${APP_NAME}க்கு வரவேற்கிறோம்` },

  // Auth
  register: { [Language.EN]: "Register", [Language.HI]: "पंजीकरण करें", [Language.TA]: "பதிவு செய்க" },
  login: { [Language.EN]: "Login", [Language.HI]: "लॉग इन करें", [Language.TA]: "உள்நுழை" },
  logout: { [Language.EN]: "Logout", [Language.HI]: "लॉग आउट", [Language.TA]: "வெளியேறு" },
  email: { [Language.EN]: "Email", [Language.HI]: "ईमेल", [Language.TA]: "மின்னஞ்சல்" },
  password: { [Language.EN]: "Password", [Language.HI]: "पासवर्ड", [Language.TA]: "கடவுச்சொல்" },
  name: { [Language.EN]: "Name", [Language.HI]: "नाम", [Language.TA]: "பெயர்" },
  alreadyHaveAccount: { [Language.EN]: "Already have an account? Login", [Language.HI]: "पहले से ही खाता है? लॉग इन करें", [Language.TA]: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்" },
  dontHaveAccount: { [Language.EN]: "Don't have an account? Register", [Language.HI]: "खाता नहीं है? पंजीकरण करें", [Language.TA]: "கணக்கு இல்லையா? பதிவு செய்யவும்" },

  // Navigation / Titles
  home: { [Language.EN]: "Home", [Language.HI]: "होम", [Language.TA]: "முகப்பு" },
  settings: { [Language.EN]: "Settings", [Language.HI]: "सेटिंग्स", [Language.TA]: "அமைப்புகள்" },
  womenAwareness: { [Language.EN]: "Women Awareness (Age-specific)", [Language.HI]: "महिला जागरूकता (आयु-विशिष्ट)", [Language.TA]: "பெண்கள் விழிப்புணர்வு (வயதுக்கு ஏற்ப)" }, // Clarified from generic womenAwareness
  // schemesBenefits: { [Language.EN]: "Schemes & Govt. Benefits", [Language.HI]: "योजनाएं और सरकारी लाभ", [Language.TA]: "திட்டங்கள் மற்றும் அரசு நலன்கள்" }, // Removed
  womenLawAwareness: { [Language.EN]: "Women Law Awareness (18+)", [Language.HI]: "महिला कानून जागरूकता (18+)", [Language.TA]: "பெண்கள் சட்ட விழிப்புணர்வு (18+)" }, // New
  brainQuizzes: { [Language.EN]: "Brain Quizzes", [Language.HI]: "ब्रेन क्विज़", [Language.TA]: "மூளை வினாடி வினாக்கள்" },
  emergencyContacts: { [Language.EN]: "Emergency Contacts", [Language.HI]: "आपातकालीन संपर्क", [Language.TA]: "அவசர தொடர்புகள்" },
  helpSupport: { [Language.EN]: "Help & Support", [Language.HI]: "सहायता और समर्थन", [Language.TA]: "உதவி மற்றும் ஆதரவு" },
  smartPathway: { [Language.EN]: "Smart Pathway (Career + Education)", [Language.HI]: "स्मार्ट मार्ग (करियर + शिक्षा)", [Language.TA]: "ஸ்மார்ட் பாதை (தொழில் + கல்வி)" }, 
  awarenessLifeSkills: { [Language.EN]: "Awareness & Life Skills", [Language.HI]: "जागरूकता और जीवन कौशल", [Language.TA]: "விழிப்புணர்வு மற்றும் வாழ்க்கை திறன்கள்" },
  
  // Learn to Use Apps
  learnToUseApps: { [Language.EN]: "Learn to Use Apps (Digital Help)", [Language.HI]: "ऐप्स का उपयोग करना सीखें (डिजिटल सहायता)", [Language.TA]: "செயலிகளைக் பயன்படுத்தக் கற்றுக்கொள்ளுங்கள் (டிஜிட்டல் உதவி)" },
  learnToUseAppsSubtitle: { [Language.EN]: "Discover apps and websites to achieve your goals.", [Language.HI]: "अपने लक्ष्यों को प्राप्त करने के लिए ऐप्स और वेबसाइटें खोजें।", [Language.TA]: "உங்கள் இலக்குகளை அடைய பயன்பாடுகள் மற்றும் வலைத்தளங்களைக் கண்டறியவும்." },
  whatIsYourGoal: { [Language.EN]: "What is your goal or interest?", [Language.HI]: "आपका लक्ष्य या रुचि क्या है?", [Language.TA]: "உங்கள் இலக்கு அல்லது ஆர்வம் என்ன?" },
  goalInputPlaceholder: { [Language.EN]: "E.g., learn cooking, find a job, improve English", [Language.HI]: "जैसे, खाना बनाना सीखना, नौकरी ढूंढना, अंग्रेजी सुधारना", [Language.TA]: "எ.கா., சமையல் கற்றுக்கொள்ளுங்கள், வேலை தேடுங்கள், ஆங்கிலத்தை மேம்படுத்துங்கள்" },
  getSuggestions: { [Language.EN]: "Get Suggestions", [Language.HI]: "सुझाव प्राप्त करें", [Language.TA]: "பரிந்துரைகளைப் பெறுங்கள்" },
  generatingSuggestions: { [Language.EN]: "Getting suggestions...", [Language.HI]: "सुझाव मिल रहे हैं...", [Language.TA]: "பரிந்துரைகள் பெறப்படுகின்றன..." },
  appRecommendations: { [Language.EN]: "App/Website Recommendations", [Language.HI]: "ऐप/वेबसाइट सिफारिशें", [Language.TA]: "பயன்பாடு/வலைத்தள பரிந்துரைகள்" },
  usageDescription: { [Language.EN]: "What it's used for", [Language.HI]: "इसका उपयोग किस लिए किया जाता है", [Language.TA]: "இது எதற்காகப் பயன்படுத்தப்படுகிறது" },
  howToUse: { [Language.EN]: "How to Use", [Language.HI]: "कैसे इस्तेमाल करे", [Language.TA]: "எப்படி உபயோகிப்பது" },
  officialLink: { [Language.EN]: "Official Link", [Language.HI]: "आधिकारिक लिंक", [Language.TA]: "அதிகாரப்பூர்வ இணைப்பு" },
  benefits: { [Language.EN]: "Benefits", [Language.HI]: "लाभ", [Language.TA]: "நன்மைகள்" },
  safetyTips: { [Language.EN]: "Safety Tips", [Language.HI]: "सुरक्षा टिप्स", [Language.TA]: "பாதுகாப்பு குறிப்புகள்" },
  noSuggestionsFound: { [Language.EN]: "No suggestions found for your query. Try a different goal or check back later.", [Language.HI]: "आपकी क्वेरी के लिए कोई सुझाव नहीं मिला। कोई भिन्न लक्ष्य आज़माएँ या बाद में पुनः जाँच करें।", [Language.TA]: "உங்கள் வினவலுக்குப் பரிந்துரைகள் எதுவும் கிடைக்கவில்லை. வேறு இலக்கை முயற்சிக்கவும் அல்லது பின்னர் மீண்டும் பார்க்கவும்." },
  aiError: { [Language.EN]: "Could not get suggestions at this time. Please try again later.", [Language.HI]: "इस समय सुझाव प्राप्त नहीं हो सके। कृपया बाद में पुनः प्रयास करें।", [Language.TA]: "இந்த நேரத்தில் பரிந்துரைகளைப் பெற முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்." },
  watchVideoGuide: { [Language.EN]: "Watch Video Guide", [Language.HI]: "वीडियो गाइड देखें", [Language.TA]: "வீடியோ வழிகாட்டியைப் பார்க்கவும்" },
  readTextGuide: { [Language.EN]: "Read Text Guide", [Language.HI]: "पाठ गाइड पढ़ें", [Language.TA]: "உரை வழிகாட்டியைப் படியுங்கள்" },
  visitWebsite: { [Language.EN]: "Visit Website/App", [Language.HI]: "वेबसाइट/ऐप पर जाएं", [Language.TA]: "வலைத்தளம்/செயலியைப் பார்வையிடவும்" },
  chatWithAssistant: { [Language.EN]: "Chat with Assistant", [Language.HI]: "सहायक से चैट करें", [Language.TA]: "உதவியாளருடன் அரட்டையடிக்கவும்" },
  askAboutApps: { [Language.EN]: "Ask questions about the recommended apps or how to use them.", [Language.HI]: "अनुशंसित ऐप्स या उनका उपयोग करने के तरीके के बारे में प्रश्न पूछें।", [Language.TA]: "பரிந்துரைக்கப்பட்ட பயன்பாடுகள் அல்லது அவற்றை எவ்வாறு பயன்படுத்துவது என்பது பற்றிய கேள்ிகளைக் கேளுங்கள்." },
  askFollowUpQuestions: { [Language.EN]: "You can ask follow-up questions below.", [Language.HI]: "आप नीचे अनुवर्ती प्रश्न पूछ सकते हैं।", [Language.TA]: "நீங்கள் கீழே பின்தொடர் கேள்விகளைக் கேட்கலாம்." },
  aiTyping: { [Language.EN]: "Assistant is typing...", [Language.HI]: "सहायक टाइप कर रहा है...", [Language.TA]: "உதவியாளர் தட்டச்சு செய்கிறார்..." },
  typeYourQuestion: { [Language.EN]: "Type your question here...", [Language.HI]: "अपना प्रश्न यहाँ लिखें...", [Language.TA]: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்க..." },

  // Women Awareness (Age-Specific) Feature
  womenAwarenessSubtitle: { [Language.EN]: "Age-specific awareness for girls and women.", [Language.HI]: "लड़कियों और महिलाओं के लिए आयु-विशिष्ट जागरूकता।", [Language.TA]: " பெண்கள் மற்றும் சிறுமிகளுக்கான வயதுக்கேற்ற விழிப்புணர்வு." },
  enterYourAge: { [Language.EN]: "Enter Your Age", [Language.HI]: "अपनी उम्र दर्ज करें", [Language.TA]: "உங்கள் வயதை உள்ளிடவும்" },
  ageInputPlaceholder: { [Language.EN]: "E.g., 5, 15, 30", [Language.HI]: "जैसे, 5, 15, 30", [Language.TA]: "எ.கா., 5, 15, 30" },
  getAwarenessTips: { [Language.EN]: "Get Awareness Tips", [Language.HI]: "जागरूकता सुझाव प्राप्त करें", [Language.TA]: "விழிப்புணர்வு குறிப்புகளைப் பெறுங்கள்" },
  generatingAwarenessTips: { [Language.EN]: "Getting awareness tips...", [Language.HI]: "जागरूकता सुझाव मिल रहे हैं...", [Language.TA]: "விழிப்புணர்வு குறிப்புகள் பெறப்படுகின்றன..." },
  awarenessPointsForAge: { [Language.EN]: "Awareness Points for Age", [Language.HI]: "आयु के लिए जागरूकता बिंदु", [Language.TA]: "வயதுக்கான விழிப்புணர்வு புள்ளிகள்" },
  noAwarenessTipsFound: { [Language.EN]: "No awareness tips found for the specified age. Please try a different age or check back later.", [Language.HI]: "निर्दिष्ट आयु के लिए कोई जागरूकता सुझाव नहीं मिला। कृपया कोई भिन्न आयु आज़माएँ या बाद में पुनः जाँच करें।", [Language.TA]: "குறிப்பிட்ட வயதுக்கு விழிப்புணர்வு குறிப்புகள் எதுவும் கிடைக்கவில்லை. வேறு வயதை முயற்சிக்கவும் அல்லது பின்னர் மீண்டும் பார்க்கவும்." },
  imageSuggestion: { [Language.EN]: "Visual Idea", [Language.HI]: "दृश्य विचार", [Language.TA]: "காட்சி யோசனை" },
  awarenessChatTitle: { [Language.EN]: "Talk with Caring Partner (Your Caring Guide)", [Language.HI]: "देखभाल करने वाले साथी से बात करें (आपकी देखभाल करने वाली मार्गदर्शिका)", [Language.TA]: "அக்கறையுள்ள துணையுடன் பேசுங்கள் (உங்கள் அக்கறையுள்ள வழிகாட்டி)" },
  awarenessChatSubtitle: { [Language.EN]: "Share your thoughts or ask about health and personal concerns.", [Language.HI]: "अपने विचार साझा करें या स्वास्थ्य और व्यक्तिगत चिंताओं के बारे में पूछें।", [Language.TA]: "உங்கள் எண்ணங்களைப் பகிர்ந்து கொள்ளுங்கள் அல்லது உடல்நலம் மற்றும் தனிப்பட்ட கவலைகள் குறித்து கேளுங்கள்." },
  awarenessChatPlaceholder: { [Language.EN]: "Type your thoughts or questions here...", [Language.HI]: "अपने विचार या प्रश्न यहाँ लिखें...", [Language.TA]: "உங்கள் எண்ணங்கள் அல்லது கேள்விகளை இங்கே தட்டச்சு செய்க..." },
  awarenessChatInitialMessage: { [Language.EN]: "Hello! I'm your Caring Partner, your caring guide. The awareness points for your age are above. How are you feeling today? You can talk to me about anything that's on your mind or ask about health or personal matters. I'm here to listen and support you.", [Language.HI]: "नमस्ते! मैं आपका देखभाल करने वाला साथी हूँ, आपकी देखभाल करने वाली मार्गदर्शिका। आपकी उम्र के लिए जागरूकता बिंदु ऊपर दिए गए हैं। आज आप कैसा महसूस कर रही हैं? आप मुझसे अपने मन की कोई भी बात कर सकती हैं या स्वास्थ्य या व्यक्तिगत मामलों के बारे में पूछ सकती हैं। मैं आपको सुनने और समर्थन करने के लिए यहाँ हूँ।", [Language.TA]: "வணக்கம்! நான் உங்கள் அக்கறையுள்ள துணை, உங்கள் அக்கறையுள்ள வழிகாட்டி. உங்கள் வயதுக்கான விழிப்புணர்வு குறிப்புகள் மேலே உள்ளன. இன்று நீங்கள் எப்படி உணருகிறீர்கள்? உங்கள் மனதில் உள்ள எதையும் என்னிடம் பேசலாம் அல்லது உடல்நலம் அல்லது தனிப்பட்ட விஷயங்களைப் பற்றி கேட்கலாம். நான் உங்களைக் கேட்கவும் உங்களுக்கு ஆதரவளிக்கவும் இங்கே இருக்கிறேன்." },


  // Settings
  language: { [Language.EN]: "Language", [Language.HI]: "भाषा", [Language.TA]: "மொழி" },
  notifications: { [Language.EN]: "Notifications", [Language.HI]: "सूचनाएं", [Language.TA]: "அறிவிப்புகள்" },
  enablePushNotifications: { [Language.EN]: "Enable Push Notifications", [Language.HI]: "पुश सूचनाएं सक्षम करें", [Language.TA]: "புஷ் அறிவிப்புகளை இயக்கு" },
  
  // Common terms for features
  uploadDocument: { [Language.EN]: "Upload Document", [Language.HI]: "दस्तावेज़ अपलोड करें", [Language.TA]: "ஆவணத்தைப் பதிவேற்று" },
  searchPlaceholder: { [Language.EN]: "Type to search...", [Language.HI]: "खोजने के लिए टाइप करें...", [Language.TA]: "தேட தட்டச்சு செய்க..." },
  featureComingSoon: { [Language.EN]: "feature is under development.", [Language.HI]: "सुविधा विकासधीन है।", [Language.TA]: "அம்சம் உருவாக்கத்தில் உள்ளது." },
  checkBackLater: { [Language.EN]: "Please check back later for updates.", [Language.HI]: "कृपया अपडेट के लिए बाद में जांचें।", [Language.TA]: "புதுப்பிப்புகளுக்கு பின்னர் சரிபார்க்கவும்." },

  // Guidance Pathway Screen (now Smart Pathway)
  selectCategory: { [Language.EN]: "Select Your Category", [Language.HI]: "अपनी श्रेणी चुनें", [Language.TA]: "உங்கள் வகையைத் தேர்ந்தெடுக்கவும்" },
  categoryKindergarten: { [Language.EN]: "Kindergarten Student", [Language.HI]: "किंडरगार्टन छात्र", [Language.TA]: "மழலையர் பள்ளி மாணவர்" },
  categoryPrimarySchool: { [Language.EN]: "Primary School Student (Age 6-12)", [Language.HI]: "प्राथमिक विद्यालय छात्र (आयु 6-12)", [Language.TA]: "தொடக்கப் பள்ளி மாணவர் (வயது 6-12)" },
  categoryHigherSecondarySchool: { [Language.EN]: "Higher Secondary School Student (Age 13-17)", [Language.HI]: "उच्चतर माध्यमिक विद्यालय छात्र (आयु 13-17)", [Language.TA]: "உயர்நிலைப் பள்ளி மாணவர் (வயது 13-17)" },
  categoryCollegeStudent: { [Language.EN]: "College Student (Age 18-22)", [Language.HI]: "कॉलेज छात्र (आयु 18-22)", [Language.TA]: "கல்லூரி மாணவர் (வயது 18-22)" },
  categoryWorkingProfessional: { [Language.EN]: "Working Professional Woman (Age 23-60)", [Language.HI]: "कार्यरत पेशेवर महिला (आयु 23-60)", [Language.TA]: "வேலை செய்யும் தொழில்முறை பெண் (வயது 23-60)" },
  currentEducationLevel: { [Language.EN]: "Current Education Level/Class (Optional)", [Language.HI]: "वर्तमान शिक्षा स्तर/कक्षा (वैकल्पिक)", [Language.TA]: "தற்போதைய கல்வி நிலை/வகுப்பு (விருப்பத்தேர்வு)" },
  careerGoal: { [Language.EN]: "Career Goal (Optional)", [Language.HI]: "कैरियर लक्ष्य (वैकल्पिक)", [Language.TA]: "தொழில் இலக்கு (விருப்பத்தேர்வு)" },
  challengesFaced: { [Language.EN]: "Challenges Faced (Optional, e.g., financial, family support)", [Language.HI]: "सामना की गई चुनौतियाँ (वैकल्पिक, जैसे, वित्तीय, पारिवारिक समर्थन)", [Language.TA]: "எதிர்கொள்ளும் சவால்கள் (விருப்பத்தேர்வு, எ.கா., நிதி, குடும்ப ஆதரவு)" },
  skillsKnown: { [Language.EN]: "Skills Known (Optional, e.g., languages, tech)", [Language.HI]: "ज्ञात कौशल (वैकल्पिक, जैसे, भाषाएँ, तकनीक)", [Language.TA]: "தெரிந்த திறன்கள் (விருப்பத்தேர்வு, எ.கா., மொழிகள், தொழில்நுட்பம்)" },
  interestsHobbies: { [Language.EN]: "Interests/Hobbies (Optional)", [Language.HI]: "रुचियाँ/शौक (वैकल्पिक)", [Language.TA]: "விருப்பங்கள்/பொழுதுபோக்குகள் (விருப்பத்தேர்வு)" },
  generatePathway: { [Language.EN]: "Generate Pathway", [Language.HI]: "मार्ग उत्पन्न करें", [Language.TA]: "பாதையை உருவாக்கு" },
  generatingPathway: { [Language.EN]: "Generating your personalized pathway...", [Language.HI]: "आपका व्यक्तिगत मार्ग उत्पन्न हो रहा है...", [Language.TA]: "உங்கள் தனிப்பயனாக்கப்பட்ட பாதை உருவாக்கப்படுகிறது..." },
  pathwayError: { [Language.EN]: "Could not generate pathway. Please try again.", [Language.HI]: "मार्ग उत्पन्न नहीं किया जा सका। कृपया पुनः प्रयास करें।", [Language.TA]: "பாதையை உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்." },
  yourPersonalizedPathway: { [Language.EN]: "Your Personalized Pathway", [Language.HI]: "आपका व्यक्तिगत मार्ग", [Language.TA]: "உங்கள் தனிப்பயனாக்கப்பட்ட பாதை" },
  step: { [Language.EN]: "Step", [Language.HI]: "चरण", [Language.TA]: "படி" },
  dos: { [Language.EN]: "DOs", [Language.HI]: "क्या करें", [Language.TA]: "செய்ய வேண்டியவை" },
  donts: { [Language.EN]: "DON'Ts", [Language.HI]: "क्या न करें", [Language.TA]: "செய்யக்கூடாதவை" },
  resources: { [Language.EN]: "Resources", [Language.HI]: "संसाधन", [Language.TA]: "வளங்கள்" },
  tip: { [Language.EN]: "Tip", [Language.HI]: "सुझाव", [Language.TA]: "குறிப்பு" },
  motivation: { [Language.EN]: "Motivation", [Language.HI]: "प्रेरणा", [Language.TA]: "ஊக்கம்" },

  showMore: { [Language.EN]: "Show More", [Language.HI]: "और दिखाओ", [Language.TA]: "மேலும் காட்டு" },
  showLess: { [Language.EN]: "Show Less", [Language.HI]: "कम दिखाओ", [Language.TA]: "குறைவாக காட்டு" },

  // Brain Quizzes
  brainQuizzesTitle: { [Language.EN]: "Brain Quizzes", [Language.HI]: "ब्रेन क्विज़", [Language.TA]: "மூளை வினாடி வினாக்கள்" },
  brainQuizzesSubtitle: { [Language.EN]: "Test your knowledge and have fun!", [Language.HI]: "अपने ज्ञान का परीक्षण करें और मज़े करें!", [Language.TA]: "உங்கள் அறிவை சோதித்து மகிழுங்கள்!" },
  startQuiz: { [Language.EN]: "Start Quiz", [Language.HI]: "क्विज़ शुरू करें", [Language.TA]: "வினாடி வினாவைத் தொடங்கு" },
  nextQuestion: { [Language.EN]: "Next Question", [Language.HI]: "अगला प्रश्न", [Language.TA]: "அடுத்த கேள்வி" },
  submitAnswer: { [Language.EN]: "Submit Answer", [Language.HI]: "उत्तर सबमिट करें", [Language.TA]: "பதிலைச் சமர்ப்பி" },
  quizCompleted: { [Language.EN]: "Quiz Completed!", [Language.HI]: "क्विज़ पूरी हुई!", [Language.TA]: "வினாடி வினா முடிந்தது!" },
  yourScore: { [Language.EN]: "Your Score", [Language.HI]: "आपका स्कोर", [Language.TA]: "உங்கள் மதிப்பெண்" },
  playAgain: { [Language.EN]: "Play Again", [Language.HI]: "फिर से खेलें", [Language.TA]: "மீண்டும் விளையாடு" },
  correctAnswer: { [Language.EN]: "Correct!", [Language.HI]: "सही!", [Language.TA]: "சரி!" },
  incorrectAnswer: { [Language.EN]: "Incorrect!", [Language.HI]: "गलत!", [Language.TA]: "தவறு!" },
  question: { [Language.EN]: "Question", [Language.HI]: "प्रश्न", [Language.TA]: "கேள்வி" },
  of: { [Language.EN]: "of", [Language.HI]: "का", [Language.TA]: "இல்" },
  quizExplanation: { [Language.EN]: "Explanation", [Language.HI]: "स्पष्टीकरण", [Language.TA]: "விளக்கம்" },

  // Women Law Awareness
  womenLawAwarenessTitle: { [Language.EN]: "Women Law Awareness (18+)", [Language.HI]: "महिला कानून जागरूकता (18+)", [Language.TA]: "பெண்கள் சட்ட விழிப்புணர்வு (18+)" },
  womenLawAwarenessSubtitle: { [Language.EN]: "Know your rights. Important Indian laws concerning women.", [Language.HI]: "अपने अधिकार जानें। महिलाओं से संबंधित महत्वपूर्ण भारतीय कानून।", [Language.TA]: "உங்கள் உரிமைகளை அறிந்து கொள்ளுங்கள். பெண்களைப் பற்றிய முக்கியமான இந்தியச் சட்டங்கள்." },
  lawNamePocso: { [Language.EN]: "POCSO Act (2012)", [Language.HI]: "पॉक्सो अधिनियम (2012)", [Language.TA]: "போக்சோ சட்டம் (2012)" },
  lawNameIPC354: { [Language.EN]: "IPC Section 354", [Language.HI]: "आईपीसी धारा 354", [Language.TA]: "இபிச பிரிவு 354" },
  lawNameIPC375_376: { [Language.EN]: "IPC Section 375/376 (Rape)", [Language.HI]: "आईपीसी धारा 375/376 (बलात्कार)", [Language.TA]: "இபிச பிரிவு 375/376 (கற்பழிப்பு)" },
  lawNameWorkplaceHarassment: { [Language.EN]: "Sexual Harassment of Women at Workplace Act (2013)", [Language.HI]: "कार्यस्थल पर महिलाओं का यौन उत्पीड़न अधिनियम (2013)", [Language.TA]: "பணிபுரியும் இடங்களில் பெண்கள் மீதான பாலியல் துன்புறுத்தல் சட்டம் (2013)" },
  lawNameDomesticViolence: { [Language.EN]: "Domestic Violence Act (2005)", [Language.HI]: "घरेलू हिंसा अधिनियम (2005)", [Language.TA]: "குடும்ப வன்முறைச் சட்டம் (2005)" },
  // Add other law name keys as needed

  lawFullForm: { [Language.EN]: "Full Form", [Language.HI]: "पूरा नाम", [Language.TA]: "முழு வடிவம்" },
  lawApplicability: { [Language.EN]: "Whom It Applies To", [Language.HI]: "किस पर लागू होता है", [Language.TA]: "யாருக்கு இது பொருந்தும்" },
  lawCrimesCovered: { [Language.EN]: "What Crimes/Scenarios It Covers", [Language.HI]: "कौन से अपराध/परिदृश्य शामिल हैं", [Language.TA]: "என்ன குற்றங்கள்/சூழல்களை இது உள்ளடக்கியது" },
  lawVictimRights: { [Language.EN]: "Victim’s Legal Rights", [Language.HI]: "पीड़ित के कानूनी अधिकार", [Language.TA]: "பாதிக்கப்பட்டவரின் சட்ட உரிமைகள்" },
  lawPunishmentPenalty: { [Language.EN]: "Punishment and Penalty for Offenders", [Language.HI]: "अपराधियों के लिए सज़ा और जुर्माना", [Language.TA]: "குற்றவாளிகளுக்கான தண்டனை மற்றும் அபராதம்" },
  lawRealLifeExample: { [Language.EN]: "Simple Real-Life Example", [Language.HI]: "सरल वास्तविक जीवन का उदाहरण", [Language.TA]: "எளிய நிஜ வாழ்க்கை உதாரணம்" },
  inEnglish: { [Language.EN]: "In English", [Language.HI]: "अंग्रेजी में", [Language.TA]: "ஆங்கிலத்தில்" },
  inHindi: { [Language.EN]: "In Hindi", [Language.HI]: "हिंदी में", [Language.TA]: "இந்தியில்" },
  inTamil: { [Language.EN]: "In Tamil", [Language.HI]: "तमिल में", [Language.TA]: "தமிழில்" },

  // Help Screen - App Tutorial & FAQ
  howToUseHerPathTitle: { [Language.EN]: "How to Use HerPath App", [Language.HI]: "हरपथ ऐप का उपयोग कैसे करें", [Language.TA]: "ஹெர்பாத் செயலியை எவ்வாறு பயன்படுத்துவது" },
  howToUseHerPathIntro: { [Language.EN]: "Here's a simple guide to help you get started with the HerPath app and make the most of its features:", [Language.HI]: "हरपथ ऐप के साथ आरंभ करने और इसकी विशेषताओं का अधिकतम लाभ उठाने में आपकी सहायता के लिए यहां एक सरल मार्गदर्शिका दी गई है:", [Language.TA]: "ஹெர்பாத் செயலியுடன் தொடங்குவதற்கும் அதன் அம்சங்களை最大限மாகப் பயன்படுத்துவதற்கும் உங்களுக்கு உதவ ஒரு எளிய வழிகாட்டி இங்கே:" },
  navigationSidebarTitle: { [Language.EN]: "Finding Your Way (Sidebar Menu)", [Language.HI]: "अपना रास्ता खोजना (साइडबार मेनू)", [Language.TA]: "உங்கள் வழியைக் கண்டறிதல் (பக்கப்பட்டி பட்டி)" },
  navigationSidebarDesc1: { [Language.EN]: "The app has a main menu, usually on the left side. On smaller phone screens, you might need to tap a button with three lines (☰) to open it.", [Language.HI]: "ऐप में एक मुख्य मेनू होता है, जो आमतौर पर बाईं ओर होता है। छोटी फोन स्क्रीन पर, इसे खोलने के लिए आपको तीन पंक्तियों (☰) वाले बटन पर टैप करने की आवश्यकता हो सकती है।", [Language.TA]: "செயலியில் ஒரு முக்கிய பட்டி உள்ளது, பொதுவாக இடது பக்கத்தில் இருக்கும். சிறிய தொலைபேசித் திரைகளில், அதைத் திறக்க நீங்கள் மூன்று கோடுகள் (☰) கொண்ட பொத்தானைத் தட்ட வேண்டியிருக்கும்." },
  navigationSidebarDesc2: { [Language.EN]: "This menu has links to all parts of the app, like 'Home', 'Smart Pathway', 'Settings', and more.", [Language.HI]: "इस मेनू में ऐप के सभी भागों के लिंक हैं, जैसे 'होम', 'स्मार्ट पाथवे', 'सेटिंग्स', आदि।", [Language.TA]: " இந்தப் பட்டியில் 'முகப்பு', 'ஸ்மார்ட் பாதை', 'அமைப்புகள்' மற்றும் பல போன்ற செயலியின் அனைத்து பகுதிகளுக்கான இணைப்புகள் உள்ளன." },
  homeScreenTitle: { [Language.EN]: "Home Screen", [Language.HI]: "होम स्क्रीन", [Language.TA]: "முகப்புத் திரை" },
  homeScreenDesc: { [Language.EN]: "Your starting point is the 'Home' screen. It shows quick links to important features and helpful information.", [Language.HI]: "आपका प्रारंभिक बिंदु 'होम' स्क्रीन है। यह महत्वपूर्ण सुविधाओं और उपयोगी जानकारी के त्वरित लिंक दिखाता है।", [Language.TA]: "உங்கள் தொடக்கப் புள்ளி 'முகப்புத் திரை'. இது முக்கியமான அம்சங்கள் மற்றும் பயனுள்ள தகவல்களுக்கான விரைவான இணைப்புகளைக் காட்டுகிறது." },
  usingKeyFeaturesTitle: { [Language.EN]: "Using Key Features", [Language.HI]: "मुख्य विशेषताओं का उपयोग करना", [Language.TA]: "முக்கிய அம்சங்களைப் பயன்படுத்துதல்" },
  featureSmartPathwayDesc: { [Language.EN]: "Tap here to get personalized guidance for your education and career. Fill in the form and tap 'Generate Pathway'. You can then chat with an AI mentor about your plan.", [Language.HI]: "अपनी शिक्षा और करियर के लिए व्यक्तिगत मार्गदर्शन प्राप्त करने के लिए यहां टैप करें। फ़ॉर्म भरें और 'मार्ग उत्पन्न करें' पर टैप करें। फिर आप अपनी योजना के बारे में AI सलाहकार से चैट कर सकते हैं।", [Language.TA]: "உங்கள் கல்வி மற்றும் தொழிலுக்கு தனிப்பயனாக்கப்பட்ட வழிகாட்டலைப் பெற இங்கே தட்டவும். படிவத்தை பூர்த்தி செய்து 'பாதையை உருவாக்கு' என்பதைத் தட்டவும். பின்னர் உங்கள் திட்டம் குறித்து AI வழிகாட்டியுடன் அரட்டையடிக்கலாம்." },
  featureWomenAwarenessDesc: { [Language.EN]: "Get awareness tips based on your age. Enter your age, tap 'Get Awareness Tips', and then you can chat with your Caring Partner, our caring AI guide, about health or personal matters.", [Language.HI]: "अपनी उम्र के आधार पर जागरूकता सुझाव प्राप्त करें। अपनी उम्र दर्ज करें, 'जागरूकता सुझाव प्राप्त करें' पर टैप करें, और फिर आप स्वास्थ्य या व्यक्तिगत मामलों के बारे में हमारी देखभाल करने वाली AI गाइड, अपने देखभाल करने वाले साथी से चैट कर सकती हैं।", [Language.TA]: "உங்கள் வயதின் அடிப்படையில் விழிப்புணர்வு உதவிக்குறிப்புகளைப் பெறுங்கள். உங்கள் வயதை உள்ளிட்டு, 'விழிப்புணர்வு உதவிக்குறிப்புகளைப் பெறு' என்பதைத் தட்டவும், பின்னர் உடல்நலம் அல்லது தனிப்பட்ட விஷயங்கள் குறித்து எங்கள் அக்கறையுள்ள AI வழிகாட்டியான உங்கள் அக்கறையுள்ள துணையுடன் அரட்டையடிக்கலாம்." },
  featureWomenLawDesc: { [Language.EN]: "Learn about important laws for women in India. Tap to expand and read details in different languages.", [Language.HI]: "भारत में महिलाओं के लिए महत्वपूर्ण कानूनों के बारे में जानें। विभिन्न भाषाओं में विवरण पढ़ने के लिए विस्तार करने के लिए टैप करें।", [Language.TA]: "இந்தியாவில் பெண்களுக்கான முக்கியமான சட்டங்களைப் பற்றி அறிக. வெவ்வேறு மொழிகளில் விவரங்களைப் படிக்க விரிவாக்க தட்டவும்." },
  featureLearnAppsDesc: { [Language.EN]: "Discover helpful apps and websites. Type your goal (like 'learn cooking') and get suggestions. A chat assistant is also available to help you understand the suggestions.", [Language.HI]: "सहायक ऐप्स और वेबसाइटें खोजें। अपना लक्ष्य टाइप करें (जैसे 'खाना बनाना सीखें') और सुझाव प्राप्त करें। सुझावों को समझने में आपकी सहायता के लिए एक चैट सहायक भी उपलब्ध है।", [Language.TA]: "பயனுள்ள செயலிகள் மற்றும் வலைத்தளங்களைக் கண்டறியவும். உங்கள் இலக்கை (எ.கா., 'சமையல் கற்றுக்கொள்') தட்டச்சு செய்து பரிந்துரைகளைப் பெறுங்கள். பரிந்துரைகளைப் புரிந்துகொள்ள உங்களுக்கு உதவ ஒரு அரட்டை உதவியாளரும் உள்ளார்." },
  featureBrainQuizzesDesc: { [Language.EN]: "Challenge yourself with fun quizzes and test your knowledge on various topics.", [Language.HI]: "मज़ेदार क्विज़ के साथ खुद को चुनौती दें और विभिन्न विषयों पर अपने ज्ञान का परीक्षण करें।", [Language.TA]: "வேடிக்கையான வினாடி வினாக்களுடன் உங்களை நீங்களே சவால் விடுங்கள் மற்றும் பல்வேறு தலைப்புகளில் உங்கள் அறிவை சோதிக்கவும்." },
  featureEmergencyDesc: { [Language.EN]: "Find important phone numbers like Police (100) or Women Helpline (1091).", [Language.HI]: "पुलिस (100) या महिला हेल्पलाइन (1091) जैसे महत्वपूर्ण फ़ोन नंबर खोजें।", [Language.TA]: "காவல்துறை (100) அல்லது பெண்கள் உதவி எண் (1091) போன்ற முக்கியமான தொலைபேசி எண்களைக் கண்டறியவும்." },
  settingsTitle: { [Language.EN]: "Settings & Language", [Language.HI]: "सेटिंग्स और भाषा", [Language.TA]: "அமைப்புகள் மற்றும் மொழி" },
  settingsLanguageDesc: { [Language.EN]: "You can change the app's language to English, Hindi, or Tamil. Go to 'Settings' from the menu, or find the language selector directly in the sidebar menu.", [Language.HI]: "आप ऐप की भाषा को अंग्रेजी, हिंदी या तमिल में बदल सकते हैं। मेनू से 'सेटिंग्स' पर जाएं, या सीधे साइडबार मेनू में भाषा चयनकर्ता ढूंढें।", [Language.TA]: "நீங்கள் செயலியின் மொழியை ஆங்கிலம், இந்தி அல்லது தமிழுக்கு மாற்றலாம். பக்கப்பட்டியில் இருந்து 'அமைப்புகள்' என்பதற்குச் செல்லவும், அல்லது நேரடியாக பக்கப்பட்டி பட்டியில் மொழித் தேர்ந்தெடுப்பானைக் கண்டறியவும்." },
  settingsNotificationsDesc: { [Language.EN]: "In 'Settings', you can also manage notification preferences (coming soon).", [Language.HI]: "'सेटिंग्स' में, आप सूचना वरीयताओं का प्रबंधन भी कर सकते हैं (जल्द ही आ रहा है)।", [Language.TA]: "'அமைப்புகளில்', நீங்கள் அறிவிப்பு விருப்பங்களையும் நிர்வகிக்கலாம் (விரைவில்)." },
  loggingOutTitle: { [Language.EN]: "Logging Out", [Language.HI]: "लॉग आउट करना", [Language.TA]: "வெளியேறுதல்" },
  loggingOutDesc: { [Language.EN]: "To sign out of the app, find the 'Logout' button, usually at the bottom of the sidebar menu.", [Language.HI]: "ऐप से साइन आउट करने के लिए, 'लॉगआउट' बटन ढूंढें, जो आमतौर पर साइडबार मेनू के नीचे होता है।", [Language.TA]: "செயலியிலிருந்து வெளியேற, பக்கப்பட்டி பட்டியின் கீழே பொதுவாக இருக்கும் 'வெளியேறு' பொத்தானைக் கண்டறியவும்." },
  generalTipTitle: { [Language.EN]: "Explore and Ask", [Language.HI]: "अन्वेषण करें और पूछें", [Language.TA]: "ஆராய்ந்து கேளுங்கள்" },
  generalTipDesc: { [Language.EN]: "Don't be afraid to tap on different sections to see what they offer. If you need more help, you can always come back to this 'Help & Support' section or use the chat features within specific modules.", [Language.HI]: "विभिन्न अनुभागों पर टैप करने से न डरें कि वे क्या प्रदान करते हैं। यदि आपको अधिक सहायता की आवश्यकता है, तो आप हमेशा इस 'सहायता और समर्थन' अनुभाग में वापस आ सकते हैं या विशिष्ट मॉड्यूल के भीतर चैट सुविधाओं का उपयोग कर सकते हैं।", [Language.TA]: "அவை என்ன வழங்குகின்றன என்பதைப் பார்க்க வெவ்வேறு பிரிவுகளில் தட்ட பயப்பட வேண்டாம். உங்களுக்கு கூடுதல் உதவி தேவைப்பட்டால், நீங்கள் எப்போதும் இந்த 'உதவி மற்றும் ஆதரவு' பகுதிக்குத் திரும்பலாம் அல்லது குறிப்பிட்ட தொகுதிகளுக்குள் அரட்டை அம்சங்களைப் பயன்படுத்தலாம்." },
  
  faqTitle: { [Language.EN]: "Frequently Asked Questions (FAQ)", [Language.HI]: "अक्सर पूछे जाने वाले प्रश्न (FAQ)", [Language.TA]: "அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)" },
  contactSupportTitle: { [Language.EN]: "Contact Support", [Language.HI]: "सहायता से संपर्क करें", [Language.TA]: "ஆதரவைத் தொடர்புகொள்க" },
  contactSupportDesc: { [Language.EN]: "If you need further assistance or have specific issues, please contact us:", [Language.HI]: "यदि आपको और सहायता चाहिए या कोई विशिष्ट समस्या है, तो कृपया हमसे संपर्क करें:", [Language.TA]: "உங்களுக்கு கூடுதல் உதவி தேவைப்பட்டால் அல்லது குறிப்பிட்ட சிக்கல்கள் இருந்தால், தயவுசெய்து எங்களை தொடர்பு கொள்ளவும்:" },
  contactSupportEmail: { [Language.EN]: "creed.ngo@gmail.com", [Language.HI]: "creed.ngo@gmail.com", [Language.TA]: "creed.ngo@gmail.com" },
  contactSupportPhone: { [Language.EN]: "04144-224987", [Language.HI]: "04144-224987", [Language.TA]: "04144-224987" },


  // FAQ Questions and Answers
  faqQ1Title: { [Language.EN]: "How do I change the app language?", [Language.HI]: "मैं ऐप की भाषा कैसे बदलूं?", [Language.TA]: "நான் செயலியின் மொழியை மாற்றுவது எப்படி?" },
  faqQ1Answer1: { [Language.EN]: "You can change the app's language (English, Hindi, Tamil) in two ways:", [Language.HI]: "आप ऐप की भाषा (अंग्रेजी, हिंदी, तमिल) को दो तरीकों से बदल सकते हैं:", [Language.TA]: "நீங்கள் செயலியின் மொழியை (ஆங்கிலம், இந்தி, தமிழ்) இரண்டு வழிகளில் மாற்றலாம்:" },
  faqQ1Answer2: { [Language.EN]: "1. Go to 'Settings' from the main menu in the sidebar. You will find the language selection option there.", [Language.HI]: "1. साइडबार में मुख्य मेनू से 'सेटिंग्स' पर जाएं। आपको वहां भाषा चयन विकल्प मिलेगा।", [Language.TA]: "1. பக்கப்பட்டியில் உள்ள பிரதான மெனுவிலிருந்து 'அமைப்புகள்' என்பதற்குச் செல்லவும். அங்கு மொழித் தேர்வு விருப்பத்தைக் காண்பீர்கள்." },
  faqQ1Answer3: { [Language.EN]: "2. Use the language selector directly available at the top of the sidebar menu. Your preference will be saved for your next visit.", [Language.HI]: "2. सीधे साइडबार मेनू के शीर्ष पर उपलब्ध भाषा चयनकर्ता का उपयोग करें। आपकी प्राथमिकता आपकी अगली विज़िट के लिए सहेज ली जाएगी।", [Language.TA]: "2. பக்கப்பட்டி மெனுவின் மேலே நேரடியாக கிடைக்கும் மொழித் தேர்வானைப் பயன்படுத்தவும். உங்கள் விருப்பம் உங்கள் அடுத்த வருகைக்காக சேமிக்கப்படும்." },

  faqQ2Title: { [Language.EN]: "How can I get personalized guidance (Smart Pathway)?", [Language.HI]: "मैं व्यक्तिगत मार्गदर्शन (स्मार्ट पाथवे) कैसे प्राप्त कर सकता हूं?", [Language.TA]: "நான் தனிப்பயனாக்கப்பட்ட வழிகாட்டலை (ஸ்மார்ட் பாதை) பெறுவது எப்படி?" },
  faqQ2Answer1: { [Language.EN]: "Go to the 'Smart Pathway (Career + Education)' section from the sidebar menu.", [Language.HI]: "साइडबार मेनू से 'स्मार्ट पाथवे (करियर + शिक्षा)' अनुभाग पर जाएं।", [Language.TA]: "பக்கப்பட்டி மெனுவிலிருந்து 'ஸ்மார்ட் பாதை (தொழில் + கல்வி)' பகுதிக்குச் செல்லவும்." },
  faqQ2Answer2: { [Language.EN]: "1. Select your current category (e.g., student, working professional).", [Language.HI]: "1. अपनी वर्तमान श्रेणी चुनें (जैसे, छात्र, कामकाजी पेशेवर)।", [Language.TA]: "1. உங்கள் தற்போதைய வகையைத் தேர்ந்தெடுக்கவும் (எ.கா., மாணவர், பணிபுரியும் நிபுணர்)." },
  faqQ2Answer3: { [Language.EN]: "2. Fill in the optional details like your education level, career goals, challenges, skills, and interests. The more information you provide, the better the guidance.", [Language.HI]: "2. अपने शिक्षा स्तर, करियर लक्ष्य, चुनौतियों, कौशल और रुचियों जैसे वैकल्पिक विवरण भरें। आप जितनी अधिक जानकारी प्रदान करेंगे, मार्गदर्शन उतना ही बेहतर होगा।", [Language.TA]: "2. உங்கள் கல்வி நிலை, தொழில் இலக்குகள், சவால்கள், திறன்கள் மற்றும் ஆர்வங்கள் போன்ற விருப்ப விவரங்களை நிரப்பவும். நீங்கள் எவ்வளவு ఎక్కువ தகவல்களை வழங்குகிறீர்களோ, அவ்வளவு சிறந்த வழிகாட்டல் கிடைக்கும்." },
  faqQ2Answer4: { [Language.EN]: "3. Tap the 'Generate Pathway' button. The app will provide a step-by-step plan. You can then chat with an AI mentor to discuss this plan further.", [Language.HI]: "3. 'मार्ग उत्पन्न करें' बटन पर टैप करें। ऐप एक चरण-दर-चरण योजना प्रदान करेगा। फिर आप इस योजना पर आगे चर्चा करने के लिए AI सलाहकार से चैट कर सकते हैं।", [Language.TA]: "3. 'பாதையை உருவாக்கு' பொத்தானைத் தட்டவும். செயலி படிப்படியான திட்டத்தை வழங்கும். இந்தத் திட்டத்தைப் பற்றி மேலும் விவாதிக்க நீங்கள் ஒரு AI வழிகாட்டியுடன் அரட்டையடிக்கலாம்." },
  
  faqQ3Title: { [Language.EN]: "What if I forget my password?", [Language.HI]: "अगर मैं अपना पासवर्ड भूल जाऊं तो क्या होगा?", [Language.TA]: "நான் எனது கடவுச்சொல்லை மறந்துவிட்டால் என்ன செய்வது?" },
  faqQ3Answer: { [Language.EN]: "Currently, the app uses a simple login system for demonstration purposes (email: user@example.com, password: password). For a real application, a 'Forgot Password' feature would allow you to reset it via email. Always use strong, unique passwords for your accounts.", [Language.HI]: "वर्तमान में, ऐप प्रदर्शन उद्देश्यों के लिए एक सरल लॉगिन प्रणाली का उपयोग करता है (ईमेल: user@example.com, पासवर्ड: password)। एक वास्तविक एप्लिकेशन के लिए, 'पासवर्ड भूल गए' सुविधा आपको ईमेल के माध्यम से इसे रीसेट करने की अनुमति देगी। हमेशा अपने खातों के लिए मजबूत, अद्वितीय पासवर्ड का उपयोग करें।", [Language.TA]: "தற்போது, செயலி ஆர்ப்பாட்ட நோக்கங்களுக்காக ஒரு எளிய உள்நுழைவு முறையைப் பயன்படுத்துகிறது (மின்னஞ்சல்: user@example.com, கடவுச்சொல்: password). ஒரு உண்மையான பயன்பாட்டிற்கு, 'கடவுச்சொல்லை மறந்துவிட்டேன்' அம்சம் மின்னஞ்சல் மூலம் அதை மீட்டமைக்க உங்களை அனுமதிக்கும். உங்கள் கணக்குகளுக்கு எப்போதும் வலுவான, தனித்துவமான கடவுச்சொற்களைப் பயன்படுத்தவும்." },

  faqQ4Title: { [Language.EN]: "Is my personal information safe in this app?", [Language.HI]: "क्या इस ऐप में मेरी व्यक्तिगत जानकारी सुरक्षित है?", [Language.TA]: "இந்த செயலியில் எனது தனிப்பட்ட தகவல்கள் பாதுகாப்பாக உள்ளதா?" },
  faqQ4Answer: { [Language.EN]: "HerPath is currently a demonstration app. In a real-world scenario, we would take your privacy and data security very seriously. All personal data would be handled according to strict privacy policies and security measures to protect your information. For this demo, user data is stored locally on your device or simulated.", [Language.HI]: "हरपथ वर्तमान में एक प्रदर्शन ऐप है। वास्तविक दुनिया के परिदृश्य में, हम आपकी गोपनीयता और डेटा सुरक्षा को बहुत गंभीरता से लेंगे। आपकी जानकारी की सुरक्षा के लिए सभी व्यक्तिगत डेटा को सख्त गोपनीयता नीतियों और सुरक्षा उपायों के अनुसार संभाला जाएगा। इस डेमो के लिए, उपयोगकर्ता डेटा आपके डिवाइस पर स्थानीय रूप से संग्रहीत या नकली है।", [Language.TA]: "ஹெர்பாத் தற்போது ஒரு ஆர்ப்பாட்ட செயலி. நிஜ உலக சூழ்நிலையில், உங்கள் தனியுரிமை மற்றும் தரவு பாதுகாப்பை நாங்கள் மிகவும் தீவிரமாக எடுத்துக்கொள்வோம். உங்கள் தகவல்களைப் பாதுகாக்க அனைத்து தனிப்பட்ட தரவுகளும் கடுமையான தனியுரிமைக் கொள்கைகள் மற்றும் பாதுகாப்பு நடவடிக்கைகளின்படி கையாளப்படும். இந்த டெமோவிற்கு, பயனர் தரவு உங்கள் சாதனத்தில் உள்நாட்டில் சேமிக்கப்படுகிறது அல்லது உருவகப்படுத்தப்படுகிறது." },

  faqQ5Title: { [Language.EN]: "How do I use the chat features (Caring Partner, Pathway Mentor, App Assistant)?", [Language.HI]: "मैं चैट सुविधाओं (देखभाल करने वाला साथी, पाथवे मेंटर, ऐप असिस्टेंट) का उपयोग कैसे करूं?", [Language.TA]: "அரட்டை அம்சங்களை (அக்கறையுள்ள துணை, பாதை வழிகாட்டி, செயலி உதவியாளர்) நான் எவ்வாறு பயன்படுத்துவது?" },
  faqQ5AnswerSahana: { [Language.EN]: "Caring Partner (Women Awareness): After getting awareness tips for your age, a chat window with your Caring Partner will appear. Type your thoughts or questions about health or personal matters in the input box and tap 'Send'.", [Language.HI]: "देखभाल करने वाला साथी (महिला जागरूकता): अपनी उम्र के लिए जागरूकता सुझाव प्राप्त करने के बाद, आपके देखभाल करने वाले साथी के साथ एक चैट विंडो दिखाई देगी। स्वास्थ्य या व्यक्तिगत मामलों के बारे में अपने विचार या प्रश्न इनपुट बॉक्स में टाइप करें और 'भेजें' पर टैप करें।", [Language.TA]: "அக்கறையுள்ள துணை (பெண்கள் விழிப்புணர்வு): உங்கள் வயதுக்கான விழிப்புணர்வு உதவிக்குறிப்புகளைப் பெற்ற பிறகு, உங்கள் அக்கறையுள்ள துணையுடன் ஒரு அரட்டை சாளரம் தோன்றும். உடல்நலம் அல்லது தனிப்பட்ட விஷயங்களைப் பற்றிய உங்கள் எண்ணங்கள் அல்லது கேள்விகளை உள்ளீட்டு பெட்டியில் தட்டச்சு செய்து 'அனுப்பு' என்பதைத் தட்டவும்." },
  faqQ5AnswerMentor: { [Language.EN]: "Pathway Mentor (Smart Pathway): After your personalized pathway is generated, a chat section will appear below it. Use this to ask questions about your educational or career plan.", [Language.HI]: "पाथवे मेंटर (स्मार्ट पाथवे): आपका व्यक्तिगत मार्ग उत्पन्न होने के बाद, उसके नीचे एक चैट अनुभाग दिखाई देगा। इसका उपयोग अपनी शैक्षिक या करियर योजना के बारे में प्रश्न पूछने के लिए करें।", [Language.TA]: "பாதை வழிகாட்டி (ஸ்மார்ட் பாதை): உங்கள் தனிப்பயனாக்கப்பட்ட பாதை உருவாக்கப்பட்ட பிறகு, அதற்குக் கீழே ஒரு அரட்டைப் பகுதி தோன்றும். உங்கள் கல்வி அல்லது தொழில் திட்டம் குறித்த கேள்விகளைக் கேட்க இதைப் பயன்படுத்தவும்." },
  faqQ5AnswerAppAssistant: { [Language.EN]: "App Assistant (Learn to Use Apps): After you get app/website suggestions for your goal, a chat assistant will be available. You can ask questions about the recommended apps or how to use them.", [Language.HI]: "ऐप असिस्टेंट (ऐप्स का उपयोग करना सीखें): अपने लक्ष्य के लिए ऐप/वेबसाइट सुझाव प्राप्त करने के बाद, एक चैट सहायक उपलब्ध होगा। आप अनुशंसित ऐप्स या उनका उपयोग करने के तरीके के बारे में प्रश्न पूछ सकते हैं।", [Language.TA]: "செயலி உதவியாளர் (செயலிகளைப் பயன்படுத்தக் கற்றுக்கொள்ளுங்கள்): உங்கள் இலக்குக்கான செயலி/வலைத்தள பரிந்துரைகளைப் பெற்ற பிறகு, ஒரு அரட்டை உதவியாளர் கிடைப்பார். பரிந்துரைக்கப்பட்ட செயலிகள் அல்லது அவற்றை எவ்வாறு பயன்படுத்துவது என்பது குறித்த கேள்விகளை நீங்கள் கேட்கலாம்." },
  faqQ5AnswerGeneral: { [Language.EN]: "Simply type your message in the input box at the bottom of the chat screen and tap the 'Send' button. The AI will respond to assist you.", [Language.HI]: "बस चैट स्क्रीन के नीचे इनपुट बॉक्स में अपना संदेश टाइप करें और 'भेजें' बटन पर टैप करें। AI आपकी सहायता के लिए जवाब देगा।", [Language.TA]: "அரட்டைத் திரையின் கீழே உள்ள உள்ளீட்டு பெட்டியில் உங்கள் செய்தியைத் தட்டச்சு செய்து 'அனுப்பு' பொத்தானைத் தட்டவும். AI உங்களுக்கு உதவ பதிலளிக்கும்." },

  faqQ6Title: { [Language.EN]: "Where can I find emergency contact numbers?", [Language.HI]: "मुझे आपातकालीन संपर्क नंबर कहां मिल सकते हैं?", [Language.TA]: "அவசர தொடர்பு எண்களை நான் எங்கே காணலாம்?" },
  faqQ6Answer: { [Language.EN]: "Tap on 'Emergency Contacts' in the sidebar menu. This section lists important helpline numbers like Police (100), Women Helpline (1091), Ambulance (102), and Child Helpline (1098). You can tap the 'Call' button next to a number to initiate a call (this is a simulation in the current app).", [Language.HI]: "साइडबार मेनू में 'आपातकालीन संपर्क' पर टैप करें। यह अनुभाग पुलिस (100), महिला हेल्पलाइन (1091), एम्बुलेंस (102), और चाइल्ड हेल्पलाइन (1098) जैसे महत्वपूर्ण हेल्पलाइन नंबरों को सूचीबद्ध करता है। कॉल शुरू करने के लिए आप किसी नंबर के आगे 'कॉल' बटन पर टैप कर सकते हैं (यह वर्तमान ऐप में एक सिमुलेशन है)।", [Language.TA]: "பக்கப்பட்டி மெனுவில் 'அவசர தொடர்புகள்' என்பதைத் தட்டவும். இந்தப் பிரிவு காவல்துறை (100), பெண்கள் உதவி எண் (1091), ஆம்புலன்ஸ் (102), மற்றும் குழந்தை உதவி எண் (1098) போன்ற முக்கியமான உதவி எண்களை பட்டியலிடுகிறது. அழைப்பைத் தொடங்க ஒரு எண்ணுக்கு அடுத்துள்ள 'அழை' பொத்தானைத் தட்டலாம் (இது தற்போதைய செயலியில் ஒரு உருவகப்படுத்துதலாகும்)." },
};

export const PRIMARY_COLOR = 'teal-600'; // Tailwind CSS class
export const ACCENT_COLOR = 'amber-500'; // Tailwind CSS class
export const TEXT_COLOR_PRIMARY = 'text-gray-800';
export const TEXT_COLOR_SECONDARY = 'text-gray-600';
export const BACKGROUND_COLOR_LIGHT = 'bg-gray-50';
export const BACKGROUND_COLOR_WHITE = 'bg-white';
export const GUIDANCE_CATEGORIES = [
  { id: 'kindergarten', labelKey: 'categoryKindergarten' },
  { id: 'primary_school', labelKey: 'categoryPrimarySchool' },
  { id: 'higher_secondary_school', labelKey: 'categoryHigherSecondarySchool' },
  { id: 'college_student', labelKey: 'categoryCollegeStudent' },
  { id: 'working_professional', labelKey: 'categoryWorkingProfessional' },
];
