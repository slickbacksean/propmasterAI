// services/api/socialMedia.ts
import axios from 'axios';
import { SentimentAnalysis, SocialMediaPost } from '../../types/api';

class SocialMediaService {
  private baseUrl = '/api/social';

  async getPlayerSentiment(playerName: string): Promise<SentimentAnalysis> {
    try {
      const response = await axios.get(`${this.baseUrl}/sentiment`, {
        params: { playerName }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching sentiment for ${playerName}:`, error);
      throw new Error(`Failed to fetch social media sentiment for ${playerName}`);
    }
  }

  async getRecentPosts(playerName: string, limit: number = 10): Promise<SocialMediaPost[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/posts`, {
        params: { playerName, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching social posts for ${playerName}:`, error);
      throw new Error(`Failed to fetch social media posts for ${playerName}`);
    }
  }

  async analyzeSocialTrends(sport: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/trends`, {
        params: { sport }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching social media trends for ${sport}:`, error);
      throw new Error(`Failed to fetch social media trends for ${sport}`);
    }
  }
}

export const socialMediaService = new SocialMediaService();
