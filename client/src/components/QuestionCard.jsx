import React, { useState } from 'react';

const QuestionCard = ({ question, index, onAccept, onReject, isAccepted }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className={`border rounded-lg p-3 transition-all duration-200 ${
        isExpanded ? 'shadow-lg scale-[1.02]' : 'shadow-sm hover:shadow-md'
      } ${isAccepted ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Compact Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded shrink-0">
            Q{index + 1}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded border shrink-0 ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded shrink-0">
            {question.type}
          </span>
        </div>
        
        {/* Accept/Reject Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isAccepted ? onReject(question) : onAccept(question);
          }}
          className={`shrink-0 p-1.5 rounded transition-colors ${
            isAccepted 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          title={isAccepted ? 'Remove from quiz' : 'Add to quiz'}
        >
          {isAccepted ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Question Preview/Full */}
      <p className={`text-sm font-medium text-gray-800 mb-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
        {isExpanded ? question.question : truncateText(question.question)}
      </p>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 animate-fadeIn">
          {/* MCQ Options */}
          {question.type === 'MCQ' && question.options && (
            <div className="space-y-1.5">
              {question.options.map((option, optIndex) => (
                <div 
                  key={optIndex}
                  className={`text-xs p-2 rounded flex items-center ${
                    option === question.correctAnswer 
                      ? 'bg-green-100 border border-green-300 text-green-800 font-medium' 
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-semibold mr-2 shrink-0">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {option === question.correctAnswer && (
                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TRUE/FALSE Answer */}
          {(question.type == 'True/False' || question.type == 'TRUE/FALSE') && (
            <div className="p-2 bg-green-100 border border-green-300 rounded">
              <span className="text-xs font-semibold text-green-800">
                ✓ {question.correctAnswer}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Expand Indicator */}
      {!isExpanded && question.question.length > 60 && (
        <p className="text-xs text-gray-400 italic mt-1">Hover to expand...</p>
      )}
    </div>
  );
};

export default QuestionCard;