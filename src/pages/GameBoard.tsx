import React, { useState } from 'react';
import { QrCode, RotateCcw } from 'lucide-react';
import QRCode from 'react-qr-code';
import TeamCard from '../components/TeamCard';
import Logo from '../components/Logo';
import { TeamsContext } from '../context/TeamsContext';

const DEFAULT_LOGO_URL = 'https://placehold.co/800x1000/1f2937/ffffff?text=Game+Logo';

const GameBoard: React.FC = () => {
  const [showQR, setShowQR] = useState(false);
  const [logoUrl, setLogoUrl] = useState(() => {
    const savedLogo = localStorage.getItem('gameLogoUrl');
    return savedLogo || DEFAULT_LOGO_URL;
  });
  
  const { teams, updateScore, removeMember, newGame, resetBuzzers } = React.useContext(TeamsContext);
  const baseUrl = window.location.origin + import.meta.env.BASE_URL;
  const joinUrl = `${baseUrl}#/join`;

  const handleNewGame = () => {
    if (window.confirm('Are you sure you want to start a new game? This will reset all scores and team members.')) {
      setLogoUrl(DEFAULT_LOGO_URL);
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

  const triggerLogoUpload = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="h-screen bg-gray-900 p-4 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <div className="flex justify-end mb-4">
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

        <div className="flex-grow min-h-0 flex items-center justify-center gap-4">
          <div className="w-1/2 h-full">
            <Logo imageUrl={logoUrl} onImageChange={handleLogoChange} />
          </div>
          <div className="flex flex-col justify-center">
            <button
              onClick={triggerLogoUpload}
              className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Change Logo
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
      </div>
    </div>
  );
};

export default GameBoard;
