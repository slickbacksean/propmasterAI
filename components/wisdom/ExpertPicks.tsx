import React from 'react';

interface ExpertPick {
  expert: string;
  player: string;
  prop: string;
  recommendation: 'Over' | 'Under';
  confidence: number;
  analysis: string;
}

interface ExpertPicksProps {
  picks: ExpertPick[];
}

const ExpertPicks: React.FC<ExpertPicksProps> = ({ picks }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'border-l-4 border-green-500';
    if (confidence > 60) return 'border-l-4 border-yellow-500';
    return 'border-l-4 border-red-500';
  };

  const getRecommendationColor = (recommendation: 'Over' | 'Under') => {
    return recommendation === 'Over' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="expert-picks p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Expert Picks</h2>
        <div className="text-sm text-gray-600">
          {picks.length} Expert Recommendations
        </div>
      </div>
      <div className="space-y-4">
        {picks.map((pick, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg bg-white shadow-sm ${getConfidenceColor(pick.confidence)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{pick.player}</h3>
                <p className="text-sm text-gray-600">{pick.prop}</p>
              </div>
              <div 
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(pick.recommendation)}`}
              >
                {pick.recommendation}
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              {pick.analysis}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Expert: {pick.expert}
              </div>
              <div 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pick.confidence > 80 ? 'bg-green-100 text-green-800' :
                  pick.confidence > 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {pick.confidence}% Confidence
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertPicks;