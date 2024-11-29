// components/builder/CustomPropCard.tsx
import React from 'react';
import { PropBet } from '../../types/props';

interface CustomPropCardProps {
  prop: PropBet;
}

export const CustomPropCard: React.FC<CustomPropCardProps> = ({ prop }) => {
  return (
    <div className="custom-prop-card bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Your Custom Prop</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Selected Stats:</span>
          <div>
            {prop.stats.map((stat, index) => (
              <span 
                key={index} 
                className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                {stat.category}: {stat.value}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between border-t pt-3">
          <span className="font-medium">Probability:</span>
          <span className="text-green-600 font-bold">
            {(prop.probability * 100).toFixed(2)}%
          </span>
        </div>
        
        <div className="flex justify-between border-t pt-3">
          <span className="font-medium">Recommended Odds:</span>
          <span className="text-blue-600 font-bold">
            {prop.recommendedOdds}
          </span>
        </div>
      </div>

      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Save Prop
      </button>
    </div>
  );
};