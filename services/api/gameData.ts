// services/api/gameData.ts
import axios from 'axios';
import { GameData, LiveGameUpdate, PlayerGameStats } from '../../types/games';

class GameDataService {
  private baseUrl = 'https://api.prop-odds.com/beta';
  private apiKey = process.env.PROPODDS_API_KEY;

  private async makeRequest<T>(endpoint: string, params: object = {}): Promise<T> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          ...params,
          api_key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
  }

  async fetchLiveGames(sport: string = 'nhl'): Promise<GameData[]> {
    const currentDate = new Date().toISOString().split('T')[0];
    return this.makeRequest<GameData[]>(`/games/${sport}`, { date: currentDate });
  }

  async getGameDetails(gameId: string): Promise<GameData> {
    return this.makeRequest<GameData>(`/game/${gameId}`);
  }

  async getAvailableMarkets(gameId: string): Promise<string[]> {
    return this.makeRequest<string[]>(`/markets/${gameId}`);
  }

  async getOddsForMarket(gameId: string, marketKey: string): Promise<any> {
    return this.makeRequest<any>(`/odds/${gameId}/${marketKey}`);
  }

  // Note: The following methods may not have direct equivalents in the provided API.
  // They are kept for reference, but may need to be removed or significantly modified.

  async getLiveGameUpdates(gameId: string): Promise<LiveGameUpdate> {
    console.warn('getLiveGameUpdates method may not be supported by the current API');
    return this.makeRequest<LiveGameUpdate>(`/game/${gameId}`);
  }

  async getPlayerGameStats(gameId: string, playerId: string): Promise<PlayerGameStats> {
    console.warn('getPlayerGameStats method may not be supported by the current API');
    return this.makeRequest<PlayerGameStats>(`/game/${gameId}`);
  }
}

export const gameDataService = new GameDataService();
