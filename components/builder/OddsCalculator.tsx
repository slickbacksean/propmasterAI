// components/builder/OddsCalculator.tsx
import React from 'react';
import { PlayerStat } from '../../types/props';

interface OddsCalculatorProps {
  selectedStats: PlayerStat[];
  calculateProbability: (stats: PlayerStat[]) => number;
  getRecommendedOdds: (stats: PlayerStat[]) => string;
}

export const OddsCalculator: React.FC<OddsCalculatorProps> = ({ 
  selectedStats, 
  calculateProbability,
  getRecommendedOdds 
}) => {
  const probability = calculateProbability(selectedStats);
  const recommendedOdds = getRecommendedOdds(selectedStats);

  return (
    <div className="odds-calculator bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Prop Odds Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded shadow">
          <h4 className="text-sm font-medium text-gray-600">Probability</h4>
          <p className="text-2xl font-bold text-blue-600">
            {(probability * 100).toFixed(2)}%
          </p>
        </div>
        
        <div className="bg-white p-3 rounded shadow">
          <h4 className="text-sm font-medium text-gray-600">Recommended Odds</h4>
          <p className="text-2xl font-bold text-green-600">
            {recommendedOdds}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          These probabilities are dynamically calculated based on selected stats and 
          historical player performance.
        </p>
      </div>
    </div>
  );
};