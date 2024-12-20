import React, { useState, useContext } from 'react';
import { QrCode, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import QRCode from 'react-qr-code';
import TeamCard from '../components/TeamCard';
import Logo from '../components/Logo';
import { TeamsContext } from '../context/TeamsContext';
import Soundboard from '../components/Soundboard';

const GameBoard: React.FC = () => {
  const [showQR, setShowQR] = useState(false);
  const [logoUrl, setLogoUrl] = useState(() => {
    const savedLogo = localStorage.getItem('gameLogoUrl');
    return savedLogo || 'https://placehold.co/800x1000/1f2937/ffffff?text=Game+Logo';
  });
  
  const { teams, gameState, updateGameState, updateScore, removeMember, newGame, resetBuzzers } = useContext(TeamsContext);
  const baseUrl = window.location.origin + import.meta.env.BASE_URL;
  const joinUrl = `${baseUrl}#/join`;

  const handleNewGame = () => {
    if (window.confirm('Are you sure you want to start a new game? This will reset all scores and team members.')) {
      setLogoUrl('https://placehold.co/800x1000/1f2937/ffffff?text=Game+Logo');
      localStorage.removeItem('gameLogoUrl');
      newGame();
    }
  };

  const handleResetBuzzers = () => {
    resetBuzzers();
  };

  const handleLogoChange = (newUrl: string) => {
    setLogoUrl(newUrl);
    localStorage.setItem('gameLogoUrl', newUrl);
  };

  const handleRoundChange = (increment: number) => {
    updateGameState({
      roundNumber: Math.max(1, gameState.roundNumber + increment)
    });
  };

  return (
    <div className="h-screen bg-gray-900 p-4 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-2">
              <div className="flex items-center mr-4">
                <span className="text-white font-bold mr-2">Round</span>
                <span className="text-white text-xl font-bold mr-2">{gameState.roundNumber}</span>
                <div className="flex flex-col">
                  <button
                    onClick={() => handleRoundChange(1)}
                    className="text-gray-400 hover:text-white p-0.5"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRoundChange(-1)}
                    className="text-gray-400 hover:text-white p-0.5"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={gameState.roundText}
                onChange={(e) => updateGameState({ roundText: e.target.value })}
                className="bg-gray-700 text-white px-3 py-1 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Round description..."
              />
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white">
            DeutNeuerToteMeyerBorg Game Show Extravaganza!
          </h1>
        </div>

        <div className="flex-grow min-h-0 flex items-center justify-center gap-8">
          <div className="w-1/2 h-full">
            <Logo imageUrl={logoUrl} onImageChange={handleLogoChange} />
          </div>
          <div className="w-1/2 h-full flex items-center">
            <Soundboard />
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
      </div>
    </div>
  );
};

export default GameBoard;
