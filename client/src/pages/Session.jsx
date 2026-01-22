// client/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateRoomModal from '../components/CreateRoomModal';
import SearchRoom from '../components/SearchRoom';
import RoomCard from '../components/RoomCard';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myRooms, setMyRooms] = useState([]);
  const [exploredRooms, setExploredRooms] = useState([]);
  const [searchedRoom, setSearchedRoom] = useState(null);
  const [savedRoomIds, setSavedRoomIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user's created rooms
      const myRoomsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rooms/my-rooms`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Fetch saved/explored rooms
      const savedRoomsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/saved-rooms`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (myRoomsRes.data.success) {
        setMyRooms(myRoomsRes.data.rooms);
      }

      if (savedRoomsRes.data.success) {
        setExploredRooms(savedRoomsRes.data.rooms);
        setSavedRoomIds(new Set(savedRoomsRes.data.rooms.map(r => r.roomId)));
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomFound = (room) => {
    setSearchedRoom(room);
  };

  const handleToggleSave = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      const isSaved = savedRoomIds.has(roomId);

      if (isSaved) {
        // Remove from saved
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/saved-rooms/remove/${roomId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setExploredRooms(prev => prev.filter(r => r.roomId !== roomId));
        setSavedRoomIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(roomId);
          return newSet;
        });
        
        if (searchedRoom?.roomId === roomId) {
          setSearchedRoom(null);
        }
      } else {
        // Add to saved
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/saved-rooms/add`,
          { roomId },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Refresh explored rooms
        fetchRooms();
        setSearchedRoom(null);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert(error.response?.data?.error || 'Failed to update room');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Quiz Rooms</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Room
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Search Room</h2>
          <SearchRoom onRoomFound={handleRoomFound} />

          {/* Searched Room Result */}
          {searchedRoom && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Search Result:</h3>
              <div className="max-w-md">
                <RoomCard
                  room={searchedRoom}
                  onToggleSave={handleToggleSave}
                  isSaved={savedRoomIds.has(searchedRoom.roomId)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Your Rooms Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Rooms</h2>
          {myRooms.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-gray-500">You haven't created any rooms yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Your First Room
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myRooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  isOwnRoom={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Explored Rooms Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Explored Rooms</h2>
          {exploredRooms.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-3"
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
              <p className="text-gray-500">No explored rooms yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Search for rooms using their 5-character ID
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {exploredRooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  onToggleSave={handleToggleSave}
                  isSaved={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;