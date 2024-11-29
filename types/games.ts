// types/games.ts

export enum GameStatus {
    SCHEDULED = 'scheduled',
    LIVE = 'live',
    COMPLETED = 'completed',
    POSTPONED = 'postponed',
    CANCELLED = 'cancelled'
  }
  
  export enum GameType {
    REGULAR_SEASON = 'regular_season',
    PLAYOFFS = 'playoffs',
    ALL_STAR = 'all_star'
  }
  
  export interface GameLocation {
    venue: string;
    city: string;
    state: string;
    country: string;
  }
  
  export interface Team {
    id: string;
    name: string;
    abbreviation: string;
    conference: 'Eastern' | 'Western';
  }
  
  export interface GameEvent {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    date: string;
    time: string;
    status: GameStatus;
    gameType: GameType;
    location: GameLocation;
    currentScore?: {
      homeTeam: number;
      awayTeam: number;
    };
  }
  
  export interface LiveGameContext {
    gameId: string;
    quarter: number;
    timeRemaining: string;
    possessionTeam: Team;
    gameEvents: {
      type: 'shot' | 'turnover' | 'foul' | 'substitution';
      timestamp: string;
      player: string;
    }[];
  }