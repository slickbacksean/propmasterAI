import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PerformanceGraphProps {
  data: Array<{
    name: string;
    actual: number;
    expected: number;
  }>;
  title?: string;
}

const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ 
  data, 
  title 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)}`, 
              name
            ]}
          />
          <Legend />
          <Bar 
            dataKey="actual" 
            fill="#3182CE" 
            name="Actual Performance"
            barSize={20}
          />
          <Bar 
            dataKey="expected" 
            fill="#48BB78" 
            name="Expected Performance"
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceGraph;