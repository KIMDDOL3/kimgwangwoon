import React, { useState, useEffect } from 'react';
import { DiagnosticQuestion, DiagnosticAnswers, User } from '../../types';

interface DiagnosticFlowProps {
  questions: DiagnosticQuestion[];
  onComplete: (answers: DiagnosticAnswers) => void;
  user: User;
}

const DiagnosticFlow: React.FC<DiagnosticFlowProps> = ({ questions, onComplete, user }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({
      year: user.year,
      department: user.department,
  });
  const [inputValue, setInputValue] = useState('');
  
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const answer = currentQuestion ? answers[currentQuestion.key] : undefined;
    if (currentQuestion && currentQuestion.type === 'number-input' && answer) {
        setInputValue(String(answer));
    } else {
        setInputValue('');
    }
  }, [currentQuestion, answers]);

  const handleAnswer = (value: string | number) => {
    const newAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      handleAnswer(value);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg animate-fade-in-up">
      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{currentQuestion.text}</h3>
      {currentQuestion.type === 'single-choice' && (
        <div className="flex flex-col space-y-2">
          {currentQuestion.options?.map((option) => (
            <button
              key={option.value.toString()}
              onClick={() => handleAnswer(option.value)}
              className="w-full text-left p-3 bg-gray-100 dark:bg-gray-600 hover:bg-blue-100 dark:hover:bg-blue-600 rounded-lg transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {currentQuestion.type === 'number-input' && (
        <form onSubmit={handleNumberSubmit} className="flex space-x-2">
          <input
            type="number"
            step="0.01"
            min="0"
            max="4.5"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            placeholder="예: 3.5"
            required
          />
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            입력
          </button>
        </form>
      )}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        질문 {currentQuestionIndex + 1} / {questions.length}
      </div>
    </div>
  );
};

export default DiagnosticFlow;
