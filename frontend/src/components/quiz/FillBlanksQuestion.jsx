import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FillBlanksQuestion = ({ 
  question, 
  onAnswer, 
  savedAnswer, 
  isAnswered 
}) => {
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    if (savedAnswer !== undefined && savedAnswer !== null) {
      const restored = savedAnswer.answers ?? savedAnswer.userAnswer ?? {};
      setUserAnswers(restored);
    }
  }, [savedAnswer]);

  const handleInputChange = (blankIndex, value) => {
    if (isAnswered) return;
    const newAnswers = { ...userAnswers, [blankIndex]: value };
    setUserAnswers(newAnswers);
  };

  const canSubmit = () => {
    return question.blanks.every((_, index) => (userAnswers[index] ?? '').toString().trim() !== '');
  };

  const submitAnswer = () => {
    if (isAnswered) return;
    if (!canSubmit()) return;
    const correct = question.blanks.every((blank, index) =>
      (userAnswers[index] ?? '').toString().toLowerCase().trim() === (blank ?? '').toString().toLowerCase().trim()
    );
    onAnswer(userAnswers, correct);
  };

  const getInputClass = (blankIndex) => {
    const baseClass = "border-2 rounded px-3 py-2 text-center font-medium";
    
    if (isAnswered && userAnswers[blankIndex]) {
      const isBlankCorrect = userAnswers[blankIndex]?.toLowerCase().trim() === 
                            question.blanks[blankIndex]?.toLowerCase().trim();
      return `${baseClass} ${
        isBlankCorrect 
          ? "border-green-500 bg-green-50 text-green-700" 
          : "border-red-500 bg-red-50 text-red-700"
      }`;
    }
    
    return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
  };

  // Split question text by blanks and create input fields
  const renderQuestionWithBlanks = () => {
    const parts = question.questionText.split('___');
    const elements = [];
    
    parts.forEach((part, index) => {
      // Add text part
      if (part.trim()) {
        elements.push(
          <span key={`text-${index}`} className="text-lg">
            {part}
          </span>
        );
      }
      
      // Add input field (except for the last part)
      if (index < parts.length - 1) {
        elements.push(
          <input
            key={`input-${index}`}
            type="text"
            value={userAnswers[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitAnswer();
              }
            }}
            className={getInputClass(index)}
            placeholder={`Blank ${index + 1}`}
            disabled={isAnswered}
            style={{ minWidth: '120px' }}
          />
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-700 mb-4">
        {renderQuestionWithBlanks()}
      </div>
      {!isAnswered && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={submitAnswer}
            disabled={!canSubmit()}
            className={`px-4 py-2 rounded-lg font-medium ${
              canSubmit()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
          {!canSubmit() && (
            <span className="text-sm text-gray-500">Fill all blanks to check.</span>
          )}
        </div>
      )}
      
      {isAnswered && (
        <div className="mt-4 p-4 rounded-lg bg-gray-100">
          <div className="text-sm text-gray-600 mb-2">
            <strong>Your Answers:</strong>
          </div>
          <div className="space-y-1">
            {question.blanks.map((correctAnswer, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-medium">Blank {index + 1}:</span>
                <span className={`px-2 py-1 rounded ${
                  userAnswers[index]?.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {userAnswers[index] || 'Not answered'}
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-gray-600">Correct: {correctAnswer}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FillBlanksQuestion;

FillBlanksQuestion.propTypes = {
  question: PropTypes.shape({
    questionText: PropTypes.string.isRequired,
    blanks: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  savedAnswer: PropTypes.shape({
    answers: PropTypes.object,
    userAnswer: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array,
      // PropTypes.null,
    ]),
    isCorrect: PropTypes.bool,
  }),
  isAnswered: PropTypes.bool,
};

FillBlanksQuestion.defaultProps = {
  savedAnswer: undefined,
  isAnswered: false,
};
