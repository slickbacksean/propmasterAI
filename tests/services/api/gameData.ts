// src/tests/services/api/gameData.test.ts
import { gameData } from '../../../services/api/gameData';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Game Data API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlayersBySport', () => {
    it('successfully fetches players for a sport', async () => {
      const mockPlayers = [
        { id: '1', name: 'LeBron James', sport: 'basketball' },
        { id: '2', name: 'Stephen Curry', sport: 'basketball' }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockPlayers });

      const result = await gameData.getPlayersBySport('basketball');
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/players/basketball');
      expect(result).toEqual(mockPlayers);
    });

    it('handles errors when fetching players', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(gameData.getPlayersBySport('basketball'))
        .rejects
        .toThrow('Network error');
    });
  });

  describe('getPlayerHistoricalData', () => {
    it('fetches historical performance data for a player', async () => {
      const mockHistoricalData = {
        playerId: '1',
        performances: [
          { date: '2024-01-01', points: 25.5 },
          { date: '2024-01-15', points: 28.3 }
        ]
      };

      mockedAxios.get.mockResolvedValue({ data: mockHistoricalData });

      const result = await gameData.getPlayerHistoricalData('1', 'basketball');
      
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/players/1/historical-data');
      expect(result).toEqual(mockHistoricalData);
    });
  });
});