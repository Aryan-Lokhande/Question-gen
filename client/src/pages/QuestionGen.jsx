import { useState } from "react";
import axios from "axios";
import QuestionQueue from "../components/QuestionQueue";
import QuizQueue from "../components/QuizQueue";

export default function QuestionGen() {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [acceptedIds, setAcceptedIds] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleDifficulty = (level) => {
    setDifficulty((prev) =>
      prev.includes(level) ? prev.filter((d) => d !== level) : [...prev, level]
    );
  };

  const handleSubmit = async () => {
    if (!title || difficulty.length === 0) {
      alert("Title and at least one difficulty required");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/questions/generate", {
        title,
        description,
        difficulty,
      });
      setGeneratedQuestions(res.data.questions);
      setQuizQuestions([]);
      setAcceptedIds([]);
      console.log("Generated questions:", res.data);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuestion = (question) => {
    const questionIndex = generatedQuestions.indexOf(question);
    
    if (!acceptedIds.includes(questionIndex)) {
      setAcceptedIds([...acceptedIds, questionIndex]);
      setQuizQuestions([...quizQuestions, question]);
    }
  };

  const handleRejectQuestion = (question) => {
    const updatedQuizQuestions = quizQuestions.filter(q => q !== question);
    const questionIndex = generatedQuestions.indexOf(question);
    
    setQuizQuestions(updatedQuizQuestions);
    setAcceptedIds(acceptedIds.filter(id => id !== questionIndex));
  };

  const handleReorderQuestions = (newQuestions) => {
    setQuizQuestions(newQuestions);
  };

  const handleSaveQuiz = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name for the quiz.");
      return;
    }

    if (quizQuestions.length === 0) {
      alert("Please select at least one question for the quiz.");
      return;
    }

    setSaving(true);
    try {
      console.log("before save quiz",quizQuestions)
      const response = await axios.post("http://localhost:5000/api/quiz/save", {
        roomName: roomName.trim(),
        title,
        description,
        difficulty,
        questions: quizQuestions
      });

      if (response.data.success) {
        alert(`✅ Quiz "${roomName}" saved successfully!\nQuiz ID: ${response.data.quizId}\nTotal Questions: ${response.data.totalQuestions}`);
        
        // Reset form for new quiz
        setRoomName("");
        setTitle("");
        setDescription("");
        setDifficulty([]);
        setGeneratedQuestions([]);
        setQuizQuestions([]);
        setAcceptedIds([]);
      }
    } catch (error) {
      console.error("Failed to save quiz:", error);
      if (error.response?.data?.error) {
        alert(`❌ Error: ${error.response.data.error}`);
      } else {
        alert("Failed to save quiz. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Question Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* LEFT - Form Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">
            Question Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Room Name *
              </label>
              <input
                className="w-full p-3 rounded-lg text-white bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none transition"
                placeholder="e.g., Room1, JavaScript-Quiz"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Unique identifier for this quiz</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Title / Topic *
              </label>
              <input
                className="w-full p-3 rounded-lg text-white bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none transition"
                placeholder="e.g., JavaScript Basics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                className="w-full p-3 rounded-lg text-white bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none transition resize-none"
                placeholder="Add additional context..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty Level *
              </label>
              <div className="space-y-2">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <label 
                    key={level} 
                    className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 accent-purple-600"
                      checked={difficulty.includes(level)}
                      onChange={() => toggleDifficulty(level)}
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                <svg className="animate-spin h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-yellow-400 text-sm">Generating...</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded-lg w-full font-medium transition-colors"
            >
              {loading ? "Generating..." : "Generate Questions"}
            </button>
          </div>
        </div>

        {/* CENTER - Generated Questions */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <QuestionQueue 
            questions={generatedQuestions}
            onAcceptQuestion={handleAcceptQuestion}
            acceptedIds={acceptedIds}
          />
        </div>

        {/* RIGHT - Quiz Queue */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <QuizQueue 
            questions={quizQuestions}
            onRejectQuestion={handleRejectQuestion}
            onReorderQuestions={handleReorderQuestions}
            onSaveQuiz={handleSaveQuiz}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}