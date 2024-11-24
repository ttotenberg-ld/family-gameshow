export interface Team {
  id: number;
  name: string;
  color: string;
  members: string[];
  score: number;
  image: string;
  theme: {
    primary: string;
    secondary: string;
    text: string;
    border: string;
    hover: string;
  };
  buzzerTimestamp?: number;
  buzzedInMember?: string;
}

export type WebSocketMessage = 
  | { type: 'init'; teams: Team[] }
  | { type: 'update'; teams: Team[] }
  | { type: 'addMember'; teamName: string; playerName: string }
  | { type: 'removeMember'; teamName: string; memberName: string }
  | { type: 'updateScore'; teamId: number; increment: number }
  | { type: 'newGame' }
  | { type: 'buzz'; teamName: string; memberName: string; timestamp: number }
  | { type: 'updateTeamImage'; teamName: string; imageUrl: string }
  | { type: 'resetBuzzers' };
