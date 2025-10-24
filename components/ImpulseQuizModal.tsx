
import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { CloseIcon } from './icons/IconComponents';

interface ImpulseQuizModalProps {
  topic: string;
  onClose: () => void;
}

type QuizState = 'loading' | 'active' | 'finished' | 'error';

const ImpulseQuizModal: React.FC<ImpulseQuizModalProps> = ({ topic, onClose }) => {
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setQuizState('loading');
    setError(null);
    try {
      const fetchedQuestions = await generateQuizQuestions(topic);
      if (fetchedQuestions.length === 0) {
        throw new Error("The API returned no questions. Please try a different topic.");
      }
      setQuestions(fetchedQuestions);
      setQuizState('active');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching the quiz.");
      }
      setQuizState('error');
    }
  }, [topic]);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizState('finished');
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    fetchQuestions();
  }

  const renderContent = () => {
    if (quizState === 'loading' || (quizState !== 'error' && questions.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-gray-300">Generating your quiz...</p>
        </div>
      );
    }
    
    if (quizState === 'error') {
      return (
        <div className="text-center p-8">
          <h3 className="text-2xl font-bold text-red-400">Oops! Something went wrong.</h3>
          <p className="mt-4 text-gray-300">{error}</p>
          <div className="mt-8 space-x-4">
            <button onClick={fetchQuestions} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Retry
            </button>
            <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      );
    }

    if (quizState === 'finished') {
      return (
        <div className="text-center p-8">
          <h3 className="text-3xl font-bold text-white">Quiz Complete!</h3>
          <p className="mt-4 text-xl text-gray-300">
            Your score: <span className="font-bold text-blue-400">{score}</span> / {questions.length}
          </p>
          <div className="mt-8 space-x-4">
            <button onClick={resetQuiz} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Try Again
            </button>
            <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="p-8">
        <p className="text-sm font-medium text-blue-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{currentQuestion.question}</h3>
        <div className="mt-6 space-y-4">
          {currentQuestion.options.map(option => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;
            let buttonClass = 'w-full text-left p-4 rounded-lg border-2 border-gray-600 bg-gray-700 hover:bg-gray-600 transition-colors';
            if (isAnswered) {
              if (isCorrect) {
                buttonClass = 'w-full text-left p-4 rounded-lg border-2 border-green-500 bg-green-500/20 text-white';
              } else if (isSelected) {
                buttonClass = 'w-full text-left p-4 rounded-lg border-2 border-red-500 bg-red-500/20 text-white';
              }
            } else if (isSelected) {
              buttonClass = 'w-full text-left p-4 rounded-lg border-2 border-blue-500 bg-blue-500/20';
            }
            return (
              <button key={option} onClick={() => handleAnswerSelect(option)} disabled={isAnswered} className={buttonClass}>
                {option}
              </button>
            );
          })}
        </div>
        {isAnswered && (
          <div className="mt-6 text-right">
            <button onClick={handleNextQuestion} className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Impulse Quiz: {topic}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ImpulseQuizModal;
