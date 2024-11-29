import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

interface PublicOpinionData {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  socialMediaVolume: number;
  sentimentShift: number;
}

interface PublicOpinionCardProps {
  player: string;
  data: PublicOpinionData;
}

const PublicOpinionCard: React.FC<PublicOpinionCardProps> = ({ player, data }) => {
  const getSentimentColor = () => {
    switch (data.sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const SentimentIcon = data.sentimentShift >= 0 ? TrendingUp : TrendingDown;
  const ShiftIcon = data.sentimentShift >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{player} Public Opinion</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <span className={`font-bold text-lg ${getSentimentColor()}`}>
            {data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1)} Sentiment
          </span>
          <div className="flex items-center">
            <SentimentIcon className={getSentimentColor()} />
            <span className={`ml-2 ${getSentimentColor()}`}>
              {Math.abs(data.sentimentShift).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Confidence</p>
            <p className="font-bold">{data.confidence.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Social Media Volume</p>
            <p className="font-bold">{data.socialMediaVolume.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicOpinionCard;