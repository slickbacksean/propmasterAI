// src/types/sports.ts
export interface SportMarket {
    id: string;
    name: string;
    numerical_id: number;
  }
  
  export interface Sport {
    id: string;
    name: string;
    main_markets: SportMarket[];
  }
  
  export const SPORT_CATEGORIES = [
    'Basketball', 
    'Football', 
    'Baseball', 
    'Hockey', 
    'Soccer', 
    'Tennis', 
    'Golf', 
    'MMA', 
    'Boxing'
  ];
  
  export const MARKET_TYPES = {
    MONEYLINE: 'moneyline',
    POINT_SPREAD: 'point_spread',
    TOTAL_POINTS: 'total_points',
    RUN_LINE: 'run_line',
    TOTAL_RUNS: 'total_runs',
    PUCK_LINE: 'puck_line',
    TOTAL_GOALS: 'total_goals'
  };