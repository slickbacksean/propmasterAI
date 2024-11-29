import React, { useState, useEffect } from 'react';
import { SeasonTracker } from '../../components/analysis/SeasonTracker';
import { useSeasonalAnalysis } from '../../hooks/useSeasonalAnalysis';
import { Player, SeasonalPerformanceData } from '../../types/players';

const SeasonPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>('basketball');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [seasonalData, setSeasonalData] = useState<SeasonalPerformanceData | null>(null);

  const { fetchSeasonalPlayers, calculateSeasonalPerformance } = useSeasonalAnalysis();

  useEffect(() => {
    const loadSeasonalPlayers = async () => {
      try {
        const fetchedPlayers = await fetchSeasonalPlayers(selectedSport);
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error('Error loading seasonal players:', error);
      }
    };

    loadSeasonalPlayers();
  }, [selectedSport, fetchSeasonalPlayers]);

  const handlePlayerSelect = async (player: Player) => {
    setSelectedPlayer(player);
    
    try {
      const performance = await calculateSeasonalPerformance(player, selectedSport);
      setSeasonalData(performance);
    } catch (error) {
      console.error('Error calculating seasonal performance:', error);
    }
  };

  const sportOptions = ['basketball', 'football', 'baseball', 'soccer'];

  return (
    <div className="seasonal-performance-container">
      <h1 className="text-2xl font-bold mb-6">Seasonal Prop Predictor</h1>

      <div className="sport-selector mb-6">
        <label className="block mb-2 font-semibold">Select Sport:</label>
        <div className="flex space-x-4">
          {sportOptions.map(sport => (
            <button
              key={sport}
              className={`px-4 py-2 rounded ${
                selectedSport === sport 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedSport(sport)}
            >
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="player-selector">
          <h2 className="text-xl font-semibold mb-4">Select Player</h2>
          <input 
            type="text" 
            placeholder="Search players..." 
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => {
              // Implement player search/filter logic
              const searchTerm = e.target.value.toLowerCase();
              const filteredPlayers = players.filter(player => 
                player.name.toLowerCase().includes(searchTerm)
              );
              // Potentially set filtered players state
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
                {player.name} - {player.team}
              </div>
            ))}
          </div>
        </div>

        <div className="seasonal-analysis">
          {selectedPlayer && seasonalData ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Seasonal Performance: {selectedPlayer.name}
              </h2>
              
              <SeasonTracker 
                player={selectedPlayer}
                seasonalData={seasonalData}
              />

              <div className="performance-summary mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-bold mb-2">Season Projection</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Projected Total Points</p>
                    <p className="text-2xl font-bold">
                      {seasonalData.projectedPoints.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Performance Trend</p>
                    <p className={`font-semibold ${
                      seasonalData.performanceTrend > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {seasonalData.performanceTrend > 0 ? '▲ Improving' : '▼ Declining'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="monthly-breakdown mt-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  {seasonalData.monthlyBreakdown.map((month, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-white border rounded text-center"
                    >
                      <p className="font-bold">{month.name}</p>
                      <p className="text-sm text-gray-600">
                        {month.averagePerformance.toFixed(1)} pts
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>Select a player to view seasonal performance analysis</p>
            </div>
          )}
        </div>
      </div>

      <div className="league-insights mt-8">
        <h3 className="text-lg font-semibold mb-4">League-Wide Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-bold mb-2">Top Performers</h4>
            {/* Placeholder for top performers */}
            <ul>
              <li>Player A</li>
              <li>Player B</li>
              <li>Player C</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-bold mb-2">Emerging Talents</h4>
            {/* Placeholder for emerging talents */}
            <ul>
              <li>Rookie X</li>
              <li>Young Player Y</li>
              <li>Rising Star Z</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-bold mb-2">Season Predictions</h4>
            {/* Placeholder for season-wide predictions */}
            <p>Expected League MVP</p>
            <p>Potential Breakout Players</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonPage;