import React from 'react';

interface FatigueData {
  restDays: number;
  gamesPlayed: number;
  minutesPlayed: number;
  fatigueScore: number;
}

interface FatigueIndicatorProps {
  playerName: string;
  fatigue: FatigueData;
}

const FatigueIndicator: React.FC<FatigueIndicatorProps> = ({ 
  playerName, 
  fatigue 
}) => {
  const getFatigueLevel = (score: number) => {
    if (score <= 30) return { level: 'Low', color: 'bg-green-500' };
    if (score <= 60) return { level: 'Moderate', color: 'bg-yellow-500' };
    return { level: 'High', color: 'bg-red-500' };
  };

  const fatigueLevel = getFatigueLevel(fatigue.fatigueScore);

  return (
    <div className="fatigue-indicator p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{playerName} - Fatigue Analysis</h2>
        <div className={`px-3 py-1 rounded-full text-white ${fatigueLevel.color}`}>
          {fatigueLevel.level} Fatigue
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-sm text-gray-600">Rest Days</h3>
          <div className="text-2xl font-bold">{fatigue.restDays}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-sm text-gray-600">Games Played</h3>
          <div className="text-2xl font-bold">{fatigue.gamesPlayed}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-sm text-gray-600">Minutes Played</h3>
          <div className="text-2xl font-bold">{fatigue.minutesPlayed}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-sm text-gray-600">Fatigue Score</h3>
          <div className="text-2xl font-bold">{fatigue.fatigueScore.toFixed(1)}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${fatigueLevel.color}`}
            style={{ width: `${fatigue.fatigueScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FatigueIndicator;