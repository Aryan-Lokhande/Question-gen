import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableQuestionCard from './SortableQuestionCard';

const QuizQueue = ({ questions, onRejectQuestion, onReorderQuestions, onSaveQuiz, saving }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((_, i) => i === active.id);
      const newIndex = questions.findIndex((_, i) => i === over.id);

      const newQuestions = arrayMove(questions, oldIndex, newIndex);
      onReorderQuestions(newQuestions);
    }
  };

  return (
    <div className="bg-gray-800 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
          <span>Quiz Queue</span>
          <span className="text-sm font-normal text-gray-400">
            {questions.length} selected
          </span>
        </h2>

        {questions.length > 0 && (
          <button
            onClick={onSaveQuiz}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Quiz
              </>
            )}
          </button>
        )}
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
        <div className="flex-1 overflow-hidden">
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Drag to reorder questions
          </p>
          <div className="space-y-3 overflow-y-auto pr-2" >
          {/* <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 300px)' }}> */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map((_, i) => i)}
                strategy={verticalListSortingStrategy}
              >
                {questions.map((question, index) => (
                  <SortableQuestionCard
                    key={index}
                    id={index}
                    question={question}
                    index={index}
                    onReject={onRejectQuestion}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQueue;