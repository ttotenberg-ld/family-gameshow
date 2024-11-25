import React from 'react';
import { Team, BuzzInfo } from '../types';
import { Plus, Minus, X, Bell } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  teams: Team[];
  onScoreChange: (increment: number) => void;
  onRemoveMember: (memberName: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, teams, onScoreChange, onRemoveMember }) => {
  // Get all buzzes across all teams and sort by timestamp
  const allBuzzes = teams
    .flatMap(t => (t.buzzes || []))
    .sort((a, b) => a.timestamp - b.timestamp);

  const firstBuzz = allBuzzes[0];
  const teamBuzzes = team.buzzes || [];
  const hasBuzzed = teamBuzzes.length > 0;
  const isFirstBuzz = firstBuzz && teamBuzzes.some(buzz => buzz.timestamp === firstBuzz.timestamp);
  const members = team.members || [];

  return (
    <div className={`rounded-lg overflow-hidden ${team.theme.secondary}`}>
      {/* Team Image */}
      <div className="relative h-48">
        <img 
          src={team.image} 
          alt={team.name}
          className="w-full h-full object-cover"
        />
        {hasBuzzed && (
          <div className={`absolute inset-0 ${team.theme.primary} bg-opacity-75 flex items-center justify-center`}>
            <div className="text-center text-white">
              <Bell className={`w-12 h-12 mx-auto mb-2 ${isFirstBuzz ? 'animate-bounce' : ''}`} />
              <div className="space-y-1">
                {teamBuzzes.map((buzz, index) => (
                  <div key={buzz.timestamp} className="flex items-center justify-center">
                    <p className="text-lg font-bold">
                      {buzz.memberName}
                      {index === 0 && isFirstBuzz && (
                        <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-black text-xs rounded-full">
                          FIRST!
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
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
          <span className={`text-2xl font-bold ${team.theme.text}`}>{team.score || 0}</span>
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
          {members.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No members yet</p>
          ) : (
            <ul className="space-y-1">
              {members.map((member) => (
                <li 
                  key={member}
                  className={`flex items-center justify-between ${team.theme.text} text-sm`}
                >
                  <span className="flex items-center">
                    {member}
                    {firstBuzz && firstBuzz.memberName === member && (
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
