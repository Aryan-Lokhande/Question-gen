// client/src/components/SearchRoom.jsx
import { useState } from "react";
import axios from "axios";

const SearchRoom = ({ onRoomFound }) => {
  const [roomId, setRoomId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!roomId || roomId.length !== 5) {
      setError("Room ID must be exactly 5 characters");
      return;
    }

    setIsSearching(true);

    try {
      const token = localStorage.getItem("token");
      console.log("Searching call:", `${import.meta.env.VITE_API_URL}/api/rooms/search/${roomId}`);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rooms/search/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        onRoomFound(response.data.room);
        setRoomId("");
      }
    } catch (error) {
      console.log("Error searching room:", error);
      setError(error.response?.data?.error || "Room not found");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="Enter 5-character Room ID"
            maxLength={5}
            className={`w-full px-4 py-3 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono`}
          />
          {error && (
            <p className="absolute -bottom-6 left-0 text-red-500 text-sm">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSearching || roomId.length !== 5}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSearching ? (
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
              Searching...
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchRoom;
