import React, { useState } from 'react';

interface Prop {
  id: string;
  player: string;
  originalLine: number;
  currentLine: number;
  type: string;
}

interface PropAdjusterProps {
  initialProps: Prop[];
  onPropUpdate?: (updatedProp: Prop) => void;
}

const PropAdjuster: React.FC<PropAdjusterProps> = ({ initialProps, onPropUpdate }) => {
  const [props, setProps] = useState<Prop[]>(initialProps);

  const adjustProp = (propId: string, direction: 'up' | 'down') => {
    const updatedProps = props.map(prop => {
      if (prop.id === propId) {
        const newLine = direction === 'up' 
          ? prop.currentLine + 0.5 
          : prop.currentLine - 0.5;
        
        const updatedProp = { 
          ...prop, 
          currentLine: newLine 
        };

        onPropUpdate && onPropUpdate(updatedProp);
        return updatedProp;
      }
      return prop;
    });

    setProps(updatedProps);
  };

  return (
    <div className="space-y-4">
      {props.map(prop => (
        <div 
          key={prop.id} 
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div>
            <div className="font-semibold">{prop.player}</div>
            <div className="text-sm text-gray-600">{prop.type}</div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => adjustProp(prop.id, 'down')}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              -
            </button>
            <div>
              <span className="font-bold">{prop.currentLine}</span>
              {prop.originalLine !== prop.currentLine && (
                <span className="text-xs text-gray-500 ml-1">
                  (Orig: {prop.originalLine})
                </span>
              )}
            </div>
            <button 
              onClick={() => adjustProp(prop.id, 'up')}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropAdjuster;