import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import ValueIndicator from './ValueIndicator';

interface Prop {
  id: string;
  player: string;
  sport: string;
  category: string;
  currentOdds: number;
  predictedValue: number;
  valueType: 'undervalued' | 'overvalued' | 'neutral';
  confidence: number;
}

interface PropsListProps {
  props: Prop[];
  onPropSelect?: (prop: Prop) => void;
}

const PropsList: React.FC<PropsListProps> = ({ props, onPropSelect }) => {
  const [sortConfig, setSortConfig] = useState<{key: keyof Prop, direction: 'asc' | 'desc'}>({
    key: 'confidence',
    direction: 'desc'
  });

  const sortedProps = [...props].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) 
      return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) 
      return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Prop) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort('player')}>Player</TableHead>
          <TableHead onClick={() => handleSort('sport')}>Sport</TableHead>
          <TableHead onClick={() => handleSort('category')}>Category</TableHead>
          <TableHead onClick={() => handleSort('currentOdds')}>Current Odds</TableHead>
          <TableHead onClick={() => handleSort('predictedValue')}>Predicted Value</TableHead>
          <TableHead onClick={() => handleSort('confidence')}>Value Analysis</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedProps.map(prop => (
          <TableRow 
            key={prop.id} 
            onClick={() => onPropSelect && onPropSelect(prop)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell>{prop.player}</TableCell>
            <TableCell>{prop.sport}</TableCell>
            <TableCell>{prop.category}</TableCell>
            <TableCell>{prop.currentOdds.toFixed(2)}</TableCell>
            <TableCell>{prop.predictedValue.toFixed(2)}</TableCell>
            <TableCell>
              <ValueIndicator 
                value={prop.predictedValue} 
                type={prop.valueType} 
                confidence={prop.confidence} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PropsList;