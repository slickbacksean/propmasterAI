import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertCircle, Filter } from 'lucide-react';

import ValueIndicator from '@/components/insights/ValueIndicator';
import PropsList from '@/components/insights/PropsList';
import Riskometer from '@/components/insights/Riskometer';
import TrendLine from '@/components/common/charts/TrendLine';

interface Prop {
  id: string;
  player: string;
  sport: string;
  category: string;
  currentOdds: number;
  expectedValue: number;
  riskScore: number;
  trendData: Array<{ name: string; value: number }>;
}

const InsightsExplorer: React.FC = () => {
  const [filters, setFilters] = useState({
    sport: 'all',
    category: 'all',
    minValue: 0,
    maxRisk: 100
  });

  // Mock data - in real app, this would come from an API
  const propsData: Prop[] = [
    {
      id: '1',
      player: 'LeBron James',
      sport: 'Basketball',
      category: 'Points',
      currentOdds: 28.5,
      expectedValue: 30.2,
      riskScore: 45,
      trendData: [
        { name: 'Last 5 Games', value: 28.3 },
        { name: 'Season Avg', value: 27.9 },
        { name: 'Home Games', value: 29.1 }
      ]
    },
    // Add more props...
  ];

  const filteredProps = useMemo(() => {
    return propsData.filter(prop => 
      (filters.sport === 'all' || prop.sport === filters.sport) &&
      (filters.category === 'all' || prop.category === filters.category) &&
      prop.expectedValue >= filters.minValue &&
      prop.riskScore <= filters.maxRisk
    );
  }, [propsData, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <TrendingUp className="mr-3 text-blue-600" />
            Insights Explorer
          </h1>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Filter className="mr-2" /> Filters
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Discover undervalued and high-potential prop bets across sports
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PropsList 
            props={filteredProps} 
            renderProp={(prop) => (
              <div key={prop.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{prop.player} - {prop.category}</h3>
                  <ValueIndicator value={prop.expectedValue} />
                </div>
                <div className="mt-4">
                  <TrendLine 
                    data={prop.trendData}
                    lines={[
                      { 
                        dataKey: 'value', 
                        stroke: '#3182CE',
                        name: prop.category 
                      }
                    ]}
                  />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Riskometer risk={prop.riskScore} />
                  <span className="text-gray-600">Odds: {prop.currentOdds}</span>
                </div>
              </div>
            )}
          />
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <AlertCircle className="mr-2 text-yellow-500" />
              Insights Summary
            </h2>
            {/* Add summary statistics, top picks, etc. */}
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Total Props Analyzed</span>
                <span className="font-bold">{filteredProps.length}</span>
              </li>
              {/* More summary items */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsExplorer;