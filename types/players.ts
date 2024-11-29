// types/players.ts

export enum PlayerPosition {
    POINT_GUARD = 'PG',
    SHOOTING_GUARD = 'SG',
    SMALL_FORWARD = 'SF', 
    POWER_FORWARD = 'PF',
    CENTER = 'C'
  }
  
  export interface PlayerStats {
    gamesPlayed: number;
    pointsPerGame: number;
    reboundsPerGame: number;
    assistsPerGame: number;
    stealsPerGame: number;
    blocksPerGame: number;
    fieldGoalPercentage: number;
    threePointPercentage: number;
    minutesPerGame: number;
  }
  
  export interface PlayerProfile {
    id: string;
    name: string;
    team: string;
    position: PlayerPosition;
    height: string;
    weight: number;
    age: number;
    jerseyNumber: number;
    currentStats: PlayerStats;
    seasonStats: PlayerStats;
    careerStats: PlayerStats;
  }
  
  export interface PlayerFatigue {
    restDays: number;
    gamesInLastWeek: number;
    minutesPlayedRecently: number;
    fatigueScore: number;
    recommendedMinutes?: number;
  }
  
  export interface PlayerClutchPerformance {
    lastQuarterPerformance: PlayerStats;
    clutchShotsMade: number;
    clutchShotAttempts: number;
    clutchScore: number;
  }