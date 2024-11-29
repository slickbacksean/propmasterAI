// contexts/GameContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { GameData, LiveGameUpdate } from '../types/games';
import { fetchLiveGameData } from '../services/api/gameData';

interface GameContextType {
  currentGames: GameData[];
  liveUpdates: Record<string, LiveGameUpdate>;
  isLoading: boolean;
  error: string | null;
  refreshGameData: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGames, setCurrentGames] = useState<GameData[]>([]);
  const [liveUpdates, setLiveUpdates] = useState<Record<string, LiveGameUpdate>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGameData = async () => {
    try {
      setIsLoading(true);
      const games = await fetchLiveGameData();
      setCurrentGames(games);
      
      // Initialize live updates for each game
      const initialLiveUpdates = games.reduce((acc, game) => ({
        ...acc,
        [game.gameId]: {
          gameId: game.gameId,
          quarter: game.currentQuarter,
          timeRemaining: game.timeRemaining,
          homeScore: game.homeScore,
          awayScore: game.awayScore
        }
      }), {});

      setLiveUpdates(initialLiveUpdates);
      setError(null);
    } catch (err) {
      setError('Failed to fetch game data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
    
    // Set up periodic refresh
    const intervalId = setInterval(fetchGameData, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <GameContext.Provider value={{
      currentGames,
      liveUpdates,
      isLoading,
      error,
      refreshGameData: fetchGameData
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};