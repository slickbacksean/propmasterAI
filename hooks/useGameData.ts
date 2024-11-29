// hooks/useGameData.ts
import { useState, useEffect } from 'react';
import { gameData } from '../services/api/gameData';
import { GameType, PlayerGameStats } from '../types/games';

export const useGameData = (gameId: string, playerId?: string) => {
  const [data, setData] = useState<PlayerGameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const gameStats = await gameData.getPlayerGameStats(gameId, playerId);
        setData(gameStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId, playerId]);

  return { data, loading, error };
};