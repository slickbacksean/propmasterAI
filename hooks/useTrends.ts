// hooks/useTrends.ts
import { useState, useEffect } from 'react';
import { trendForecaster } from '../services/ml/trendForecaster';
import { TrendAnalysisResult } from '../types/analysis';

export const useTrends = (playerId: string, prop: string) => {
  const [trends, setTrends] = useState<TrendAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeTrends = async () => {
      try {
        setLoading(true);
        const trendData = await trendForecaster.predictTrends(playerId, prop);
        setTrends(trendData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Trend analysis failed');
      } finally {
        setLoading(false);
      }
    };

    analyzeTrends();
  }, [playerId, prop]);

  return { trends, loading, error };
};