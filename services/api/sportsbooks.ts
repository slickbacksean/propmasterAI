// services/api/sportsbooks.ts
import axios from 'axios';
import { SportsbookOdds, PropOdds } from '../../types/api';

class SportsbookService {
  private baseUrl = 'https://api.prop-odds.com/beta';

  async getAllSportsbookOdds(gameId?: string): Promise<SportsbookOdds[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/odds`, {
        params: { gameId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sportsbook odds:', error);
      throw new Error('Failed to fetch sportsbook odds');
    }
  }

  async getComparativeOdds(playerName: string, statCategory: string): Promise<PropOdds> {
    try {
      const response = await axios.get(`${this.baseUrl}/comparative-odds`, {
        params: { playerName, statCategory }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching comparative odds:', error);
      throw new Error('Failed to fetch comparative odds');
    }
  }

  async getArbitragePotential(playerProps: string[]): Promise<number> {
    try {
      const response = await axios.post(`${this.baseUrl}/arbitrage`, { playerProps });
      return response.data.arbitragePotential;
    } catch (error) {
      console.error('Error calculating arbitrage potential:', error);
      throw new Error('Failed to calculate arbitrage potential');
    }
  }
}

export const sportsbookService = new SportsbookService();
