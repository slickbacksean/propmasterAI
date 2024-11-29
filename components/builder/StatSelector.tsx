// components/builder/StatSelector.tsx
import React, { useState } from 'react';
import { PlayerStat } from '../../types/props';

interface StatSelectorProps {
  onStatSelect: (stat: PlayerStat) => void;
  onStatRemove: (stat: PlayerStat) => void;
  selectedStats: PlayerStat[];
}

export const StatSelector: React.FC<StatSelectorProps> = ({ 
  onStatSelect, 
  onStatRemove, 
  selectedStats 
}) => {
  const availableStats: PlayerStat[] = [
    { category: 'Points', value: 0 },
    { category: 'Rebounds', value: 0 },
    { category: 'Assists', value: 0 },
    { category: 'Steals', value: 0 },
    { category: 'Blocks', value: 0 },
    { category: 'Three-Pointers', value: 0 }
  ];

  const [inputValue, setInputValue] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Points');

  const handleSelect = () => {
    const newStat: PlayerStat = {
      category: selectedCategory,
      value: inputValue
    };
    onStatSelect(newStat);
    setInputValue(0);
  };

  return (
    <div className="stat-selector">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Stat Category
        </label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {availableStats.map((stat) => (
            <option key={stat.category} value={stat.category}>
              {stat.category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Enter Stat Value
        </label>
        <input 
          type="number" 
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button 
        onClick={handleSelect}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Add Stat
      </button>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Selected Stats</h3>
        {selectedStats.map((stat, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
          >
            <span>{stat.category}: {stat.value}</span>
            <button 
              onClick={() => onStatRemove(stat)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};