import React, { useState } from 'react';
import { Trophy, QrCode, RotateCcw } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import TeamCard from './components/TeamCard';
import TeamSelection from './pages/TeamSelection';
import TeamPage from './pages/TeamPage';
import { TeamsProvider, TeamsContext } from './context/TeamsContext';

const GameBoard: React.FC = () => {
  const [showQR, setShowQR] = useState(false);
  const { teams, updateScore, removeMember, newGame, resetBuzzers } = React.useContext(TeamsContext);
  const joinUrl = `${window.location.origin}${import.meta.env.BASE_URL}join`;

  const handleNewGame = () => {
    if (window.confirm('Are you sure you want to start a new game? This will reset all scores and team members.')) {
      newGame();
    }
  };

  const handleResetBuzzers = () => {
    resetBuzzers();
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Gameshow Scoreboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleResetBuzzers}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Reset Buzzers
            </button>
            <button
              onClick={handleNewGame}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              New Game
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Join Game
            </button>
          </div>
        </div>
        
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Scan to Join</h2>
                <button
                  onClick={() => setShowQR(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 bg-white">
                <QRCode value={joinUrl} />
              </div>
              <p className="mt-4 text-center text-sm text-gray-600">
                Scan this QR code to join a team
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              teams={teams}
              onScoreChange={(increment) => updateScore(team.id, increment)}
              onRemoveMember={(memberName) => removeMember(team.name, memberName)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <TeamsProvider>
        <Routes>
          <Route path="/" element={<GameBoard />} />
          <Route path="/join" element={<TeamSelection />} />
          <Route path="/team/:teamName/:playerName" element={<TeamPage />} />
          <Route path="*" element={<Navigate to="/join" replace />} />
        </Routes>
      </TeamsProvider>
    </Router>
  );
}

export default App;
