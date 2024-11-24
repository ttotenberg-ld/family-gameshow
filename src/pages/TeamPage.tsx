import React, { useState, useContext, useRef, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TeamsContext } from '../context/TeamsContext';
import { Camera, Bell } from 'lucide-react';

const TeamPage: React.FC = () => {
  const { teamName, playerName } = useParams<{ teamName: string; playerName: string }>();
  const { teams, updateTeamImage, buzz } = useContext(TeamsContext);
  const [isBuzzed, setIsBuzzed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Connecting to server...');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const decodedPlayerName = decodeURIComponent(playerName || '');
  
  // Wait for teams data to be loaded
  useEffect(() => {
    console.log('Teams state updated:', teams);
    if (teams.length > 0) {
      console.log('Teams loaded, checking membership...');
      const team = teams.find(t => t.name === teamName);
      if (team) {
        console.log('Found team:', team.name);
        console.log('Team members:', team.members);
        console.log('Looking for player:', decodedPlayerName);
        if (team.members.includes(decodedPlayerName)) {
          console.log('Player found in team');
          setLoadingMessage('Connected!');
          setIsLoading(false);
        } else {
          console.log('Player not found in team members');
          setLoadingMessage('Verifying team membership...');
        }
      } else {
        console.log('Team not found');
        setLoadingMessage('Verifying team...');
      }
    } else {
      console.log('Waiting for teams data...');
      setLoadingMessage('Loading teams data...');
    }
  }, [teams, teamName, decodedPlayerName]);

  const team = teams.find(t => t.name === teamName);
  
  // Effect hook for resetting buzz state
  useEffect(() => {
    if (team && !team.buzzedInMember) {
      setIsBuzzed(false);
    }
  }, [team?.buzzedInMember]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">{loadingMessage}</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  // Redirect if team or player not found
  if (!team || !team.members.includes(decodedPlayerName)) {
    console.log('Final check failed - redirecting to join');
    console.log('Current teams state:', teams);
    console.log('Looking for team:', teamName);
    console.log('Looking for player:', decodedPlayerName);
    return <Navigate to="/join" replace />;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a data URL from the file
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateTeamImage(team.name, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBuzz = () => {
    if (!isBuzzed && !team.buzzedInMember) {
      const timestamp = Date.now();
      buzz(team.name, decodedPlayerName, timestamp);
      setIsBuzzed(true);
    }
  };

  const getBuzzerState = () => {
    if (team.buzzedInMember) {
      // Someone on any team has buzzed in
      const isSelf = team.buzzedInMember === decodedPlayerName;
      return {
        disabled: true,
        content: (
          <div className="flex flex-col items-center">
            <Bell className={`w-12 h-12 ${isSelf ? 'text-green-400' : ''}`} />
            <span className="mt-2">
              {isSelf ? "You Buzzed!" : `${team.buzzedInMember} Buzzed!`}
            </span>
          </div>
        ),
        className: isSelf ? `${team.theme.primary}` : 'bg-gray-500'
      };
    }

    if (isBuzzed) {
      // Local state shows we've buzzed but waiting for server confirmation
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

    // Ready to buzz
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
      <div className={`${team.theme.secondary} p-4 shadow-lg`}>
        <h1 className={`text-2xl font-bold ${team.theme.text}`}>
          {team.name} - {decodedPlayerName}
        </h1>
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

        {/* Team Members */}
        <div className={`${team.theme.secondary} rounded-lg p-4`}>
          <h2 className={`text-lg font-semibold ${team.theme.text} mb-2`}>
            Team Members
          </h2>
          <div className="flex flex-wrap gap-2">
            {team.members.map((member) => (
              <span
                key={member}
                className={`${team.theme.primary} text-white px-3 py-1 rounded-full text-sm`}
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
