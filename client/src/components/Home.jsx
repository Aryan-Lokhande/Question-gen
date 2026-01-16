import { useState } from "react";
import axios from "axios";
import QuestionQueue from "./QuestionQueue";

export default function Home() {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState([]);
  const [loading, setLoading] = useState(false);

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
      //   console.log("Submitting:", { title, description, difficulty });
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/generate", {
        title,
        description,
        difficulty,
      });
      setGeneratedQuestions(res.data.questions);
      console.log("Response from server:", res.data);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Host Quiz Question Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left */}
        {/* form */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Give question details</h2>

          <input
            className="w-full p-2 mb-3 rounded text-white bg-gray-600"
            placeholder="Title / Topic"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-2 mb-3 rounded text-white bg-gray-600"
            placeholder="Description (optional)"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="mb-3">
            <p className="mb-1">Difficulty</p>
            {["Easy", "Medium", "Hard"].map((level) => (
              <label key={level} className="mr-4">
                <input
                  type="checkbox"
                  className="mr-1"
                  onChange={() => toggleDifficulty(level)}
                />
                {level}
              </label>
            ))}
          </div>
          {loading && (
            <p className="mb-3 text-yellow-400">Generating questions...</p>
          )}

          <button
            onClick={handleSubmit}
            className="bg-purple-600 px-4 py-2 rounded w-full"
          >
            Generate Questions
          </button>
        </div>

        {/* center */}
          <QuestionQueue questions={generatedQuestions} />

      </div>

      <div className="mt-8 text-center">
        <button className="bg-green-600 px-6 py-2 rounded opacity-60 cursor-not-allowed">
          Start Quiz
        </button>
      </div>
    </div>
  );
}
