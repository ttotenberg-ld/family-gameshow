import React, { createContext, useState, useEffect } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '../firebase';
import { Team } from '../types';

const initialTeams: Team[] = [
  {
    id: 1,
    name: 'Phoenix',
    color: 'red',
    members: [],
    score: 0,
    image: 'https://dreamersia.com/wp-content/uploads/2023/06/Hong_Hy_the_legendary_phoenix_majestic_bright_vibrant_sacred_go_aa9b74f0-9e4e-4b44-9ad0-2e42c2733cfe.png',
    theme: {
      primary: 'bg-red-500',
      secondary: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      hover: 'hover:bg-red-600',
    }
  },
  {
    id: 2,
    name: 'Dragons',
    color: 'blue',
    members: [],
    score: 0,
    image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&q=80&w=500',
    theme: {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      hover: 'hover:bg-blue-600',
    }
  },
  {
    id: 3,
    name: 'Tigers',
    color: 'amber',
    members: [],
    score: 0,
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=500',
    theme: {
      primary: 'bg-amber-500',
      secondary: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300',
      hover: 'hover:bg-amber-600',
    }
  },
  {
    id: 4,
    name: 'Panthers',
    color: 'purple',
    members: [],
    score: 0,
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&q=80&w=500',
    theme: {
      primary: 'bg-purple-500',
      secondary: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      hover: 'hover:bg-purple-600',
    }
  }
];

interface TeamsContextType {
  teams: Team[];
  addTeamMember: (teamName: string, playerName: string) => void;
  removeMember: (teamName: string, memberName: string) => void;
  updateScore: (teamId: number, increment: number) => void;
  newGame: () => void;
  updateTeamImage: (teamName: string, imageUrl: string) => void;
  buzz: (teamName: string, memberName: string, timestamp: number) => void;
  resetBuzzers: () => void;
}

export const TeamsContext = createContext<TeamsContextType>({
  teams: [],
  addTeamMember: () => {},
  removeMember: () => {},
  updateScore: () => {},
  newGame: () => {},
  updateTeamImage: () => {},
  buzz: () => {},
  resetBuzzers: () => {},
});

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const teamsRef = ref(database, 'teams');

  // Initialize teams data if it doesn't exist
  useEffect(() => {
    const initializeTeams = async () => {
      const snapshot = await get(teamsRef);
      if (!snapshot.exists()) {
        await set(teamsRef, initialTeams);
      }
    };
    initializeTeams();
  }, []);

  // Listen for teams updates
  useEffect(() => {
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeams(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateTeams = async (newTeams: Team[]) => {
    await set(teamsRef, newTeams);
  };

  const addTeamMember = async (teamName: string, playerName: string) => {
    const newTeams = teams.map(team =>
      team.name === teamName
        ? { ...team, members: [...team.members, playerName] }
        : team
    );
    await updateTeams(newTeams);
  };

  const removeMember = async (teamName: string, memberName: string) => {
    const newTeams = teams.map(team =>
      team.name === teamName
        ? { ...team, members: team.members.filter(member => member !== memberName) }
        : team
    );
    await updateTeams(newTeams);
  };

  const updateScore = async (teamId: number, increment: number) => {
    const newTeams = teams.map(team =>
      team.id === teamId
        ? { ...team, score: Math.max(0, team.score + increment) }
        : team
    );
    await updateTeams(newTeams);
  };

  const updateTeamImage = async (teamName: string, imageUrl: string) => {
    const newTeams = teams.map(team =>
      team.name === teamName
        ? { ...team, image: imageUrl }
        : team
    );
    await updateTeams(newTeams);
  };

  const buzz = async (teamName: string, memberName: string, timestamp: number) => {
    // Only update if no one has buzzed in yet
    const anyoneBuzzed = teams.some(t => t.buzzedInMember !== undefined);
    if (!anyoneBuzzed) {
      const newTeams = teams.map(team =>
        team.name === teamName
          ? { ...team, buzzedInMember: memberName, buzzerTimestamp: timestamp }
          : team
      );
      await updateTeams(newTeams);
    }
  };

  const resetBuzzers = async () => {
    const newTeams = teams.map(team => ({
      ...team,
      buzzedInMember: undefined,
      buzzerTimestamp: undefined
    }));
    await updateTeams(newTeams);
  };

  const newGame = async () => {
    await updateTeams(initialTeams);
  };

  const contextValue = {
    teams,
    addTeamMember,
    removeMember,
    updateScore,
    newGame,
    updateTeamImage,
    buzz,
    resetBuzzers
  };

  return (
    <TeamsContext.Provider value={contextValue}>
      {children}
    </TeamsContext.Provider>
  );
};

export default TeamsContext;
