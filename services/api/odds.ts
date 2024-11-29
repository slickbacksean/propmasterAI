// src/services/api/odds.ts
import axios from 'axios';
import { Sport, SportMarket } from '../../types/sports';
import { API_CONFIG } from '../../config/api';

export interface Odds {
  sportId: string;
  gameId: string;
  markets: {
    [marketType: string]: {
      home: number;
      away: number;
    }
  };
}

export class OptiOddsService {
  private static BASE_URL = 'https://api.prop-odds.com/beta';
  private static API_KEY = process.env.PROPODDS_API_KEY;

  static async fetchSports(): Promise<Sport[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/sports`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  }

  static async fetchLiveOdds(sport?: string): Promise<Odds[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/odds`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        params: {
          sport: sport,
          status: 'live'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching live odds:', error);
      throw error;
    }
  }

  static async getOddsForGame(gameId: string): Promise<Odds> {
    try {
      const response = await axios.get(`${this.BASE_URL}/odds/${gameId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching odds for game ${gameId}:`, error);
      throw error;
    }
  }

  static getSupportedSports(): string[] {
    return [
      'basketball', 
      'football', 
      'baseball', 
      'hockey', 
      'soccer', 
      'tennis', 
      'golf', 
      'mma', 
      'boxing'
    ];
  }

  static getMarketsForSport(sportId: string): SportMarket[] {
    // This would ideally come from the API, but we'll use the provided data
    const sports = JSON.parse(process.env.SPORTS_DATA || '[]');
    const sport = sports.find((s: Sport) => s.id === sportId);
    return sport ? sport.main_markets : [];
  }
}