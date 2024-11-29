import { useState, useCallback } from 'react';
import { Player, SeasonalPerformanceData } from '../types/players';
import { gameData } from '../services/api/gameData';
import { timeSeriesAnalysis } from '../services/analysis/timeSeriesAnalysis';
import { trendForecaster } from '../services/ml/trendForecaster';

export const useSeasonalAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasonalPlayers = useCallback(async (sport: string): Promise<Player[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const players = await gameData.getPlayersBySport(sport);
      return players;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch players';
      setError(errorMessage);
      console.error('Seasonal Players Fetch Error:', errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateSeasonalPerformance = useCallback(async (
    player: Player, 
    sport: string
  ): Promise<SeasonalPerformanceData> => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch historical performance data
      const historicalData = await gameData.getPlayerHistoricalData(player.id, sport);

      // Analyze time series data
      const timeSeriesAnalysis = await timeSeriesAnalysis.analyzeSeries(historicalData);

      // Generate seasonal forecast
      const forecast = await trendForecaster.predictSeason(historicalData);

      // Calculate monthly breakdown
      const monthlyBreakdown = forecast.monthlyProjections.map((projection, index) => ({
        name: new Date(2024, index, 1).toLocaleString('default', { month: 'short' }),
        averagePerformance: projection
      }));

      return {
        projectedPoints: forecast.totalProjectedPoints,
        performanceTrend: timeSeriesAnalysis.trend,
        monthlyBreakdown,
        seasonalConsistency: timeSeriesAnalysis.consistency,
        predictiveConfidence: forecast.confidence
      };
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to calculate seasonal performance';
      
      setError(errorMessage);
      console.error('Seasonal Performance Calculation Error:', errorMessage);
      
      // Return a default/fallback performance object
      return {
        projectedPoints: 0,
        performanceTrend: 0,
        monthlyBreakdown: [],
        seasonalConsistency: 0,
        predictiveConfidence: 0
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchSeasonalPlayers,
    calculateSeasonalPerformance,
    isLoading,
    error
  };
};