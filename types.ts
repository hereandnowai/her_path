export interface User {
  id: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  // Add other relevant user fields
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course_link';
  url: string;
  tags: string[];
  language: string;
}

export interface SkillCourse {
  id: string;
  title: string;
  description: string;
  provider: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon?: string; // e.g., font-awesome class
  url: string;
}

export interface FinancialTool {
  id: string;
  name: string;
  description: string;
  type: 'budget_planner' | 'savings_calculator' | 'investment_guide';
  link?: string; // Link to an external tool or internal page
}

export interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  applicationLink: string;
  category: string; // e.g., Education, Health, Employment
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  applyLink: string;
  postedDate: string;
}

// Mentor interface removed
// export interface Mentor {
//   id: string;
//   name: string;
//   expertise: string[];
//   bio: string;
//   availability: string;
//   imageUrl?: string;
// }

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  repliesCount: number;
  tags: string[];
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: User;
  createdAt: string;
}

// ProgressMetric and AchievementBadge removed

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  type: 'Police' | 'Ambulance' | 'Women Helpline' | 'Child Helpline' | 'NGO Support';
}

export interface ScholarshipGrant {
  id: string;
  name: string;
  description: string;
  provider: string;
  eligibility: string;
  amount: string;
  deadline: string;
  applicationLink: string;
}

export interface HealthWellnessResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'helpline' | 'exercise_routine';
  link?: string;
  category: 'Mental Health' | 'Physical Health' | 'Nutrition';
}

// SuccessStory interface removed
// SuccessStoryVideo interface removed


export enum Language {
  EN = 'en',
  HI = 'hi',
  TA = 'ta', // Tamil
  // Add other regional languages as needed
  // e.g., TE = 'te' (Telugu)
}

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

// --- New Interfaces for Comprehensive Guidance Pathway ---

export interface PathwayStepResource {
  name: string;
  type?: string;
  url?: string;
}

export interface PathwayStep {
  stepTitle: string;
  dos: string[];
  donts: string[];
  resources: PathwayStepResource[];
  tip: string;
}

export interface EducationalPathwayModule {
  steps: PathwayStep[];
}

// LearningResourceItem removed as per user request to remove the module

export interface LifeAwarenessGuidancePoint {
  point: string;
  visualCue?: string;
}
export interface LifeAwarenessTopic {
  topicTitle: string;
  guidancePoints: LifeAwarenessGuidancePoint[];
  audioTip?: string;
}

export interface LifeAwarenessModule {
  ageGroupFocus: string;
  topics: LifeAwarenessTopic[];
}

export interface SchemeOrRightItem {
  emoji?: string;
  type: string; // Scholarship, Scheme, Right
  name: string;
  details: string;
  howToAccess: string;
  source?: string;
  url?: string; // Extracted URL from howToAccess or source
}

export interface DigitalLearningTip {
  app: string; // YouTube, Chrome, WhatsApp
  howToUse: string; // Could be multi-line
  exampleSearchOrTask: string;
  visualCue?: string;
  audioTip?: string;
}

export interface MotivationalSupportModule {
  personalizedEncouragement?: string;
  quote: string;
  nextStep: string;
  reminder: string;
}

export interface GeneratedGuidance {
  educationalPathway?: EducationalPathwayModule;
  // learningResources removed
  lifeAwarenessModule?: LifeAwarenessModule;
  schemesAndRights?: SchemeOrRightItem[];
  digitalLearningTips?: DigitalLearningTip[];
  motivationalSupport?: MotivationalSupportModule;
  rawResponse?: string; // For debugging or if parsing fails for some parts
}

// --- Interface for Chat Functionality ---
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

// --- Interface for "Learn to Use Apps" Feature ---
export interface AppRecommendation {
  id: string; // Unique ID for key prop
  name: string;
  usage: string;
  howToUseVideoLink?: string;
  howToUseText?: string;
  officialLink: string;
  benefits: string[];
  safetyTips?: string[];
  rawResponse?: string; // For debugging
}

// --- Interface for "Women Awareness" Feature ---
export interface AwarenessPoint {
  id: string; // Unique ID for key prop
  emoji: string;
  awarenessText: string;
  imageSuggestion: string; // Textual description of a suggested image
  rawResponse?: string; // For debugging
}

// --- Interfaces for Brain Quizzes Game ---
export interface QuizAnswerOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: QuizAnswerOption[];
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string; 
}

// --- Interfaces for Women Law Awareness ---
export interface LawDetailContent {
  [Language.EN]: string;
  [Language.HI]: string;
  [Language.TA]: string;
}

export interface WomenLaw {
  id: string;
  lawNameKey: string; // Key for UI_TEXT to get the translated Law Name
  fullForm: LawDetailContent;
  applicability: LawDetailContent;
  crimesCovered: LawDetailContent;
  victimRights: LawDetailContent;
  punishmentPenalty: LawDetailContent;
  realLifeExample: LawDetailContent;
}