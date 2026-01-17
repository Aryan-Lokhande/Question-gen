import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import QuestionCard from './QuestionCard';

const SortableQuestionCard = ({ id, question, index, onReject }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative">
        {/* Drag Handle */}
        <div
          {...listeners}
          className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-700 rounded-l-lg transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        
        {/* Question Card with left padding for drag handle */}
        <div className="pl-6">
          <QuestionCard
            question={question}
            index={index}
            onAccept={() => {}}
            onReject={onReject}
            isAccepted={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SortableQuestionCard;