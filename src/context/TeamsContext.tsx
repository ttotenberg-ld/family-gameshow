import React, { createContext, useState, useEffect } from 'react';
import { ref, onValue, set, get, Database } from 'firebase/database';
import { database } from '../firebase';
import { Team, BuzzInfo, GameState } from '../types';

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

const initialGameState: GameState = {
  roundNumber: 1,
  roundText: ''
};

interface TeamsContextType {
  teams: Team[];
  gameState: GameState;
  addTeamMember: (teamName: string, playerName: string) => Promise<void>;
  removeMember: (teamName: string, memberName: string) => Promise<void>;
  updateScore: (teamId: number, increment: number) => Promise<void>;
  newGame: () => Promise<void>;
  updateTeamImage: (teamName: string, imageUrl: string) => Promise<void>;
  updateTeamName: (oldName: string, newName: string) => Promise<void>;
  updateGameState: (updates: Partial<GameState>) => Promise<void>;
  buzz: (teamName: string, memberName: string, timestamp: number) => Promise<void>;
  resetBuzzers: () => Promise<void>;
}

export const TeamsContext = createContext<TeamsContextType>({
  teams: [],
  gameState: initialGameState,
  addTeamMember: async () => {},
  removeMember: async () => {},
  updateScore: async () => {},
  newGame: async () => {},
  updateTeamImage: async () => {},
  updateTeamName: async () => {},
  updateGameState: async () => {},
  buzz: async () => {},
  resetBuzzers: async () => {},
});

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const teamsRef = ref(database as Database, 'teams');
  const gameStateRef = ref(database as Database, 'gameState');

  useEffect(() => {
    let mounted = true;

    const initializeTeams = async () => {
      try {
        const snapshot = await get(teamsRef);
        if (!snapshot.exists()) {
          await set(teamsRef, initialTeams);
        }
      } catch (error) {
        console.error('Error initializing teams:', error);
      }
    };

    const initializeGameState = async () => {
      try {
        const snapshot = await get(gameStateRef);
        if (!snapshot.exists()) {
          await set(gameStateRef, initialGameState);
        }
      } catch (error) {
        console.error('Error initializing game state:', error);
      }
    };

    // Set up realtime listeners
    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      if (mounted) {
        const data = snapshot.val();
        if (data) {
          const teamsWithMembers = Object.values(data as Record<string, Partial<Team>>).map((team) => ({
            ...team,
            members: team.members || [],
            buzzes: team.buzzes || []
          }));
          setTeams(teamsWithMembers as Team[]);
        } else {
          initializeTeams();
        }
      }
    }, (error) => {
      console.error('Error listening to teams updates:', error);
    });

    const unsubscribeGameState = onValue(gameStateRef, (snapshot) => {
      if (mounted) {
        const data = snapshot.val();
        if (data) {
          setGameState(data as GameState);
        } else {
          initializeGameState();
        }
      }
    }, (error) => {
      console.error('Error listening to game state updates:', error);
    });

    return () => {
      mounted = false;
      unsubscribeTeams();
      unsubscribeGameState();
    };
  }, []);

  const updateTeams = async (newTeams: Team[]) => {
    try {
      await set(teamsRef, newTeams);
    } catch (error) {
      console.error('Error updating teams:', error);
      throw error;
    }
  };

  const updateGameState = async (updates: Partial<GameState>) => {
    try {
      const newGameState = { ...gameState, ...updates };
      await set(gameStateRef, newGameState);
    } catch (error) {
      console.error('Error updating game state:', error);
      throw error;
    }
  };

  const addTeamMember = async (teamName: string, playerName: string) => {
    try {
      const currentTeams = [...teams];
      const teamIndex = currentTeams.findIndex(team => team.name === teamName);
      
      if (teamIndex === -1) {
        throw new Error(`Team ${teamName} not found`);
      }

      const newTeams = currentTeams.map((team, index) => {
        if (index === teamIndex) {
          return {
            ...team,
            members: [...(team.members || []), playerName]
          };
        }
        return team;
      });

      await updateTeams(newTeams);
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  };

  const removeMember = async (teamName: string, memberName: string) => {
    const currentTeams = [...teams];
    const newTeams = currentTeams.map(team =>
      team.name === teamName
        ? { ...team, members: (team.members || []).filter(member => member !== memberName) }
        : team
    );
    await updateTeams(newTeams);
  };

  const updateScore = async (teamId: number, increment: number) => {
    const currentTeams = [...teams];
    const newTeams = currentTeams.map(team =>
      team.id === teamId
        ? { ...team, score: Math.max(0, (team.score || 0) + increment) }
        : team
    );
    await updateTeams(newTeams);
  };

  const updateTeamImage = async (teamName: string, imageUrl: string) => {
    const currentTeams = [...teams];
    const newTeams = currentTeams.map(team =>
      team.name === teamName
        ? { ...team, image: imageUrl }
        : team
    );
    await updateTeams(newTeams);
  };

  const updateTeamName = async (oldName: string, newName: string) => {
    const currentTeams = [...teams];
    const newTeams = currentTeams.map(team =>
      team.name === oldName
        ? { ...team, name: newName }
        : team
    );
    await updateTeams(newTeams);
  };

  const buzz = async (teamName: string, memberName: string, timestamp: number) => {
    const currentTeams = [...teams];
    const newTeams = currentTeams.map(team => {
      if (team.name === teamName) {
        const newBuzz: BuzzInfo = { memberName, timestamp };
        return {
          ...team,
          buzzes: [...(team.buzzes || []), newBuzz]
        };
      }
      return team;
    });
    await updateTeams(newTeams);
  };

  const resetBuzzers = async () => {
    try {
      const currentTeams = [...teams];
      const newTeams = currentTeams.map(team => ({
        ...team,
        buzzes: []
      }));
      await updateTeams(newTeams);
      console.log('Buzzers reset successfully');
    } catch (error) {
      console.error('Error resetting buzzers:', error);
      throw error;
    }
  };

  const newGame = async () => {
    await updateTeams(initialTeams);
    await updateGameState(initialGameState);
  };

  const contextValue = {
    teams,
    gameState,
    addTeamMember,
    removeMember,
    updateScore,
    newGame,
    updateTeamImage,
    updateTeamName,
    updateGameState,
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
