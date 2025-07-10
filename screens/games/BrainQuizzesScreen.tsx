

import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useLanguage } from '../../contexts/LanguageContext';
import { QuizQuestion, QuizAnswerOption, Language } from '../../types';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { usePdfDownloader } from '../../hooks/usePdfDownloader.ts';
import DownloadButton from '../../components/common/DownloadButton.tsx';

const QUESTIONS_PER_LEVEL = 5;
// As per user request, perfect score is required to advance.
const PASSING_SCORE = 5; 

// As per user request, expanded to 20 levels.
const LEVEL_NAMES = [
  "Beginner", "Novice", "Rookie", "Apprentice", "Adept",
  "Skilled", "Proficient", "Expert", "Veteran", "Master",
  "Grandmaster", "Champion", "Legend", "Mythic", "Sage",
  "Oracle", "Prodigy", "Savant", "Genius", "Ultimate"
];

const quizCategories = [
  { id: 'general_knowledge_india', name: 'General Knowledge (India)', icon: 'fa-globe-asia' },
  { id: 'indian_history', name: 'Indian History', icon: 'fa-landmark' },
  { id: 'science_technology', name: 'Science & Technology', icon: 'fa-flask' },
  { id: 'logic_reasoning', name: 'Logic & Reasoning', icon: 'fa-brain' },
  { id: 'mathematics', name: 'Mathematics', icon: 'fa-calculator' },
  { id: 'english_grammar', name: 'English Grammar', icon: 'fa-spell-check' },
  { id: 'world_geography', name: 'World Geography', icon: 'fa-map' },
  { id: 'current_affairs', name: 'Current Affairs', icon: 'fa-newspaper' },
];

const BrainQuizzesScreen: React.FC = () => {
  const { translate, language } = useLanguage();

  const [gameState, setGameState] = useState<'selecting_category' | 'generating' | 'playing' | 'level_complete'>('selecting_category');
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string} | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  // New state to track all questions asked in the current session for uniqueness.
  const [sessionQuestionsHistory, setSessionQuestionsHistory] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswerOption | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const { downloadPdf, isDownloading } = usePdfDownloader();

  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });
  
  const handleDownloadResults = () => {
    downloadPdf(resultsRef.current, `HerPath_Quiz_Results_${selectedCategory?.name.replace(/\s/g, '_')}_Level_${LEVEL_NAMES[currentLevelIndex]}`);
  };

  const parseQuizQuestions = (responseText: string): QuizQuestion[] | null => {
    try {
        let jsonStr = responseText.trim();
        const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[1]) {
            jsonStr = match[1].trim();
        }
        
        const parsedData = JSON.parse(jsonStr);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
            const firstItem = parsedData[0];
            if (firstItem.questionText && Array.isArray(firstItem.options) && firstItem.options.length > 0) {
                return parsedData;
            }
        }
        console.warn('Parsed JSON data is not a valid quiz question array:', parsedData);
        return null;
    } catch (e) {
        console.error('Failed to parse JSON response for quiz questions:', e, "\nRaw Text:", responseText);
        return null;
    }
  };

  const fetchAndStartLevel = useCallback(async (category: {id: string, name: string}, questionHistory: QuizQuestion[]) => {
    if (!apiKey || apiKey === "MISSING_API_KEY") {
        setError("API Key is missing. Cannot generate a quiz.");
        setGameState('selecting_category');
        return;
    }
    
    setGameState('generating');
    setError(null);
    setQuestions([]);

    const difficulty = LEVEL_NAMES[currentLevelIndex];
    const languageName = language === Language.HI ? 'Hindi' : (language === Language.TA ? 'Tamil' : 'English');
    const previouslyAskedQuestionsText = questionHistory.map(q => `- ${q.questionText}`).join('\n');

    const systemInstruction = `
You are an expert-level, highly precise Quiz Generator AI. Your ONLY function is to generate flawless JSON.
Your task is to create quiz questions based on a given category, language, and difficulty. The questions must be engaging, clear, and accurate.

Category: ${category.name}
Language: ${languageName}
Number of Questions to Generate: ${QUESTIONS_PER_LEVEL}
Difficulty Level: ${difficulty}

You MUST provide the output as a single, valid JSON array. Each object in the array represents one quiz question and MUST have the following exact keys and value types. Adhere to the schema precisely.

{
  "id": "string",
  "questionText": "string",
  "options": [
    { "text": "string", "isCorrect": "boolean" },
    { "text": "string", "isCorrect": "boolean" },
    { "text": "string", "isCorrect": "boolean" },
    { "text": "string", "isCorrect": "boolean" }
  ],
  "category": "string",
  "difficulty": "string (The difficulty MUST match '${difficulty}')",
  "explanation": "string (A brief explanation for the correct answer)"
}

CRITICAL RULES FOR OUTPUT:
1.  **JSON ONLY**: The entire response MUST be a single, valid JSON array. Nothing else. No introductory text, no explanations, no apologies, no markdown fences (like \`\`\`json). Just the raw JSON array.
2.  **VALID SYNTAX**: Ensure all brackets \`[]\`, braces \`{}\`, quotes \`""\`, and commas \`,\` are perfectly placed. There must be no trailing commas.
3.  **NO EXTRA TEXT**: Absolutely NO unquoted text, comments, or random words should appear inside or outside the JSON structure.
4.  **LANGUAGE**: All string values (questionText, option text, category, explanation) MUST be in the requested language: ${languageName}.
5.  **CORRECT OPTION**: For every question, EXACTLY one option object must have \`"isCorrect": true\`. The other three MUST have \`"isCorrect": false\`.
6.  **UNIQUE QUESTIONS**: It is critical that you generate completely new questions. DO NOT REPEAT any of the questions from the following list of previously asked questions in this session:
${previouslyAskedQuestionsText || "No questions have been asked yet."}
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: `Generate ${QUESTIONS_PER_LEVEL} quiz questions.`, // The main details are in the system instruction
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.3,
            }
        });

        const responseText = response.text;
        const parsedQuestions = parseQuizQuestions(responseText);

        if (parsedQuestions && parsedQuestions.length > 0) {
            setQuestions(parsedQuestions);
            // Add the newly fetched questions to the session history
            setSessionQuestionsHistory(prevHistory => [...prevHistory, ...parsedQuestions]);
            setCurrentQuestionIndex(0);
            setLevelScore(0);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setGameState('playing');
        } else {
            setError("Could not generate a valid quiz. The AI's response was not in the expected format. Please try again.");
            setGameState('selecting_category');
        }
    } catch (apiError: any) {
        console.error("Gemini API error (Quiz Generation):", apiError);
        setError(`Failed to generate quiz due to an API error: ${apiError.message || 'Unknown error'}. Please try again later.`);
        setGameState('selecting_category');
    }
  }, [language, apiKey, currentLevelIndex]);

  const handleCategorySelect = (category: {id: string, name: string}) => {
    setSelectedCategory(category);
    setCurrentLevelIndex(0);
    setTotalScore(0);
    // Reset session history for a new game
    setSessionQuestionsHistory([]);
    fetchAndStartLevel(category, []); // Start with an empty history
  };

  const handleAnswerSelect = (option: QuizAnswerOption) => {
    if (!isAnswered) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    setIsAnswered(true);
    if (selectedAnswer.isCorrect) {
      setLevelScore(prev => prev + 1);
      setTotalScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setGameState('level_complete');
    }
  };
  
  const handleNextLevel = () => {
      // Pass the current session history to fetchAndStartLevel
      if (currentLevelIndex < LEVEL_NAMES.length - 1 && selectedCategory) {
          const nextLevelIndex = currentLevelIndex + 1;
          setCurrentLevelIndex(nextLevelIndex);
          fetchAndStartLevel(selectedCategory, sessionQuestionsHistory);
      } else {
          handlePlayAgain();
      }
  }

  const handlePlayAgain = () => {
      setGameState('selecting_category');
      setError(null);
      setSelectedCategory(null);
      setCurrentLevelIndex(0);
      setTotalScore(0);
      setLevelScore(0);
      setSessionQuestionsHistory([]); // Clear history on play again
  }

  const renderContent = () => {
    switch(gameState) {
        case 'generating':
            return (
                <div className="text-center p-10">
                    <i className="fas fa-spinner fa-spin text-5xl text-teal-600 mb-4"></i>
                    <p className="text-xl text-gray-700">Generating your quiz for level: <span className="font-bold capitalize">{LEVEL_NAMES[currentLevelIndex]}</span></p>
                </div>
            );
            
        case 'selecting_category':
             return (
                <div className="text-center">
                    <SectionTitle title={translate('brainQuizzesTitle')} subtitle="Choose a category to start your challenge!" />
                     {error && (
                        <div className="my-4 p-3 bg-red-100 text-red-700 rounded-md max-w-2xl mx-auto">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
                       {quizCategories.map(category => (
                           <Card 
                             key={category.id} 
                             onClick={() => handleCategorySelect(category)} 
                             hoverEffect
                             className="text-center p-6 bg-teal-50"
                           >
                                <i className={`fas ${category.icon} text-4xl mb-3 text-teal-600`}></i>
                                <span className="font-semibold text-gray-700">{category.name}</span>
                           </Card>
                       ))}
                    </div>
                </div>
            );

        case 'level_complete':
            const passedLevel = levelScore >= PASSING_SCORE;
            const isLastLevel = currentLevelIndex === LEVEL_NAMES.length - 1;
            
            return (
                <div className="text-center max-w-lg mx-auto">
                    <div ref={resultsRef} className="p-4 bg-white rounded-xl">
                        <SectionTitle 
                            title={passedLevel ? `Level ${LEVEL_NAMES[currentLevelIndex]} Complete!` : `Level ${LEVEL_NAMES[currentLevelIndex]} Failed`}
                            subtitle={passedLevel ? "Perfect score! Ready for the next challenge?" : "Don't worry, you need a perfect score to advance. You can try again!"}
                        />
                        <Card className="mt-8 p-8 bg-teal-50">
                          <p className="text-xl text-gray-700 mb-2">
                            Level Score: <span className="font-bold text-teal-600 text-2xl">{levelScore} / {QUESTIONS_PER_LEVEL}</span>
                          </p>
                           <p className="text-xl text-gray-700 mb-4">
                            Total Score: <span className="font-bold text-teal-600 text-2xl">{totalScore}</span>
                          </p>
                        </Card>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
                        {passedLevel && !isLastLevel && (
                            <Button onClick={handleNextLevel} size="lg">
                                <i className="fas fa-arrow-right mr-2"></i> Next Level: {LEVEL_NAMES[currentLevelIndex + 1]}
                            </Button>
                        )}
                        {passedLevel && isLastLevel && (
                            <p className="font-bold text-green-600 text-2xl w-full">Congratulations! You have completed all levels!</p>
                        )}

                        <Button onClick={handlePlayAgain} size="lg" variant={passedLevel ? 'secondary' : 'primary'}>
                            <i className="fas fa-redo mr-2"></i> {translate('playAgain')}
                        </Button>
                        <DownloadButton onClick={handleDownloadResults} isLoading={isDownloading} className="!mt-0" />
                    </div>
                </div>
            );

        case 'playing':
            const currentQuestion = questions[currentQuestionIndex];
            if (!currentQuestion) {
                 return (
                    <div className="text-center p-8">
                        <p className="text-gray-700">Error: Could not load question. Please try again.</p>
                        <Button onClick={handlePlayAgain} className="mt-4">Play Again</Button>
                    </div>
                );
            }
            return (
                <div className="max-w-2xl mx-auto">
                  <SectionTitle title={`${selectedCategory?.name} - Level ${LEVEL_NAMES[currentLevelIndex]}`} />
                  <Card className="p-6 md:p-8 shadow-xl">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-700 mb-1">
                        {translate('question')} {currentQuestionIndex + 1} {translate('of')} {questions.length}
                      </h2>
                      <p className="text-2xl text-gray-800 leading-relaxed">{currentQuestion.questionText}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Difficulty: {currentQuestion.difficulty}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {currentQuestion.options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          fullWidth
                          variant={'secondary'}
                          className={`text-left justify-start p-4 text-lg transition-colors duration-150 ease-in-out
                            ${selectedAnswer === option && !isAnswered ? 'ring-2 ring-teal-500 bg-teal-100 border-teal-500' : 'border-gray-300 hover:bg-gray-100'}
                            ${isAnswered && option.isCorrect ? '!bg-green-500 hover:!bg-green-600 border-green-700 !text-white ring-green-500' : ''}
                            ${isAnswered && selectedAnswer === option && !option.isCorrect ? '!bg-red-500 hover:!bg-red-600 border-red-700 !text-white ring-red-500' : ''}
                          `}
                          disabled={isAnswered}
                          aria-pressed={selectedAnswer === option}
                        >
                          {option.text}
                        </Button>
                      ))}
                    </div>

                    {isAnswered && (
                      <div className={`p-3 rounded-md text-center my-4 text-lg font-semibold ${selectedAnswer?.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedAnswer?.isCorrect ? translate('correctAnswer') : translate('incorrectAnswer')}
                      </div>
                    )}
                    
                    {isAnswered && currentQuestion.explanation && (
                       <div className="p-4 rounded-md bg-blue-50 text-blue-800 my-4 text-base border border-blue-200">
                        <strong className="flex items-center"><i className="fas fa-lightbulb mr-2 text-blue-500"></i>{translate('quizExplanation')}:</strong> 
                        <p className="mt-1 pl-1">{currentQuestion.explanation}</p>
                      </div>
                    )}

                    {!isAnswered && (
                      <Button onClick={handleSubmitAnswer} size="lg" fullWidth disabled={!selectedAnswer}>
                        {translate('submitAnswer')}
                      </Button>
                    )}
                    {isAnswered && (
                       <Button onClick={handleNextQuestion} size="lg" fullWidth>
                        {currentQuestionIndex < questions.length - 1 ? translate('nextQuestion') : 'Finish Level'}
                      </Button>
                    )}
                  </Card>
                </div>
            );
        default:
            return <p>Something went wrong.</p>;
    }
  }

  return <div>{renderContent()}</div>;
};

export default BrainQuizzesScreen;
