import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  confidence: number;
  analysis: {
    key: string;
    value: string | number;
  }[];
  warning?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  description, 
  confidence, 
  analysis,
  warning 
}) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Confidence: {(confidence * 100).toFixed(0)}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2">
          {description}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {analysis.map((item, index) => (
            <div 
              key={index} 
              className="bg-muted/50 p-2 rounded-md text-sm"
            >
              <div className="font-medium">{item.key}</div>
              <div className="font-bold">{item.value}</div>
            </div>
          ))}
        </div>
        {warning && (
          <div className="mt-2 text-xs text-red-500 flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {warning}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightCard;