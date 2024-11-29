import React, { useState, useEffect } from 'react';
import { FatigueIndicator } from '../../components/analysis/FatigueIndicator';
import { useFatigueModel } from '../../hooks/useFatigueModel';
import { Player, FatigueData } from '../../types/players';

const FatiguePage: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [fatigueData, setFatigueData] = useState<FatigueData | null>(null);

  const { fetchPlayers, calculateFatigue } = useFatigueModel();

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const fetchedPlayers = await fetchPlayers();
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error('Error loading players:', error);
      }
    };

    loadPlayers();
  }, [fetchPlayers]);

  const handlePlayerSelect = async (player: Player) => {
    setSelectedPlayer(player);
    
    try {
      const fatigue = await calculateFatigue(player);
      setFatigueData(fatigue);
    } catch (error) {
      console.error('Error calculating fatigue:', error);
    }
  };

  return (
    <div className="fatigue-analysis-container">
      <h1 className="text-2xl font-bold mb-6">Player Fatigue Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="player-selector">
          <h2 className="text-xl font-semibold mb-4">Select Player</h2>
          <input 
            type="text" 
            placeholder="Search players..." 
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => {
              // Implement player search/filter logic
            }}
          />
          <div className="player-list max-h-96 overflow-y-auto">
            {players.map(player => (
              <div 
                key={player.id}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedPlayer?.id === player.id ? 'bg-blue-100' : ''
                }`}
                onClick={() => handlePlayerSelect(player)}
              >
                {player.name}
              </div>
            ))}
          </div>
        </div>

        <div className="fatigue-analysis">
          {selectedPlayer && fatigueData ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Fatigue Analysis for {selectedPlayer.name}
              </h2>
              <FatigueIndicator 
                player={selectedPlayer} 
                fatigueData={fatigueData} 
              />
              <div className="fatigue-details mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-bold mb-2">Fatigue Insights</h3>
                <ul>
                  <li>Rest Days: {fatigueData.restDays}</li>
                  <li>Performance Decline: {fatigueData.performanceDecline}%</li>
                  <li>Predicted Impact: {fatigueData.predictedImpact}</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>Select a player to view fatigue analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FatiguePage;