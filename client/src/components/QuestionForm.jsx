// client/src/components/QuestionForm.jsx
import { useState } from 'react';
import axios from 'axios';

const QuestionForm = ({ onQuestionsGenerated, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: []
  });

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleDifficultyToggle = (level) => {
    setFormData(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(level)
        ? prev.difficulty.filter(d => d !== level)
        : [...prev.difficulty, level]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || formData.difficulty.length === 0) {
      alert('Please enter a title and select at least one difficulty level');
      return;
    }

    setIsLoading(true);

    try {
      console.log(formData);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/questions/generate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        onQuestionsGenerated(response.data.questions);
        // Reset form
        setFormData({
          title: '',
          description: '',
          difficulty: []
        });
      } else {
        alert(response.data.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert(error.response?.data?.error || 'Failed to generate questions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Generate Questions</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic/Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., JavaScript Array Methods"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Additional context or specific topics..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Levels <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {difficulties.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleDifficultyToggle(level)}
                disabled={isLoading}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  formData.difficulty.includes(level)
                    ? level === 'Easy'
                      ? 'bg-green-600 text-white'
                      : level === 'Medium'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            'Generate Questions'
          )}
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;