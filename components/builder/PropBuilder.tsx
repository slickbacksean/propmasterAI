// components/builder/PropBuilder.tsx
import React, { useState, useMemo } from 'react';
import { StatSelector } from './StatSelector';
import { OddsCalculator } from './OddsCalculator';
import { CustomPropCard } from './CustomPropCard';
import { usePropBuilder } from '../../hooks/usePropBuilder';
import { PropBet } from '../../types/props';

export const PropBuilder: React.FC = () => {
  // Remove the destructuring that was causing errors
  const propBuilder = usePropBuilder();

  const [customProp, setCustomProp] = useState<PropBet | null>(null);

  const handleCreateProp = () => {
    if (propBuilder.customProps.length > 0) {
      const newProp: PropBet = {
        // Remove 'stats' property if it's not in the PropBet type
        probability: propBuilder.createCustomProp(
          // You'll need to provide these parameters
          "", // playerId
          "", // playerName
          []  // options
        ).probability,
        recommendedOdds: 1.5 // You might want to implement this calculation
      };
      setCustomProp(newProp);
    }
  };

  return (
    <div className="prop-builder p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Custom Prop Builder</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <StatSelector 
            // Remove methods that don't exist on propBuilder
            onStatSelect={(stat) => {
              // Implement stat selection logic
            }} 
            onStatRemove={(stat) => {
              // Implement stat removal logic
            }}
            selectedStats={[]} // Provide an empty array or implement selection
          />
          <button 
            onClick={handleCreateProp}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={propBuilder.customProps.length === 0}
          >
            Create Custom Prop
          </button>
        </div>
        
        <div>
          <OddsCalculator 
            selectedStats={[]} // Provide an empty array or implement selection
            calculateProbability={() => 0} // Provide a default implementation
            getRecommendedOdds={() => 1.5} // Provide a default implementation
          />
        </div>
      </div>

      {customProp && (
        <div className="mt-6">
          <CustomPropCard prop={customProp} />
        </div>
      )}
    </div>
  );
};