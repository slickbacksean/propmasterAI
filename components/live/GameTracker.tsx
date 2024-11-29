import React, { useState, useEffect } from 'react';

interface GameData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  status: 'not-started' | 'in-progress' | 'halftime' | 'completed';
}

interface GameTrackerProps {
  gameId: string;
  onGameUpdate?: (gameData: GameData) => void;
}

const GameTracker: React.FC<GameTrackerProps> = ({ gameId, onGameUpdate }) => {
  const [gameData, setGameData] = useState<GameData>({
    id: gameId,
    homeTeam: 'Home',
    awayTeam: 'Away',
    homeScore: 0,
    awayScore: 0,
    quarter: 1,
    timeRemaining: '12:00',
    status: 'not-started'
  });

  useEffect(() => {
    // Simulated game data update
    const intervalId = setInterval(() => {
      const updatedGameData: GameData = {
        ...gameData,
        homeScore: Math.floor(Math.random() * 10),
        awayScore: Math.floor(Math.random() * 10),
        timeRemaining: `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      };
      
      setGameData(updatedGameData);
      onGameUpdate && onGameUpdate(updatedGameData);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [gameId, onGameUpdate]);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">{gameData.homeTeam} vs {gameData.awayTeam}</div>
        <div className="text-sm text-gray-600">Q{gameData.quarter} - {gameData.timeRemaining}</div>
      </div>
      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-lg font-semibold">{gameData.homeTeam}</div>
          <div className="text-2xl font-bold">{gameData.homeScore}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{gameData.awayTeam}</div>
          <div className="text-2xl font-bold">{gameData.awayScore}</div>
        </div>
      </div>
    </div>
  );
};

export default GameTracker;