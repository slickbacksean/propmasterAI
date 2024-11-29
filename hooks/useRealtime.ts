// hooks/useRealtime.ts
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ENDPOINTS } from '../config/endpoints';

export const useRealtime = (gameId: string) => {
  const [gameEvents, setGameEvents] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(ENDPOINTS.internal.baseUrl, {
      query: { gameId }
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('gameEvent', (event) => {
      setGameEvents(prev => [...prev, event]);
    });

    socket.on('error', (err) => {
      setError(err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [gameId]);

  return { gameEvents, connected, error };
};