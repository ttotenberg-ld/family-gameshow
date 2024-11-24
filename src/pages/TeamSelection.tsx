import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamsContext } from '../context/TeamsContext';
import { Team } from '../types';

const TeamSelection: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const { teams, addTeamMember } = useContext(TeamsContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeam && playerName.trim()) {
      // First add the team member
      addTeamMember(selectedTeam, playerName.trim());
      
      // Then navigate to the team page
      const encodedTeam = encodeURIComponent(selectedTeam);
      const encodedName = encodeURIComponent(playerName.trim());
      navigate(`/team/${encodedTeam}/${encodedName}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Select Your Team
        </h1>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="block w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-300 mb-2">
              Select Team
            </label>
            <select
              id="team"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="block w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
            >
              <option value="">Select a team</option>
              {teams.map((team: Team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Join Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamSelection;
