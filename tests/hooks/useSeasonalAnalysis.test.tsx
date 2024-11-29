// src/tests/hooks/useSeasonalAnalysis.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useSeasonalAnalysis } from '../../hooks/useSeasonalAnalysis';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock the services
jest.mock('../../services/api/gameData', () => ({
  gameData: {
    getPlayersBySport: jest.fn(),
    getPlayerHistoricalData: jest.fn()
  }
}));

jest.mock('../../services/analysis/timeSeriesAnalysis', () => ({
  timeSeriesAnalysis: {
    analyzeSeries: jest.fn()
  }
}));

jest.mock('../../services/ml/trendForecaster', () => ({
  trendForecaster: {
    predictSeason: jest.fn()
  }
}));

describe('useSeasonalAnalysis Hook', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('fetches players for a given sport', async () => {
    const mockPlayers = [
      { id: '1', name: 'LeBron James', team: 'Lakers' }
    ];

    const { gameData } = require('../../services/api/gameData');
    gameData.getPlayersBySport.mockResolvedValue(mockPlayers);

    const { result, waitForNextUpdate } = renderHook(() => useSeasonalAnalysis(), { wrapper });

    const players = await act(async () => {
      return result.current.fetchSeasonalPlayers('basketball');
    });

    expect(players).toEqual(mockPlayers);
  });

  it('calculates seasonal performance for a player', async () => {
    const mockPlayer = { id: '1', name: 'LeBron James', team: 'Lakers' };
    const { gameData } = require('../../services/api/gameData');
    const { timeSeriesAnalysis } = require('../../services/analysis/timeSeriesAnalysis');
    const { trendForecaster } = require('../../services/ml/trendForecaster');

    gameData.getPlayerHistoricalData.mockResolvedValue([]);
    timeSeriesAnalysis.analyzeSeries.mockResolvedValue({ trend: 0.5 });
    trendForecaster.predictSeason.mockResolvedValue({
      totalProjectedPoints: 250.5,
      monthlyProjections: [22.3, 24.1],
      confidence: 0.85
    });

    const { result, waitForNextUpdate } = renderHook(() => useSeasonalAnalysis(), { wrapper });

    const performance = await act(async () => {
      return result.current.calculateSeasonalPerformance(mockPlayer, 'basketball');
    });

    expect(performance).toEqual(expect.objectContaining({
      projectedPoints: 250.5,
      performanceTrend: 0.5,
      monthlyBreakdown: expect.any(Array)
    }));
  });
});