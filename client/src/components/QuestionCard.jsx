// client/src/components/QuestionCard.jsx
import { useState } from 'react';

const QuestionCard = ({ question, onToggle, isSelected, showOrder = false, order }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'MCQ' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition relative"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Order Number (for Quiz Queue) */}
      {showOrder && (
        <div className="absolute -top-2 -left-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
          {order}
        </div>
      )}

      {/* Header with badges */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(question.type)}`}>
            {question.type}
          </span>
        </div>

        {/* Toggle Icon */}
        <button
          onClick={onToggle}
          className={`p-1 rounded-full transition ${
            isSelected
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
          title={isSelected ? 'Remove from queue' : 'Add to queue'}
        >
          {isSelected ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      {/* Question Text */}
      <p className="text-gray-800 text-sm font-medium">
        {truncateText(question.question)}
      </p>

      {/* Hover Details */}
      {showDetails && (
        <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border-2 border-blue-300 rounded-lg p-4 shadow-lg max-w-md">
          <p className="text-gray-800 font-medium mb-2">{question.question}</p>
          
          {question.type === 'MCQ' && question.options && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold mb-1">Options:</p>
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`text-sm px-2 py-1 rounded ${
                    option === question.correctAnswer
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {option}
                </div>
              ))}
            </div>
          )}

          {question.type === 'TRUE/FALSE' && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Answer:</span>{' '}
              <span className="text-green-700">{question.correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;