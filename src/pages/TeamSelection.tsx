import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamsContext } from '../context/TeamsContext';
import { Team } from '../types';

const TeamSelectionCard: React.FC<{ 
  team: Team; 
  onClick: () => void;
  isSelected: boolean;
}> = ({ team, onClick, isSelected }) => {
  const memberCount = team.members?.length || 0;
  
  return (
    <div 
      onClick={onClick}
      className={`${team.theme.secondary} rounded-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-102
        ${isSelected ? 'ring-2 ring-blue-500 scale-102' : ''}`}
    >
      {/* Team Image */}
      <div className="relative h-28 sm:h-32">
        <img 
          src={team.image} 
          alt={team.name}
          className="w-full h-full object-cover"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Selected
            </div>
          </div>
        )}
      </div>

      {/* Team Info */}
      <div className="p-2">
        <h2 className={`text-base sm:text-lg font-bold ${team.theme.text} text-center`}>{team.name}</h2>
        <p className="text-xs text-gray-500 text-center mt-0.5">
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </p>
      </div>
    </div>
  );
};

const TeamSelection: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const { teams, addTeamMember } = useContext(TeamsContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeam && playerName.trim()) {
      addTeamMember(selectedTeam, playerName.trim());
      const encodedTeam = encodeURIComponent(selectedTeam);
      const encodedName = encodeURIComponent(playerName.trim());
      navigate(`/team/${encodedTeam}/${encodedName}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-3 px-2 sm:py-6 sm:px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl sm:text-3xl font-bold text-white text-center mb-3 sm:mb-6">
          Select Your Team
        </h1>
        
        {/* Name Input */}
        <div className="mb-3 sm:mb-6">
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="block w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
            placeholder="Enter your name"
          />
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-20 sm:mb-6">
          {teams?.map((team) => (
            <TeamSelectionCard
              key={team.id}
              team={team}
              onClick={() => setSelectedTeam(team.name)}
              isSelected={team.name === selectedTeam}
            />
          ))}
        </div>

        {/* Join Button - Sticky on mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-2 bg-gray-900 bg-opacity-95 border-t border-gray-800 sm:static sm:p-0 sm:bg-transparent sm:border-0">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleSubmit}
              disabled={!selectedTeam || !playerName.trim()}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-all duration-200 shadow-lg text-base
                ${selectedTeam && playerName.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-98'
                  : 'bg-gray-600 cursor-not-allowed'
                }`}
            >
              {selectedTeam && playerName.trim() ? 'Join Team' : 'Enter Name & Select Team'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;
