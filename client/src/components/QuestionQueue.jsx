import React from 'react';
import QuestionCard from './QuestionCard';

const QuestionQueue = ({ questions, onAcceptQuestion, acceptedIds }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Generated Questions</h2>
        <div className="text-center text-gray-500 py-8">
          <p>No questions generated yet.</p>
          <p className="text-sm mt-2">Fill the form and generate questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-between">
        <span>Generated Questions</span>
        <span className="text-sm font-normal text-gray-500">
          {questions.length} total
        </span>
      </h2>
      
      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            question={question}
            index={index}
            onAccept={onAcceptQuestion}
            onReject={() => {}}
            isAccepted={acceptedIds.includes(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionQueue;