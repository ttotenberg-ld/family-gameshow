import React from 'react';
import { Team } from '../types';
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

  // Get buzz order numbers for this team's buzzes
  const getBuzzOrder = (timestamp: number) => {
    return allBuzzes.findIndex(buzz => buzz.timestamp === timestamp) + 1;
  };

  // Format timestamp difference from first buzz
  const getTimeDiff = (timestamp: number) => {
    if (!firstBuzz) return '';
    const diff = timestamp - firstBuzz.timestamp;
    if (diff === 0) return '';
    return `+${diff}ms`;
  };

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
                {teamBuzzes.map((buzz) => {
                  const order = getBuzzOrder(buzz.timestamp);
                  const timeDiff = getTimeDiff(buzz.timestamp);
                  return (
                    <div key={buzz.timestamp} className="flex items-center justify-center space-x-2">
                      <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {order}
                      </span>
                      <p className="text-lg font-bold">
                        {buzz.memberName}
                        {order === 1 && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-black text-xs rounded-full">
                            FIRST!
                          </span>
                        )}
                        {timeDiff && (
                          <span className="ml-2 text-xs opacity-75">
                            {timeDiff}
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
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
              {members.map((member) => {
                const memberBuzz = teamBuzzes.find(b => b.memberName === member);
                const order = memberBuzz ? getBuzzOrder(memberBuzz.timestamp) : null;
                return (
                  <li 
                    key={member}
                    className={`flex items-center justify-between ${team.theme.text} text-sm`}
                  >
                    <span className="flex items-center">
                      {member}
                      {order && (
                        <span className={`ml-2 px-2 py-0.5 ${
                          order === 1 ? 'bg-yellow-400' : 'bg-gray-200'
                        } text-black text-xs rounded-full font-bold`}>
                          #{order}
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
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
