import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SeasonData {
  month: string;
  performance: number;
  projection?: number;
  average: number;
}

interface SeasonTrackerProps {
  playerName: string;
  seasonData: SeasonData[];
}

const SeasonTracker: React.FC<SeasonTrackerProps> = ({ 
  playerName, 
  seasonData 
}) => {
  const calculateSeasonSummary = () => {
    const performances = seasonData.map(data => data.performance);
    return {
      currentAverage: performances[performances.length - 1],
      seasonHigh: Math.max(...performances),
      seasonLow: Math.min(...performances)
    };
  };

  const seasonSummary = calculateSeasonSummary();

  return (
    <div className="season-tracker p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{playerName} - Season Performance</h2>
        <div className="flex space-x-4">
          <div className="text-center">
            <span className="text-sm text-gray-600">Current Avg</span>
            <div className="text-lg font-bold">
              {seasonSummary.currentAverage.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">Season High</span>
            <div className="text-lg font-bold text-green-600">
              {seasonSummary.seasonHigh.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">Season Low</span>
            <div className="text-lg font-bold text-red-600">
              {seasonSummary.seasonLow.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={seasonData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="performance" 
            stroke="#8884d8" 
            name="Actual Performance" 
          />
          <Line 
            type="monotone" 
            dataKey="projection" 
            stroke="#82ca9d" 
            strokeDasharray="5 5" 
            name="Projection" 
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#ff7300" 
            name="Season Average" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeasonTracker;