import React from 'react';
import { HeatMap as RechartHeatMap, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CorrelationMatrixProps {
  data: Array<{
    x: string;
    [key: string]: number | string;
  }>;
  xAxis: string[];
  title?: string;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ 
  data, 
  xAxis, 
  title 
}) => {
  // Color scale for correlation
  const getColor = (value: number) => {
    if (value > 0) {
      return `rgba(33, 150, 243, ${Math.abs(value)})`;  // Blue for positive
    } else {
      return `rgba(244, 67, 54, ${Math.abs(value)})`;   // Red for negative
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RechartHeatMap
          data={data}
          horizontal={false}
          reverseX={true}
          width={400}
          height={300}
          className="text-sm"
        >
          <XAxis 
            type="category" 
            dataKey="x" 
            interval={0} 
            className="text-xs text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            type="category" 
            dataKey="y" 
            interval={0} 
            className="text-xs text-gray-600 dark:text-gray-400"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderColor: '#e0e0e0',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [
              `Correlation: ${value.toFixed(2)}`, 
              ''
            ]}
          />
          <RechartHeatMap.Cells 
            fill={(props: any) => getColor(props.value)}
          />
        </RechartHeatMap>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelationMatrix;