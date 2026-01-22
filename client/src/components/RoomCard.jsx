// client/src/components/RoomCard.jsx
import { useState } from "react";

const RoomCard = ({ room, onToggleSave, isSaved, isOwnRoom = false }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Tech: "bg-blue-100 text-blue-800",
      Science: "bg-green-100 text-green-800",
      "Language-learning": "bg-purple-100 text-purple-800",
      Professional: "bg-indigo-100 text-indigo-800",
      "Career-Development": "bg-pink-100 text-pink-800",
      General: "bg-gray-100 text-gray-800",
      "Study-Room": "bg-yellow-100 text-yellow-800",
      Hobbies: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {room.roomName}
          </h3>
          <p className="text-sm text-gray-500 font-mono">ID: {room.roomId}</p>
        </div>

        {/* Toggle Save Button */}
        {!isOwnRoom && (
          <button
            onClick={() => onToggleSave(room.roomId)}
            className={`p-2 rounded-full transition ${
              isSaved
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
            title={isSaved ? "Remove from explored" : "Add to explored"}
          >
            {isSaved ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            ) : (
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(room.category)}`}
        >
          {room.category}
        </span>
      </div>

      {/* Description */}
      {room.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {room.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
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
          <span>{room.questionCount} Questions</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>{room.participantCount || 0} Participants</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {room.createdBy && <span>By {room.createdBy}</span>}
          {room.createdAt && <span> • {formatDate(room.createdAt)}</span>}
        </div>

        {/* Start Quiz Button */}
        <button
          disabled
          className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
          title="Coming soon"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
