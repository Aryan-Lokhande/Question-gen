import React from 'react';

const QuestionQueue = ({ questions }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Question Queue</h2>
        <div className="text-center text-gray-500 py-8">
          <p>No questions generated yet.</p>
          <p className="text-sm mt-2">Fill the form and generate questions to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Question Queue
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({questions.length} Q)
        </span>
      </h2>

      <div className="space-y-4  text-sm max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {questions.map((q, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              {/* <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Q{index + 1}
              </span> */}
              <div className="flex gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {q.difficulty}
                </span>
                <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {q.type}
                </span>
              </div>
            </div>

            {/* Question */}
            <p className="text-gray-800 font-medium mb-3">
              {q.question}
            </p>

            {/* Options for MCQ */}
            {q.type === 'MCQ' && q.options && (
              <div className="space-y-2 mb-3">
                {q.options.map((option, optIndex) => (
                  <div 
                    key={optIndex}
                    className={`text-sm p-2 rounded ${
                      option === q.correctAnswer 
                        ? 'bg-green-50 border border-green-300 text-green-800' 
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="font-semibold mr-2">
                      {String.fromCharCode(65 + optIndex)}.
                    </span>
                    {option}
                    {option === q.correctAnswer && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Answer for TRUE/FALSE */}
            {q.type == 'True/False' && (
              <div className="mt-3 p-2 bg-green-50 border border-green-300 rounded">
                <span className="text-sm font-semibold text-green-800">
                  {q.correctAnswer}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionQueue;