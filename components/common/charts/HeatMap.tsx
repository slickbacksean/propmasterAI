import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface HeatMapProps {
  data: Array<{
    x: number;
    y: number;
    value: number;
    category?: string;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ 
  data, 
  xAxisLabel = 'X', 
  yAxisLabel = 'Y', 
  title 
}) => {
  // Color gradient function
  const getColor = (value: number) => {
    const intensity = Math.min(Math.max(value, 0), 1);
    return `rgba(33, 150, 243, ${intensity * 0.8})`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(0,0,0,0.1)" 
            className="dark:stroke-gray-700"
          />
          <XAxis 
            type="number" 
            dataKey="x" 
            name={xAxisLabel}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={yAxisLabel}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              borderColor: '#e0e0e0',
              borderRadius: '8px'
            }}
            formatter={(value, name, props) => [
              `${name}: ${value}`,
              `Value: ${props.payload.value.toFixed(2)}`
            ]}
          />
          <Scatter data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getColor(entry.value)}
                strokeWidth={0}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HeatMap;