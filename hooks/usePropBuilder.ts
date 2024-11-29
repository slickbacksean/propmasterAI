// src/hooks/usePropBuilder.ts
import { useState } from 'react';
import { PropCategory, CustomProp as TypeCustomProp } from '../types/props';

export interface PropOption {
  type: string;
  stat: string;
  min: number;
  max: number;
  currentValue?: number;
}

export interface CustomProp {
  id: string;
  playerIds: string[];
  categories: PropCategory[];
  options: PropOption[];
  combinedValue: number;
  multiplier: number;
  potentialPayout: number;
  createdAt: string;
}

export const usePropBuilder = () => {
  const [customProps, setCustomProps] = useState<CustomProp[]>([]);

  const createCustomProp = (
    playerIds: string[], 
    categories: PropCategory[], 
    options: PropOption[]
  ): CustomProp => {
    const combinedValue = calculateCombinedValue(options);
    const multiplier = calculateMultiplier(options);
    
    const newProp: CustomProp = {
      id: `prop-${Date.now()}`,
      playerIds,
      categories,
      options,
      combinedValue,
      multiplier,
      potentialPayout: combinedValue * multiplier,
      createdAt: new Date().toISOString()
    };

    setCustomProps(prev => [...prev, newProp]);
    return newProp;
  };

  const calculateCombinedValue = (options: PropOption[]): number => {
    return options.reduce((acc, option) => {
      const range = option.max - option.min;
      return acc + (option.currentValue || (option.min + range / 2));
    }, 0);
  };

  const calculateMultiplier = (options: PropOption[]): number => {
    // Simple multiplier calculation based on complexity of prop
    const complexityFactor = options.length * 1.5;
    return Math.max(1.5, Math.min(5, complexityFactor));
  };

  const updatePropOptions = (propId: string, newOptions: PropOption[]) => {
    setCustomProps(prev => 
      prev.map(prop => {
        if (prop.id === propId) {
          const combinedValue = calculateCombinedValue(newOptions);
          const multiplier = calculateMultiplier(newOptions);
          
          return { 
            ...prop, 
            options: newOptions,
            combinedValue,
            multiplier,
            potentialPayout: combinedValue * multiplier
          };
        }
        return prop;
      })
    );
  };

  const deleteProp = (propId: string) => {
    setCustomProps(prev => prev.filter(prop => prop.id !== propId));
  };

  return {
    customProps,
    createCustomProp,
    updatePropOptions,
    deleteProp
  };
};