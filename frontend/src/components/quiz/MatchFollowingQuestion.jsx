import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MatchFollowingQuestion = ({ 
  question, 
  onAnswer, 
  savedAnswer, 
  isAnswered 
}) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [userMappings, setUserMappings] = useState({});

  useEffect(() => {
    if (savedAnswer !== undefined && savedAnswer !== null) {
      const restored = savedAnswer.mappings ?? savedAnswer.userAnswer ?? {};
      setUserMappings(restored);
      // savedAnswer.isCorrect can be used by parent; we don't need local state
    }
  }, [savedAnswer]);

  const handleLeftClick = (leftIndex) => {
    if (isAnswered) return;
    
    if (selectedLeft === leftIndex) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftIndex);
      setSelectedRight(null);
    }
  };

  const handleRightClick = (rightIndex) => {
    if (isAnswered || selectedLeft === null) return;
    
    if (selectedRight === rightIndex) {
      setSelectedRight(null);
    } else {
      setSelectedRight(rightIndex);
      
      // Create mapping
      const newMappings = { ...userMappings, [selectedLeft]: rightIndex };
      setUserMappings(newMappings);
      
      // Check if all items are mapped
      const allMapped = question.leftItems.every((_, index) => {
        const mapped = newMappings[index];
        return mapped !== undefined && Number.isInteger(mapped) && mapped >= 0 && mapped < question.rightItems.length;
      });
      if (allMapped) {
        const correct = question.correctMappings.every(mapping => 
          newMappings[mapping.leftIndex] === mapping.rightIndex
        );
        onAnswer(newMappings, correct);
      }
      
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const getLeftItemClass = (index) => {
    const baseClass = "p-3 rounded-lg border-2 transition-all cursor-pointer";
    
    if (isAnswered) {
      const isCorrectMapping = question.correctMappings.some(mapping => 
        Number(mapping.leftIndex) === Number(index) && Number(mapping.rightIndex) === Number(userMappings[index])
      );
      return `${baseClass} ${
        isCorrectMapping 
          ? "border-green-500 bg-green-50 text-green-700" 
          : "border-red-500 bg-red-50 text-red-700"
      }`;
    }
    
    if (selectedLeft === index) {
      return `${baseClass} border-blue-500 bg-blue-50 text-blue-700`;
    }
    
    if (userMappings[index] !== undefined) {
      return `${baseClass} border-gray-400 bg-gray-100 text-gray-600`;
    }
    
    return `${baseClass} border-gray-300 bg-white hover:bg-gray-50`;
  };

  const getRightItemClass = (index) => {
    const baseClass = "p-3 rounded-lg border-2 transition-all cursor-pointer";
    
    if (isAnswered) {
      const isCorrectMapping = question.correctMappings.some(mapping => 
        Number(mapping.rightIndex) === Number(index) && Number(mapping.leftIndex) === Number(Object.keys(userMappings).find(key => Number(userMappings[key]) === Number(index)))
      );
      return `${baseClass} ${
        isCorrectMapping 
          ? "border-green-500 bg-green-50 text-green-700" 
          : "border-red-500 bg-red-50 text-red-700"
      }`;
    }
    
    if (selectedRight === index) {
      return `${baseClass} border-blue-500 bg-blue-50 text-blue-700`;
    }
    
    if (Object.values(userMappings).includes(index)) {
      return `${baseClass} border-gray-400 bg-gray-100 text-gray-600`;
    }
    
    return `${baseClass} border-gray-300 bg-white hover:bg-gray-50`;
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-700 mb-4">
        {question.questionText}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-600 mb-3">Column A</h3>
          {question.leftItems.map((item, index) => (
            <div
              key={index}
              className={getLeftItemClass(index)}
              onClick={() => handleLeftClick(index)}
            >
              <div className="flex items-center justify-between">
                <span>{item}</span>
                {userMappings[index] !== undefined && userMappings[index] >= 0 && userMappings[index] < question.rightItems.length && (
                  <span className="text-sm text-gray-500">
                    → {question.rightItems[userMappings[index]]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-600 mb-3">Column B</h3>
          {question.rightItems.map((item, index) => (
            <div
              key={index}
              className={getRightItemClass(index)}
              onClick={() => handleRightClick(index)}
            >
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      
      {isAnswered && (
        <div className="mt-4 p-4 rounded-lg bg-gray-100">
          <div className="text-sm text-gray-600 mb-2">
            <strong>Correct Mappings:</strong>
          </div>
          <div className="space-y-1">
            {question.correctMappings.map((mapping, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-medium">{question.leftItems[mapping.leftIndex]}</span>
                <span className="text-gray-500">→</span>
                <span className="text-gray-600">{question.rightItems[mapping.rightIndex]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchFollowingQuestion;

MatchFollowingQuestion.propTypes = {
  question: PropTypes.shape({
    questionText: PropTypes.string.isRequired,
    leftItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    rightItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    correctMappings: PropTypes.arrayOf(
      PropTypes.shape({
        leftIndex: PropTypes.number.isRequired,
        rightIndex: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  savedAnswer: PropTypes.shape({
    mappings: PropTypes.object,
    userAnswer: PropTypes.object,
    isCorrect: PropTypes.bool,
  }),
  isAnswered: PropTypes.bool,
};

MatchFollowingQuestion.defaultProps = {
  savedAnswer: undefined,
  isAnswered: false,
};
