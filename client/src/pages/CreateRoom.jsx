// client/src/pages/CreateRoom.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QuestionForm from "../components/QuestionForm";
import QuestionCard from "../components/QuestionCard";
import QuizQueue from "../components/QuizQueue";

const CreateRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Load room initialization data and quiz queue from localStorage
  useEffect(() => {
    const roomInitData = localStorage.getItem("currentRoomInit");
    if (roomInitData) {
      const data = JSON.parse(roomInitData);
      if (data.roomId === roomId) {
        setRoomData(data);
      } else {
        alert("Invalid room initialization");
        navigate("/");
      }
    } else {
      alert("Room initialization data not found");
      navigate("/");
    }

    // Load saved quiz queue
    const savedQueue = localStorage.getItem(`quizQueue_${roomId}`);
    if (savedQueue) {
      setSelectedQuestions(JSON.parse(savedQueue));
    }
  }, [roomId, navigate]);

  const handleQuestionsGenerated = (questions) => {
    // Add unique IDs to questions
    const questionsWithIds = questions.map((q, idx) => ({
      ...q,
      id: `${Date.now()}_${idx}`,
    }));
    setGeneratedQuestions(questionsWithIds);
  };

  const handleToggleQuestion = (question) => {
    const isAlreadySelected = selectedQuestions.some(
      (q) => q.id === question.id,
    );

    if (isAlreadySelected) {
      setSelectedQuestions((prev) => prev.filter((q) => q.id !== question.id));
    } else {
      setSelectedQuestions((prev) => [...prev, question]);
    }
  };

  const handleCreateRoom = async () => {
    if (selectedQuestions.length < 5) {
      alert("Please select at least 5 questions");
      return;
    }

    setIsCreating(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare questions data (remove temporary id)
      const questionsData = selectedQuestions.map(({ id, ...rest }) => rest);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rooms/create`,
        {
          roomName: roomData.roomName,
          category: roomData.category,
          description: roomData.description,
          questions: questionsData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        // Clear localStorage
        localStorage.removeItem("currentRoomInit");
        localStorage.removeItem(`quizQueue_${roomId}`);

        alert("Room created successfully!");
        navigate("/");
      } else {
        alert(response.data.error || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert(error.response?.data?.error || "Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {roomData.roomName}
              </h1>
              <div className="flex gap-3 mt-1">
                <span className="text-sm text-gray-500">
                  ID:{" "}
                  <span className="font-mono font-semibold">
                    {roomData.roomId}
                  </span>
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded">
                  {roomData.category}
                </span>
              </div>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={selectedQuestions.length < 5 || isCreating}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Create Room
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Column 1: Form */}
          <div className="col-span-3">
            <QuestionForm
              onQuestionsGenerated={handleQuestionsGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Column 2: Generated Questions */}
          <div className="col-span-5">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Question Queue ({generatedQuestions.length})
              </h3>

              {generatedQuestions.length === 0 ? (
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
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">
                    No questions generated yet
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Use the form to generate questions
                  </p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
                  {generatedQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      onToggle={() => handleToggleQuestion(question)}
                      isSelected={selectedQuestions.some(
                        (q) => q.id === question.id,
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Quiz Queue (Draggable) */}
          <div className="col-span-4">
            <QuizQueue
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              roomId={roomId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
