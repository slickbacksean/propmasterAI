import React, { useState, useEffect } from 'react';
import { GameTracker } from '../../components/live/GameTracker';
import { LiveIndicators } from '../../components/live/LiveIndicators';
import { PropAdjuster } from '../../components/live/PropAdjuster';
import { useRealtime } from '../../hooks/useRealtime';

interface GameCenterProps {
  gameId: string;
  sport?: 'basketball' | 'football' | 'baseball';
}

const GameCenter: React.FC<GameCenterProps> = ({ 
  gameId, 
  sport = 'basketball' 
}) => {
  const { 
    gameData, 
    liveProps, 
    playerPerformance, 
    isLoading, 
    error 
  } = useRealtime(gameId, sport);

  const [activeView, setActiveView] = useState<'overview' | 'player-props' | 'advanced-tracking'>('overview');

  const viewModes = [
    { label: 'Game Overview', value: 'overview' },
    { label: 'Live Props', value: 'player-props' },
    { label: 'Advanced Tracking', value: 'advanced-tracking' }
  ];

  if (isLoading) return <div>Loading live game data...</div>;
  if (error) return <div>Error loading game: {error.message}</div>;

  return (
    <div className="live-game-center-container">
      <div className="game-header">
        <h1>
          {gameData.awayTeam} @ {gameData.homeTeam} 
          <span className="game-status">
            {gameData.currentPeriod} - {gameData.gameTime}
          </span>
        </h1>
        
        <div className="view-selector">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              className={activeView === mode.value ? 'active' : ''}
              onClick={() => setActiveView(mode.value as 'overview' | 'player-props' | 'advanced-tracking')}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="live-game-content">
        {activeView === 'overview' && (
          <div className="game-overview">
            <GameTracker 
              gameData={gameData} 
              sport={sport} 
            />
            <LiveIndicators 
              gameData={gameData} 
              playerPerformance={playerPerformance} 
            />
          </div>
        )}

        {activeView === 'player-props' && (
          <div className="live-player-props">
            <PropAdjuster 
              liveProps={liveProps} 
              gameData={gameData} 
            />
          </div>
        )}

        {activeView === 'advanced-tracking' && (
          <div className="advanced-game-tracking">
            <h2>Advanced Game Insights</h2>
            <div className="tracking-metrics">
              {playerPerformance.map((player) => (
                <div key={player.id} className="player-tracking-card">
                  <h3>{player.name}</h3>
                  <div className="performance-details">
                    <p>Current Performance Index: {player.performanceIndex}</p>
                    <p>Prop Probability Shifts: {player.propProbabilityShift}%</p>
                    <p>Fatigue Factor: {player.fatigueFactor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCenter;