import React from 'react';

interface StreakIndicatorProps {
  currentStreak: number;
  longestStreak: number;
  streakType: 'positive' | 'negative';
  player?: string;
}

const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  currentStreak,
  longestStreak,
  streakType,
  player = 'Player'
}) => {
  const getStreakColor = () => {
    return streakType === 'positive' ? 'bg-green-100 text-green-800' : 
           'bg-red-100 text-red-800';
  };

  const getStreakDescription = () => {
    const typeDescription = streakType === 'positive' ? 'winning' : 'losing';
    return `${player} is on a ${typeDescription} streak`;
  };

  return (
    <div className={`streak-indicator p-4 rounded-lg ${getStreakColor()}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{getStreakDescription()}</h3>
          <p className="text-sm text-gray-600">
            Current Streak: {currentStreak} | Longest Streak: {longestStreak}
          </p>
        </div>
        <div className="text-3xl font-bold">
          {currentStreak}
        </div>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${streakType === 'positive' ? 'bg-green-600' : 'bg-red-600'}`}
          style={{ width: `${Math.min(currentStreak / longestStreak * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StreakIndicator;