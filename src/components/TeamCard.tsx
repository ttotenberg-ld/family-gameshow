import React from 'react';
import { Team } from '../types';
import { Plus, Minus, X, Bell } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  teams: Team[];  // Add teams array to compare timestamps
  onScoreChange: (increment: number) => void;
  onRemoveMember: (memberName: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, teams, onScoreChange, onRemoveMember }) => {
  // Find the team that buzzed in first
  const firstBuzz = teams
    .filter(t => t.buzzerTimestamp !== undefined)
    .sort((a, b) => (a.buzzerTimestamp || 0) - (b.buzzerTimestamp || 0))[0];

  const isBuzzedIn = team.buzzedInMember !== undefined;
  const isFirstBuzz = firstBuzz?.name === team.name;

  return (
    <div className={`rounded-lg overflow-hidden ${team.theme.secondary}`}>
      {/* Team Image */}
      <div className="relative h-48">
        <img 
          src={team.image} 
          alt={team.name}
          className="w-full h-full object-cover"
        />
        {isBuzzedIn && (
          <div className={`absolute inset-0 ${team.theme.primary} bg-opacity-75 flex items-center justify-center`}>
            <div className="text-center text-white">
              <Bell className={`w-12 h-12 mx-auto mb-2 ${isFirstBuzz ? 'animate-bounce' : ''}`} />
              <p className="text-lg font-bold">{team.buzzedInMember}</p>
              <p className="text-sm">{isFirstBuzz ? "First to Buzz!" : "Buzzed In!"}</p>
              {isFirstBuzz && (
                <div className="mt-1 px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-bold inline-block">
                  FIRST!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Team Info */}
      <div className="p-4">
        <h2 className={`text-xl font-bold ${team.theme.text} mb-2`}>{team.name}</h2>
        
        {/* Score Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onScoreChange(-1)}
            className={`${team.theme.primary} ${team.theme.hover} text-white p-2 rounded-full`}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className={`text-2xl font-bold ${team.theme.text}`}>{team.score}</span>
          <button
            onClick={() => onScoreChange(1)}
            className={`${team.theme.primary} ${team.theme.hover} text-white p-2 rounded-full`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Team Members */}
        <div className="space-y-2">
          <h3 className={`text-sm font-semibold ${team.theme.text}`}>Team Members:</h3>
          {team.members.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No members yet</p>
          ) : (
            <ul className="space-y-1">
              {team.members.map((member) => (
                <li 
                  key={member}
                  className={`flex items-center justify-between ${team.theme.text} text-sm`}
                >
                  <span className="flex items-center">
                    {member}
                    {member === firstBuzz?.buzzedInMember && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-black text-xs rounded-full font-bold">
                        First!
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => onRemoveMember(member)}
                    className={`${team.theme.primary} ${team.theme.hover} text-white p-1 rounded-full`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
