// client/src/components/QuizQueue.jsx
import { useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import QuestionCard from "./QuestionCard";

// Sortable Item Component
const SortableQuestionCard = ({ question, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <QuestionCard
        question={question}
        onToggle={onRemove}
        isSelected={true}
        showOrder={true}
        order={index + 1}
      />
    </div>
  );
};

const QuizQueue = ({ selectedQuestions, setSelectedQuestions, roomId }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Save to localStorage whenever selectedQuestions changes
  useEffect(() => {
    if (roomId) {
      localStorage.setItem(
        `quizQueue_${roomId}`,
        JSON.stringify(selectedQuestions),
      );
    }
  }, [selectedQuestions, roomId]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (questionId) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Quiz Queue ({selectedQuestions.length})
        </h3>
        {selectedQuestions.length >= 5 && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Ready to Create
          </span>
        )}
      </div>

      {selectedQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 text-sm">No questions selected yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Select at least 5 questions to create a room
          </p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedQuestions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {selectedQuestions.map((question, index) => (
                <SortableQuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  onRemove={() => handleRemove(question.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {selectedQuestions.length > 0 && selectedQuestions.length < 5 && (
        <p className="text-amber-600 text-xs mt-4 text-center">
          Add {5 - selectedQuestions.length} more question(s) to create room
        </p>
      )}
    </div>
  );
};

export default QuizQueue;
