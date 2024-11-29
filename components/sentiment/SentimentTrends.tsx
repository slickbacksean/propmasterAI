import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

interface SentimentTrendsData {
  period: string;
  positiveSentiment: number;
  negativeSentiment: number;
  neutralSentiment: number;
}

interface SentimentTrendsProps {
  player: string;
  data: SentimentTrendsData[];
}

const SentimentTrends: React.FC<SentimentTrendsProps> = ({ player, data }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{player} Sentiment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="positiveSentiment" stackId="a" fill="#82ca9d" name="Positive" />
            <Bar dataKey="negativeSentiment" stackId="a" fill="#ff6b6b" name="Negative" />
            <Bar dataKey="neutralSentiment" stackId="a" fill="#4ecdc4" name="Neutral" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentTrends;