
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { QuizQuestion, QuizAnswerOption } from '../../types';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const SEEN_QUESTIONS_STORAGE_KEY = 'herPathSeenQuizQuestions';
const QUESTIONS_PER_BATCH = 5;

const allMockQuestions: QuizQuestion[] = [
  // General Knowledge
  {
    id: 'gk1',
    questionText: 'What is the capital of India?',
    options: [ { text: 'Mumbai', isCorrect: false }, { text: 'New Delhi', isCorrect: true }, { text: 'Kolkata', isCorrect: false }, { text: 'Chennai', isCorrect: false } ],
    category: 'General Knowledge', difficulty: 'easy', explanation: 'New Delhi is the capital of India.'
  },
  {
    id: 'gk2',
    questionText: 'Which is the longest river in India?',
    options: [ { text: 'Godavari', isCorrect: false }, { text: 'Ganges (Ganga)', isCorrect: true }, { text: 'Yamuna', isCorrect: false }, { text: 'Brahmaputra', isCorrect: false } ],
    category: 'General Knowledge', difficulty: 'medium', explanation: 'The Ganges (Ganga) is the longest river in India.'
  },
  {
    id: 'gk3',
    questionText: 'Who is known as the "Father of the Nation" in India?',
    options: [ { text: 'Jawaharlal Nehru', isCorrect: false }, { text: 'Sardar Patel', isCorrect: false }, { text: 'Mahatma Gandhi', isCorrect: true }, { text: 'B.R. Ambedkar', isCorrect: false } ],
    category: 'General Knowledge', difficulty: 'easy', explanation: 'Mahatma Gandhi is known as the Father of the Nation in India.'
  },
  {
    id: 'gk4',
    questionText: 'How many states are there in India (as of 2023)?',
    options: [ { text: '28', isCorrect: true }, { text: '29', isCorrect: false }, { text: '30', isCorrect: false }, { text: '27', isCorrect: false } ],
    category: 'General Knowledge', difficulty: 'medium', explanation: 'India has 28 states and 8 Union Territories.'
  },
  {
    id: 'gk5',
    questionText: 'What is the national animal of India?',
    options: [ { text: 'Lion', isCorrect: false }, { text: 'Tiger', isCorrect: true }, { text: 'Elephant', isCorrect: false }, { text: 'Leopard', isCorrect: false } ],
    category: 'General Knowledge', difficulty: 'easy', explanation: 'The Royal Bengal Tiger is the national animal of India.'
  },

  // Logic
  {
    id: 'logic1',
    questionText: 'Which number comes next in the series: 2, 4, 6, 8, __?',
    options: [ { text: '9', isCorrect: false }, { text: '10', isCorrect: true }, { text: '12', isCorrect: false }, { text: '7', isCorrect: false } ],
    category: 'Logic', difficulty: 'easy', explanation: 'The series increases by 2 each time. So, 8 + 2 = 10.'
  },
  {
    id: 'logic2',
    questionText: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
    options: [ { text: 'Yes', isCorrect: true }, { text: 'No', isCorrect: false }, { text: 'Maybe', isCorrect: false }, { text: 'Not enough information', isCorrect: false } ],
    category: 'Logic', difficulty: 'medium', explanation: 'This is a transitive property. If A=B and B=C, then A=C.'
  },
  {
    id: 'logic3',
    questionText: 'A B C D E. Which letter is two to the right of the letter immediately to the left of D?',
    options: [ { text: 'C', isCorrect: false }, { text: 'D', isCorrect: false }, { text: 'E', isCorrect: true }, { text: 'B', isCorrect: false } ],
    category: 'Logic', difficulty: 'medium', explanation: 'Letter to the left of D is C. Two letters to the right of C is E.'
  },
  {
    id: 'logic4',
    questionText: 'A mother is twice as old as her daughter. If the mother is 40, how old is the daughter?',
    options: [ { text: '10', isCorrect: false }, { text: '20', isCorrect: true }, { text: '30', isCorrect: false }, { text: '15', isCorrect: false } ],
    category: 'Logic', difficulty: 'easy', explanation: 'If the mother is twice as old, the daughter is half her age. 40 / 2 = 20.'
  },
  {
    id: 'logic5',
    questionText: 'Which shape usually has the most sides: Triangle, Square, Pentagon, Hexagon?',
    options: [ { text: 'Triangle (3)', isCorrect: false }, { text: 'Square (4)', isCorrect: false }, { text: 'Pentagon (5)', isCorrect: false }, { text: 'Hexagon (6)', isCorrect: true } ],
    category: 'Logic', difficulty: 'easy', explanation: 'A hexagon has 6 sides, which is more than a triangle (3), square (4), or pentagon (5).'
  },
  
  // Math
  {
    id: 'math1',
    questionText: 'What is 5 + 7?',
    options: [ { text: '10', isCorrect: false }, { text: '12', isCorrect: true }, { text: '11', isCorrect: false }, { text: '13', isCorrect: false } ],
    category: 'Math', difficulty: 'easy', explanation: '5 + 7 equals 12.'
  },
  {
    id: 'math2',
    questionText: 'How many sides does a triangle have?',
    options: [ { text: 'Three', isCorrect: true }, { text: 'Four', isCorrect: false }, { text: 'Five', isCorrect: false }, { text: 'Six', isCorrect: false } ],
    category: 'Math', difficulty: 'easy', explanation: 'A triangle is a polygon with three edges and three vertices.'
  },
  {
    id: 'math3',
    questionText: 'What is 2 + 2 * 2?',
    options: [ { text: '8', isCorrect: false }, { text: '6', isCorrect: true }, { text: '4', isCorrect: false }, { text: '10', isCorrect: false } ],
    category: 'Math', difficulty: 'medium', explanation: 'Order of operations (multiplication first): 2 * 2 = 4, then 2 + 4 = 6.'
  },
  {
    id: 'math4',
    questionText: 'If you have 3 apples and you give away 1, how many do you have left?',
    options: [ { text: '1', isCorrect: false }, { text: '2', isCorrect: true }, { text: '3', isCorrect: false }, { text: '0', isCorrect: false } ],
    category: 'Math', difficulty: 'easy', explanation: '3 - 1 = 2.'
  },
  {
    id: 'math5',
    questionText: 'What is 10 divided by 2?',
    options: [ { text: '2', isCorrect: false }, { text: '5', isCorrect: true }, { text: '8', isCorrect: false }, { text: '4', isCorrect: false } ],
    category: 'Math', difficulty: 'easy', explanation: '10 / 2 = 5.'
  },

  // Basic Science
  {
    id: 'sci1',
    questionText: 'What do plants need to grow, apart from water and soil?',
    options: [ { text: 'Moonlight', isCorrect: false }, { text: 'Sunlight', isCorrect: true }, { text: 'Electricity', isCorrect: false }, { text: 'Wind', isCorrect: false } ],
    category: 'Basic Science', difficulty: 'easy', explanation: 'Plants use sunlight for photosynthesis to make their food.'
  },
  {
    id: 'sci2',
    questionText: 'What is H2O commonly known as?',
    options: [ { text: 'Salt', isCorrect: false }, { text: 'Sugar', isCorrect: false }, { text: 'Water', isCorrect: true }, { text: 'Air', isCorrect: false } ],
    category: 'Basic Science', difficulty: 'easy', explanation: 'H2O is the chemical formula for water.'
  },
  {
    id: 'sci3',
    questionText: 'Which planet is known as the Red Planet?',
    options: [ { text: 'Jupiter', isCorrect: false }, { text: 'Mars', isCorrect: true }, { text: 'Venus', isCorrect: false }, { text: 'Saturn', isCorrect: false } ],
    category: 'Basic Science', difficulty: 'medium', explanation: 'Mars is called the Red Planet due to its reddish appearance from iron oxide on its surface.'
  },
  {
    id: 'sci4',
    questionText: 'What pulls objects towards the Earth?',
    options: [ { text: 'Magnetism', isCorrect: false }, { text: 'Gravity', isCorrect: true }, { text: 'Friction', isCorrect: false }, { text: 'Wind', isCorrect: false } ],
    category: 'Basic Science', difficulty: 'easy', explanation: 'Gravity is the force that attracts objects with mass towards each other, like Earth pulling objects down.'
  },
  {
    id: 'sci5',
    questionText: 'How many colors are in a rainbow typically?',
    options: [ { text: '5', isCorrect: false }, { text: '7', isCorrect: true }, { text: '9', isCorrect: false }, { text: '3', isCorrect: false } ],
    category: 'Basic Science', difficulty: 'easy', explanation: 'A rainbow is typically described as having 7 colors: Red, Orange, Yellow, Green, Blue, Indigo, Violet (ROYGBIV).'
  },
  
  // Digital Literacy (Simple)
  {
    id: 'digi1',
    questionText: 'What is a common symbol for "Search" on websites and apps?',
    options: [ { text: 'A house icon', isCorrect: false }, { text: 'A magnifying glass icon', isCorrect: true }, { text: 'A gear icon', isCorrect: false }, { text: 'A heart icon', isCorrect: false } ],
    category: 'Digital Literacy', difficulty: 'easy', explanation: 'A magnifying glass (🔍) is widely used to represent search functionality.'
  },
  {
    id: 'digi2',
    questionText: 'If you receive an email from an unknown person asking for your bank password, what should you do?',
    options: [ { text: 'Reply with your password', isCorrect: false }, { text: 'Ignore or delete the email', isCorrect: true }, { text: 'Click on any links in the email', isCorrect: false }, { text: 'Call them back', isCorrect: false } ],
    category: 'Digital Literacy', difficulty: 'easy', explanation: 'Never share your passwords. Suspicious emails asking for personal info should be ignored or deleted.'
  },
  {
    id: 'digi3',
    questionText: 'What does "Wi-Fi" help you do?',
    options: [ { text: 'Make phone calls without a SIM card', isCorrect: false }, { text: 'Connect to the internet without wires', isCorrect: true }, { text: 'Charge your phone faster', isCorrect: false }, { text: 'Increase phone storage', isCorrect: false } ],
    category: 'Digital Literacy', difficulty: 'easy', explanation: 'Wi-Fi allows devices to connect to the internet wirelessly.'
  },
  {
    id: 'digi4',
    questionText: 'Which of these is a popular app for sending messages?',
    options: [ { text: 'Calculator', isCorrect: false }, { text: 'WhatsApp', isCorrect: true }, { text: 'Calendar', isCorrect: false }, { text: 'Gallery', isCorrect: false } ],
    category: 'Digital Literacy', difficulty: 'easy', explanation: 'WhatsApp is a widely used messaging application.'
  },
  {
    id: 'digi5',
    questionText: 'To turn off a computer, you usually click on:',
    options: [ { text: 'Open a new file', isCorrect: false }, { text: 'Shut Down or Turn Off option', isCorrect: true }, { text: 'Increase volume', isCorrect: false }, { text: 'Change wallpaper', isCorrect: false } ],
    category: 'Digital Literacy', difficulty: 'easy', explanation: 'Operating systems provide a "Shut Down" or "Turn Off" option to safely power down the computer.'
  },
];


const BrainQuizzesScreen: React.FC = () => {
  const { translate } = useLanguage();
  
  const [currentBatchQuestions, setCurrentBatchQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswerOption | null>(null);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<'not_started' | 'playing' | 'answered' | 'finished_batch' | 'all_finished'>('not_started');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [allQuestionsAttempted, setAllQuestionsAttempted] = useState(false);


  const loadSeenQuestionIds = useCallback((): string[] => {
    const seenIds = localStorage.getItem(SEEN_QUESTIONS_STORAGE_KEY);
    return seenIds ? JSON.parse(seenIds) : [];
  }, []);

  const saveSeenQuestionId = useCallback((id: string) => {
    const seenIds = loadSeenQuestionIds();
    if (!seenIds.includes(id)) {
      seenIds.push(id);
      localStorage.setItem(SEEN_QUESTIONS_STORAGE_KEY, JSON.stringify(seenIds));
    }
  }, [loadSeenQuestionIds]);
  
  const getNewBatch = useCallback((): QuizQuestion[] => {
    const seenIds = loadSeenQuestionIds();
    const unseenQuestions = allMockQuestions.filter(q => !seenIds.includes(q.id));
    
    if (unseenQuestions.length === 0) {
      setAllQuestionsAttempted(true);
      return [];
    }
    
    // Shuffle unseen questions and take a batch
    const shuffled = unseenQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, QUESTIONS_PER_BATCH);
  }, [loadSeenQuestionIds]);


  const handleStartQuiz = useCallback(() => {
    const newBatch = getNewBatch();
    if (newBatch.length > 0) {
      setCurrentBatchQuestions(newBatch);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setFeedbackMessage(null);
      setQuizState('playing');
      setAllQuestionsAttempted(false); // Reset this flag for a new batch
    } else {
      // This case means all questions from allMockQuestions have been seen
      setAllQuestionsAttempted(true);
      setQuizState('all_finished'); // A new state to indicate all questions exhausted
    }
  }, [getNewBatch]);

  useEffect(() => {
    if (quizState === 'not_started') {
       // Optionally, one could pre-load or check available questions here.
       // For now, starting is explicit via button.
    }
  }, [quizState, handleStartQuiz]);

  const handleAnswerSelect = (option: QuizAnswerOption) => {
    if (quizState === 'playing') {
      setSelectedAnswer(option);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer.isCorrect) {
      setScore(prevScore => prevScore + 1);
      setFeedbackMessage(translate('correctAnswer'));
    } else {
      setFeedbackMessage(translate('incorrectAnswer'));
    }
    // Mark as seen after answering, regardless of correctness
    saveSeenQuestionId(currentBatchQuestions[currentQuestionIndex].id);
    setQuizState('answered');
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedbackMessage(null);
    if (currentQuestionIndex < currentBatchQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setQuizState('playing');
    } else {
      setQuizState('finished_batch');
    }
  };

  const handleRestartAllQuizzes = () => {
    localStorage.removeItem(SEEN_QUESTIONS_STORAGE_KEY);
    setAllQuestionsAttempted(false);
    handleStartQuiz();
  };


  if (quizState === 'not_started') {
    return (
      <div className="text-center">
        <SectionTitle title={translate('brainQuizzesTitle')} subtitle={translate('brainQuizzesSubtitle')} />
        <Button onClick={handleStartQuiz} size="lg" className="mt-8">
          <i className="fas fa-play mr-2"></i> {translate('startQuiz')}
        </Button>
      </div>
    );
  }

  if (quizState === 'finished_batch' || quizState === 'all_finished') {
    const canLoadMore = !allQuestionsAttempted && getNewBatch().length > 0; // Check if more unique questions exist overall

    return (
      <div className="text-center max-w-lg mx-auto">
        <SectionTitle title={translate('quizCompleted')} /> {/* Could be "Batch Completed" */}
        <Card className="mt-8 p-8 bg-teal-50">
          <p className="text-2xl text-gray-700 mb-4">
            {translate('yourScore')} (this batch): <span className="font-bold text-teal-600 text-3xl">{score} / {currentBatchQuestions.length}</span>
          </p>
          
          {allQuestionsAttempted && quizState === 'all_finished' && (
            <p className="text-lg text-blue-600 my-4">
              You've attempted all available unique questions! Great job!
            </p>
          )}

          {canLoadMore && quizState === 'finished_batch' && !allQuestionsAttempted && (
            <Button onClick={handleStartQuiz} size="lg" className="mt-6 mb-3">
             <i className="fas fa-arrow-right mr-2"></i> Next Batch ({QUESTIONS_PER_BATCH} Questions)
            </Button>
          )}
          
          <Button onClick={handleRestartAllQuizzes} variant="secondary" size="lg" className="mt-2">
           <i className="fas fa-redo mr-2"></i> Restart All Quizzes
          </Button>
        </Card>
      </div>
    );
  }
  
  if (currentBatchQuestions.length === 0) {
    // This handles the case where startQuiz was called but no questions could be loaded (e.g., all seen)
    // or if quizState is 'playing'/'answered' but batch is empty (inconsistent state).
    // Given the logic, if getNewBatch() returns empty, quizState becomes 'all_finished',
    // which is handled by the block above. So this primarily acts as a safeguard.
    return (
       <div className="text-center max-w-lg mx-auto">
        <SectionTitle title={translate('brainQuizzesTitle')} />
        <Card className="mt-8 p-8 bg-amber-50">
          <p className="text-2xl text-gray-700 mb-4">
             No new quizzes available at the moment.
          </p>
           <p className="text-lg text-gray-600 mb-6">
            You've attempted all unique questions!
          </p>
          <Button onClick={handleRestartAllQuizzes} size="lg" className="mt-6">
           <i className="fas fa-redo mr-2"></i> Restart All Quizzes
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = currentBatchQuestions[currentQuestionIndex];
  if (!currentQuestion) { // Should ideally not happen if logic is correct
      return (
          <div className="text-center p-8">
              <p className="text-gray-700">Error: Could not load question. Please try restarting the quiz.</p>
              <Button onClick={handleRestartAllQuizzes} className="mt-4">Restart</Button>
          </div>
      );
  }


  return (
    <div className="max-w-2xl mx-auto">
      <SectionTitle title={translate('brainQuizzesTitle')} />
      <Card className="p-6 md:p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">
            {translate('question')} {currentQuestionIndex + 1} {translate('of')} {currentBatchQuestions.length}
          </h2>
          <p className="text-2xl text-gray-800 leading-relaxed">{currentQuestion.questionText}</p>
          {currentQuestion.category && <p className="text-sm text-gray-500 mt-1">Category: {currentQuestion.category}</p>}
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              fullWidth
              variant={'secondary'} // Base variant
              className={`text-left justify-start p-4 text-lg transition-colors duration-150 ease-in-out
                ${selectedAnswer === option ? 'ring-2 ring-teal-500 bg-teal-100 border-teal-500' : 'border-gray-300 hover:bg-gray-100'}
                ${quizState === 'answered' && option.isCorrect ? '!bg-green-500 hover:!bg-green-600 border-green-700 !text-white ring-green-500' : ''}
                ${quizState === 'answered' && selectedAnswer === option && !option.isCorrect ? '!bg-red-500 hover:!bg-red-600 border-red-700 !text-white ring-red-500' : ''}
              `}
              disabled={quizState === 'answered'}
              aria-pressed={selectedAnswer === option}
            >
              {option.text}
            </Button>
          ))}
        </div>

        {feedbackMessage && (
          <div className={`p-3 rounded-md text-center my-4 text-lg font-semibold ${selectedAnswer?.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedbackMessage}
          </div>
        )}
        
        {quizState === 'answered' && currentQuestion.explanation && (
           <div className="p-3 rounded-md bg-blue-50 text-blue-700 my-4 text-sm">
            <strong>{translate('quizExplanation')}:</strong> {currentQuestion.explanation}
          </div>
        )}

        {quizState === 'playing' && (
          <Button onClick={handleSubmitAnswer} size="lg" fullWidth disabled={!selectedAnswer}>
            {translate('submitAnswer')}
          </Button>
        )}
        {quizState === 'answered' && (
           <Button onClick={handleNextQuestion} size="lg" fullWidth>
            {currentQuestionIndex < currentBatchQuestions.length - 1 ? translate('nextQuestion') : translate('quizCompleted')} {/* Text could be "View Results" */}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default BrainQuizzesScreen;