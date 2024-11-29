import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ValueIndicatorProps {
  value: number;
  type: 'undervalued' | 'overvalued' | 'neutral';
  confidence: number;
}

const ValueIndicator: React.FC<ValueIndicatorProps> = ({ value, type, confidence }) => {
  const getColorClass = () => {
    switch (type) {
      case 'undervalued':
        return 'bg-green-500 text-white';
      case 'overvalued':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge className={getColorClass()}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
      <div className="text-sm text-muted-foreground">
        Value: {value.toFixed(2)} | Confidence: {(confidence * 100).toFixed(0)}%
      </div>
    </div>
  );
};

export default ValueIndicator;