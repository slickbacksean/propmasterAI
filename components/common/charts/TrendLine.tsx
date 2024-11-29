import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendLineProps {
  data: Array<{
    name: string;
    [key: string]: number | string;
  }>;
  lines: Array<{
    dataKey: string;
    stroke: string;
    name?: string;
  }>;
  title?: string;
}

const TrendLine: React.FC<TrendLineProps> = ({ data, lines, title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(0,0,0,0.1)" 
            className="dark:stroke-gray-700"
          />
          <XAxis 
            dataKey="name" 
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderColor: '#e0e0e0',
              borderRadius: '8px'
            }}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              name={line.name || line.dataKey}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendLine;