// contexts/AnalyticsContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { 
  fetchTrendAnalysis, 
  fetchCorrelationAnalysis 
} from '../services/analysis/statisticalAnalysis';

interface AnalyticsContextType {
  trendAnalysis: any[];
  correlationAnalysis: any[];
  isLoading: boolean;
  error: string | null;
  fetchTrends: (player: string) => Promise<void>;
  fetchCorrelations: (player: string) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trendAnalysis, setTrendAnalysis] = useState<any[]>([]);
  const [correlationAnalysis, setCorrelationAnalysis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async (player: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const trends = await fetchTrendAnalysis(player);
      setTrendAnalysis(trends);
    } catch (err) {
      setError('Failed to fetch trend analysis');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCorrelations = async (player: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const correlations = await fetchCorrelationAnalysis(player);
      setCorrelationAnalysis(correlations);
    } catch (err) {
      setError('Failed to fetch correlation analysis');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnalyticsContext.Provider value={{
      trendAnalysis,
      correlationAnalysis,
      isLoading,
      error,
      fetchTrends,
      fetchCorrelations
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
