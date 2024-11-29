import React from 'react';

interface LiveIndicator {
  type: 'momentum' | 'player-performance' | 'statistical-trend';
  value: number;
  description: string;
}

interface LiveIndicatorsProps {
  indicators: LiveIndicator[];
}

const LiveIndicators: React.FC<LiveIndicatorsProps> = ({ indicators }) => {
  const getIndicatorColor = (value: number) => {
    if (value > 75) return 'bg-green-500';
    if (value > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {indicators.map((indicator, index) => (
        <div 
          key={index} 
          className={`p-3 rounded-lg shadow-md ${getIndicatorColor(indicator.value)}`}
        >
          <div className="text-sm font-semibold text-white capitalize">
            {indicator.type.replace('-', ' ')}
          </div>
          <div className="text-lg font-bold text-white">
            {indicator.value}%
          </div>
          <div className="text-xs text-white/80 mt-1">
            {indicator.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveIndicators;