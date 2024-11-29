import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  date: string;
  value: number;
  forecast?: number;
  trend: 'positive' | 'negative' | 'neutral';
}

interface TrendGraphProps {
  data: TrendData[];
  title?: string;
  yAxisLabel?: string;
  predictionColor?: string;
  actualColor?: string;
}

const TrendGraph: React.FC<TrendGraphProps> = ({
  data,
  title = 'Performance Trend',
  yAxisLabel = 'Value',
  predictionColor = '#8884d8',
  actualColor = '#82ca9d'
}) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      trendColor: item.trend === 'positive' ? 'green' : 
                  item.trend === 'negative' ? 'red' : 'gray'
    }));
  }, [data]);

  return (
    <div className="trend-graph-container p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#f5f5f5' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={actualColor} 
            name="Actual Performance" 
          />
          {data.some(item => item.forecast) && (
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke={predictionColor} 
              strokeDasharray="5 5" 
              name="Forecast" 
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendGraph;