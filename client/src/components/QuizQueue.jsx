import React from 'react';
import QuestionCard from './QuestionCard';

const QuizQueue = ({ questions, onRejectQuestion }) => {
  return (
    <div className="bg-gray-800 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
          <span>Quiz Queue</span>
          <span className="text-sm font-normal text-gray-400">
            {questions.length} selected
          </span>
        </h2>
      </div>

      {questions.length === 0 ? (
        <div className="text-center text-gray-500 py-12 flex-1 flex items-center justify-center">
          <div>
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium text-gray-400">No questions selected yet</p>
            <p className="text-sm mt-2 text-gray-500">Accept questions from the generated list</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
          {questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              index={index}
              onAccept={() => {}}
              onReject={onRejectQuestion}
              isAccepted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizQueue;