import React, { useMemo } from 'react';

interface CrowdProp {
  player: string;
  prop: string;
  crowdConfidence: number;
  avgBet: number;
  popularityRank: number;
}

interface CrowdInsightsProps {
  props: CrowdProp[];
}

const CrowdInsights: React.FC<CrowdInsightsProps> = ({ props }) => {
  const sortedProps = useMemo(() => {
    return [...props].sort((a, b) => b.crowdConfidence - a.crowdConfidence);
  }, [props]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'bg-green-100 text-green-800';
    if (confidence > 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="crowd-insights p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Crowd Wisdom Insights</h2>
        <div className="text-sm text-gray-600">
          {props.length} Active Props
        </div>
      </div>
      <div className="space-y-4">
        {sortedProps.map((propItem, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-grow">
              <div className="flex justify-between">
                <h3 className="font-semibold">{propItem.player}</h3>
                <span className="text-sm text-gray-600">
                  Rank #{propItem.popularityRank}
                </span>
              </div>
              <p className="text-sm text-gray-500">{propItem.prop}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div 
                className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(propItem.crowdConfidence)}`}
              >
                {propItem.crowdConfidence}% Confident
              </div>
              <div className="text-right">
                <div className="font-bold">
                  ${propItem.avgBet.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">Avg Bet</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        Insights based on crowd betting patterns
      </div>
    </div>
  );
};

export default CrowdInsights;