import React, { useState, useEffect } from 'react';

const TrueFalseQuestion = ({ 
  question, 
  onAnswer, 
  savedAnswer, 
  isAnswered 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (savedAnswer !== undefined) {
      setSelectedAnswer(savedAnswer);
    }
  }, [savedAnswer]);

  const handleAnswer = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    onAnswer(answer, answer === question.correctAnswer);
  };

  const getButtonClass = (answer) => {
    const baseClass = "w-full p-4 text-left rounded-lg border transition-all font-semibold";
    
    if (selectedAnswer === answer) {
      if (isAnswered) {
        return `${baseClass} ${
          answer === question.correctAnswer 
            ? "bg-green-500 text-white border-green-600" 
            : "bg-red-500 text-white border-red-600"
        }`;
      }
      return `${baseClass} bg-blue-500 text-white border-blue-600`;
    }
    
    return `${baseClass} bg-white hover:bg-gray-50 border-gray-300`;
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-700 mb-4">
        {question.questionText}
      </div>
      
      <div className="space-y-3">
        <button
          className={getButtonClass(true)}
          onClick={() => handleAnswer(true)}
          disabled={isAnswered}
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <span>True</span>
          </div>
        </button>
        
        <button
          className={getButtonClass(false)}
          onClick={() => handleAnswer(false)}
          disabled={isAnswered}
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">❌</span>
            <span>False</span>
          </div>
        </button>
      </div>
      
      {isAnswered && (
        <div className="mt-4 p-3 rounded-lg bg-gray-100">
          <div className="text-sm text-gray-600">
            <strong>Correct Answer:</strong> {question.correctAnswer ? 'True' : 'False'}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrueFalseQuestion;
