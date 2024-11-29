import React, { useState, useEffect } from 'react';
import { ClutchMeter } from '../../components/analysis/ClutchMeter';
import { useClutchAnalysis } from '../../hooks/useClutchAnalysis';
import { Player, ClutchPerformanceData } from '../../types/players';

const ClutchPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>('basketball');
  const [players, setPlayers] = useState<Player[]>([]);
  const [clutchData, setClutchData] = useState<ClutchPerformanceData[]>([]);

  const { fetchClutchPlayers, calculateClutchPerformance } = useClutchAnalysis();

  useEffect(() => {
    const loadClutchPlayers = async () => {
      try {
        const fetchedPlayers = await fetchClutchPlayers(selectedSport);
        setPlayers(fetchedPlayers);
        
        const performanceData = await Promise.all(
          fetchedPlayers.map(player => 
            calculateClutchPerformance(player, selectedSport)
          )
        );
        
        setClutchData(performanceData);
      } catch (error) {
        console.error('Error loading clutch players:', error);
      }
    };

    loadClutchPlayers();
  }, [selectedSport, fetchClutchPlayers, calculateClutchPerformance]);

  const sportOptions = ['basketball', 'football', 'baseball', 'soccer'];

  const sortedClutchData = [...clutchData].sort((a, b) => 
    b.clutchScore - a.clutchScore
  );

  return (
    <div className="clutch-performance-container">
      <h1 className="text-2xl font-bold mb-6">Clutch Performance Predictor</h1>

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
        <div className="top-clutch-players">
          <h2 className="text-xl font-semibold mb-4">Top Clutch Performers</h2>
          <div className="max-h-[600px] overflow-y-auto">
            {sortedClutchData.map((data, index) => (
              <div 
                key={data.player.id} 
                className="mb-4 p-4 bg-gray-50 rounded flex items-center"
              >
                <span className="mr-4 font-bold">{index + 1}</span>
                <div className="flex-grow">
                  <p className="font-semibold">{data.player.name}</p>
                  <p className="text-sm text-gray-600">{data.player.team}</p>
                </div>
                <ClutchMeter 
                  score={data.clutchScore} 
                  detailed={false} 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="clutch-analysis-details">
          <h2 className="text-xl font-semibold mb-4">Clutch Performance Insights</h2>
          {clutchData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Overall Clutch Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Average Clutch Score</p>
                  <p className="text-2xl font-bold">
                    {(clutchData.reduce((sum, data) => sum + data.clutchScore, 0) / clutchData.length).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Top Performer</p>
                  <p className="text-xl font-semibold">
                    {sortedClutchData[0].player.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClutchPage;