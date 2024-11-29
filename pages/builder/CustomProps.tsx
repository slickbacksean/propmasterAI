import React, { useState, useContext } from 'react';
import { PropBuilder } from '../../components/builder/PropBuilder';
import { OddsCalculator } from '../../components/builder/OddsCalculator';
import { StatSelector } from '../../components/builder/StatSelector';
import { CustomPropCard } from '../../components/builder/CustomPropCard';
import { PropContext } from '../../contexts/PropContext';
import { Button } from '../../components/common/Button';

interface CustomProp {
  id?: string;
  player: string;
  sport: string;
  statType: string;
  threshold: number;
  probability: number;
  odds: number;
}

const CustomPropsPage: React.FC = () => {
  const { saveProp } = useContext(PropContext);
  const [currentProp, setCurrentProp] = useState<CustomProp | null>(null);
  const [savedProps, setSavedProps] = useState<CustomProp[]>([]);

  const handleStatSelection = (player: string, sport: string) => {
    // Placeholder for stat selection logic
  };

  const handlePropBuilding = (propDetails: CustomProp) => {
    setCurrentProp(propDetails);
  };

  const handleSaveProp = () => {
    if (currentProp) {
      const newProp = {
        ...currentProp,
        id: `prop-${Date.now()}` // Generate unique ID
      };
      
      saveProp(newProp);
      setSavedProps(prev => [...prev, newProp]);
      setCurrentProp(null);
    }
  };

  return (
    <div className="custom-props-container">
      <h1 className="text-2xl font-bold mb-6">Custom Prop Builder</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="prop-builder-section">
          <StatSelector onStatSelect={handleStatSelection} />
          <PropBuilder onPropCreation={handlePropBuilding} />
          {currentProp && (
            <div className="mt-4">
              <OddsCalculator prop={currentProp} />
              <Button 
                onClick={handleSaveProp}
                className="mt-2 w-full bg-green-500 text-white"
              >
                Save Prop
              </Button>
            </div>
          )}
        </div>

        <div className="saved-props-section">
          <h2 className="text-xl font-semibold mb-4">Saved Props</h2>
          {savedProps.map(prop => (
            <CustomPropCard 
              key={prop.id} 
              prop={prop} 
              // Additional actions like edit/delete could be added here
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomPropsPage;