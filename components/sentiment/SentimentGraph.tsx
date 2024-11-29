import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SentimentData {
  timestamp: string;
  socialSentiment: number;
  playerPerformance: number;
}

interface SentimentGraphProps {
  data: SentimentData[];
  player: string;
}

const SentimentGraph: React.FC<SentimentGraphProps> = ({ data, player }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{player} Sentiment vs Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="socialSentiment" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              name="Social Sentiment"
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="playerPerformance" 
              stroke="#82ca9d" 
              name="Player Performance"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentGraph;