import React, { useState, useContext, useRef, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { TeamsContext } from '../context/TeamsContext';
import { Camera, Bell, Edit2 } from 'lucide-react';

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamName, playerName } = useParams<{ teamName: string; playerName: string }>();
  const { teams, updateTeamImage, updateTeamName, buzz } = useContext(TeamsContext);
  const [isBuzzed, setIsBuzzed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const decodedTeamName = decodeURIComponent(teamName || '');
  const decodedPlayerName = decodeURIComponent(playerName || '');
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (teams.length > 0) {
      const team = teams.find(t => t.name === decodedTeamName);
      if (team) {
        if (team.members.includes(decodedPlayerName)) {
          setIsLoading(false);
          setNewTeamName(team.name);
        } else {
          loadingTimeoutRef.current = setTimeout(() => {
            setShouldRedirect(true);
          }, 2000);
        }
      } else {
        // Check if this player exists in any team (in case team name was changed)
        const playerTeam = teams.find(t => t.members.includes(decodedPlayerName));
        if (playerTeam) {
          navigate(`/team/${encodeURIComponent(playerTeam.name)}/${encodeURIComponent(decodedPlayerName)}`);
        } else {
          setShouldRedirect(true);
        }
      }
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [teams, decodedTeamName, decodedPlayerName, navigate]);

  const team = teams.find(t => t.name === decodedTeamName);
  
  useEffect(() => {
    if (team && (!team.buzzes || team.buzzes.length === 0)) {
      setIsBuzzed(false);
    }
  }, [team?.buzzes]);

  if (isLoading && !shouldRedirect) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Verifying team membership...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  if (shouldRedirect || !team || !team.members.includes(decodedPlayerName)) {
    return <Navigate to="/join" replace />;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateTeamImage(team.name, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName && newTeamName !== team.name) {
      await updateTeamName(team.name, newTeamName);
      // Update URL to reflect new team name
      navigate(`/team/${encodeURIComponent(newTeamName)}/${encodeURIComponent(decodedPlayerName)}`);
    }
    setIsEditingName(false);
  };

  const handleBuzz = () => {
    if (!isBuzzed) {
      const timestamp = Date.now();
      buzz(team.name, decodedPlayerName, timestamp);
      setIsBuzzed(true);
    }
  };

  const getBuzzerState = () => {
    const allBuzzes = teams.flatMap(t => t.buzzes || []).sort((a, b) => a.timestamp - b.timestamp);
    const firstBuzz = allBuzzes[0];
    const playerHasBuzzed = team.buzzes?.some(b => b.memberName === decodedPlayerName);
    const isFirstBuzzer = firstBuzz && firstBuzz.memberName === decodedPlayerName;

    if (playerHasBuzzed) {
      return {
        disabled: true,
        content: (
          <div className="flex flex-col items-center">
            <Bell className={`w-12 h-12 ${isFirstBuzzer ? 'text-yellow-400 animate-bounce' : ''}`} />
            <span className="mt-2">
              {isFirstBuzzer ? "First to Buzz!" : "You Buzzed!"}
            </span>
            {isFirstBuzzer && (
              <span className="mt-1 px-2 py-0.5 bg-yellow-400 text-black text-xs rounded-full">
                FIRST!
              </span>
            )}
          </div>
        ),
        className: `${team.theme.primary}`
      };
    }

    if (isBuzzed) {
      return {
        disabled: true,
        content: (
          <div className="flex flex-col items-center">
            <Bell className="w-12 h-12 animate-bounce" />
            <span className="mt-2">Buzzing...</span>
          </div>
        ),
        className: `${team.theme.primary}`
      };
    }

    return {
      disabled: false,
      content: (
        <div className="flex flex-col items-center">
          <Bell className="w-12 h-12" />
          <span className="mt-2">BUZZ!</span>
        </div>
      ),
      className: `${team.theme.primary} ${team.theme.hover} active:scale-95`
    };
  };

  const buzzerState = getBuzzerState();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Team Header */}
      <div className={`${team.theme.secondary} p-4 shadow-lg relative`}>
        {isEditingName ? (
          <form onSubmit={handleNameSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className={`text-2xl font-bold bg-white rounded px-2 py-1 ${team.theme.text} flex-grow`}
              autoFocus
            />
            <button
              type="submit"
              className={`${team.theme.primary} text-white px-4 py-2 rounded-lg hover:opacity-90`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setNewTeamName(team.name);
                setIsEditingName(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-bold ${team.theme.text}`}>
              {team.name} - {decodedPlayerName}
            </h1>
            <button
              onClick={() => setIsEditingName(true)}
              className={`${team.theme.primary} ${team.theme.hover} text-white p-2 rounded-lg ml-4`}
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col space-y-6">
        {/* Team Image Section */}
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={team.image} 
            alt={team.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`absolute bottom-4 right-4 ${team.theme.primary} ${team.theme.hover} text-white p-3 rounded-full shadow-lg`}
          >
            <Camera className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Buzzer Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            onClick={handleBuzz}
            disabled={buzzerState.disabled}
            className={`w-48 h-48 rounded-full ${
              buzzerState.className
            } text-white text-2xl font-bold shadow-lg transform transition-all duration-200`}
          >
            {buzzerState.content}
          </button>
        </div>

        {/* Team Members and Buzzes */}
        <div className={`${team.theme.secondary} rounded-lg p-4`}>
          <h2 className={`text-lg font-semibold ${team.theme.text} mb-2`}>
            Team Members
          </h2>
          <div className="flex flex-wrap gap-2">
            {team.members.map((member) => {
              const memberBuzz = team.buzzes?.find(b => b.memberName === member);
              return (
                <span
                  key={member}
                  className={`${team.theme.primary} text-white px-3 py-1 rounded-full text-sm flex items-center`}
                >
                  {member}
                  {memberBuzz && (
                    <Bell className="w-4 h-4 ml-1" />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
