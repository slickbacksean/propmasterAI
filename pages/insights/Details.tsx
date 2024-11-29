import React, { useState } from 'react';
import { 
  User, 
  TrendingUp, 
  BarChart2, 
  Clock, 
  Star 
} from 'lucide-react';

import PerformanceGraph from '@/components/common/charts/PerformanceGraph';
import CorrelationMatrix from '@/components/common/charts/CorrelationMatrix';

interface PlayerStats {
  name: string;
  sport: string;
  position: string;
  team: string;
  recentForm: number[];
  historicalPerformance: Array<{
    name: string;
    actual: number;
    expected: number;
  }>;
}

const PropDetails: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'performance' | 'correlations'>('performance');

  // Mock data - replace with actual API call
  const playerStats: PlayerStats = {
    name: 'LeBron James',
    sport: 'Basketball',
    position: 'Forward',
    team: 'Los Angeles Lakers',
    recentForm: [28.5, 27.8, 30.2, 26.9, 29.1],
    historicalPerformance: [
      { name: 'Points', actual: 28.3, expected: 27.5 },
      { name: 'Assists', actual: 7.2, expected: 6.8 },
      { name: 'Rebounds', actual: 8.1, expected: 7.9 }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <User className="mr-3 text-blue-600" />
            {playerStats.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {playerStats.position} | {playerStats.team} | {playerStats.sport}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedView('performance')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              selectedView === 'performance' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <BarChart2 className="mr-2" /> Performance
          </button>
          <button 
            onClick={() => setSelectedView('correlations')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              selectedView === 'correlations' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <TrendingUp className="mr-2" /> Correlations
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {selectedView === 'performance' ? (
            <PerformanceGraph 
              data={playerStats.historicalPerformance}
              title="Performance Metrics Comparison"
            />
          ) : (
            <CorrelationMatrix 
              data={[
                { 
                  x: 'Points', 
                  Points: 1, 
                  Assists: 0.6, 
                  Rebounds: 0.4 
                },
                { 
                  x: 'Assists', 
                  Points: 0.6, 
                  Assists: 1, 
                  Rebounds: 0.3 
                },
                { 
                  x: 'Rebounds', 
                  Points: 0.4, 
                  Assists: 0.3, 
                  Rebounds: 1 
                }
              ]}
              xAxis={['Points', 'Assists', 'Rebounds']}
              title="Stat Correlations"
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2 text-green-500" />
              Recent Form
            </h2>
            <div className="flex justify-between">
              {playerStats.recentForm.map((score, index) => (
                <div 
                  key={index} 
                  className="text-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Game {index + 1}
                  </span>
                  <div className="font-bold text-lg">{score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Star className="mr-2 text-yellow-500" />
              Key Insights
            </h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Season Average</span>
                <span className="font-bold">28.7</span>
              </li>
              <li className="flex justify-between">
                <span>Home Performance</span>
                <span className="font-bold">29.5</span>
              </li>
              <li className="flex justify-between">
                <span>Away Performance</span>
                <span className="font-bold">27.9</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropDetails;