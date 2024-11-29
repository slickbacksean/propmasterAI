// src/contexts/OddsContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Sport, SportMarket } from '../types/sports';
import { Odds, OptiOddsService } from '../services/api/odds';

interface OddsContextType {
  sports: Sport[];
  liveOdds: Odds[];
  supportedSports: string[];
  fetchSports: () => Promise<void>;
  refreshLiveOdds: (sport?: string) => Promise<void>;
  getOddsForGame: (gameId: string) => Promise<Odds>;
  getMarketsForSport: (sportId: string) => SportMarket[];
}

const OddsContext = createContext<OddsContextType | undefined>(undefined);

export const OddsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [liveOdds, setLiveOdds] = useState<Odds[]>([]);

  const fetchSports = async () => {
    try {
      const fetchedSports = await OptiOddsService.fetchSports();
      setSports(fetchedSports);
    } catch (error) {
      console.error('Failed to fetch sports:', error);
    }
  };

  const refreshLiveOdds = async (sport?: string) => {
    try {
      const odds = await OptiOddsService.fetchLiveOdds(sport);
      setLiveOdds(odds);
    } catch (error) {
      console.error('Failed to refresh live odds:', error);
    }
  };

  const getOddsForGame = async (gameId: string) => {
    return await OptiOddsService.getOddsForGame(gameId);
  };

  const getMarketsForSport = (sportId: string) => {
    return OptiOddsService.getMarketsForSport(sportId);
  };

  useEffect(() => {
    fetchSports();
    refreshLiveOdds();

    // Set up periodic refresh
    const sportsInterval = setInterval(fetchSports, 24 * 60 * 60 * 1000); // Daily
    const oddsInterval = setInterval(() => refreshLiveOdds(), 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(sportsInterval);
      clearInterval(oddsInterval);
    };
  }, []);

  return (
    <OddsContext.Provider value={{
      sports,
      liveOdds,
      supportedSports: OptiOddsService.getSupportedSports(),
      fetchSports,
      refreshLiveOdds,
      getOddsForGame,
      getMarketsForSport
    }}>
      {children}
    </OddsContext.Provider>
  );
};

export const useOddsContext = () => {
  const context = useContext(OddsContext);
  if (context === undefined) {
    throw new Error('useOddsContext must be used within an OddsProvider');
  }
  return context;
};