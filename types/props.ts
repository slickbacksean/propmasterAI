// types/props.ts
export enum PropCategory {
  POINTS = 'points',
  REBOUNDS = 'rebounds', 
  ASSISTS = 'assists',
  THREES = 'three_pointers',
  BLOCKS = 'blocks',
  STEALS = 'steals'
}

export enum PropType {
  OVER = 'over',
  UNDER = 'under'
}

export interface Odds {
  bookmaker: string;
  propType: PropType;
  value: number;
  probability: number;
}

export interface PropBet {
  id: string;
  playerId: string;
  playerName: string;
  sport: string;
  category: PropCategory;
  value: number;
  odds: Odds[];
  timestamp: string;
  valueIndicator?: 'high' | 'medium' | 'low';
  riskScore?: number;
}

export interface CustomProp {
  id: string;
  playerIds: string[];
  categories: PropCategory[];
  combinedValue: number;
  multiplier: number;
  potentialPayout: number;
  createdAt: string;
}

export interface PropInsight {
  prop: PropBet;
  sentimentScore: number;
  trendIndicator: 'rising' | 'falling' | 'stable';
  clutchFactor: number;
  fatigueImpact: number;
  recommendedAction: 'bet' | 'avoid' | 'monitor';
}