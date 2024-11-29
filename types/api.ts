// types/api.ts

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
    statusCode: number;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  
  export interface RequestOptions {
    cache?: boolean;
    timeout?: number;
    headers?: Record<string, string>;
  }
  
  export interface OddsApiResponse {
    bookmaker: string;
    prop: string;
    currentOdds: number;
    openingOdds: number;
    lastUpdated: string;
  }
  
  export interface SportsDataApiConfig {
    baseUrl: string;
    apiKey: string;
    sport: string;
  }
  
  export enum ApiEndpoint {
    PROPS = '/props',
    PLAYERS = '/players',
    GAMES = '/games',
    ODDS = '/odds',
    ANALYSIS = '/analysis'
  }