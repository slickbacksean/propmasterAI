import React from 'react';
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';

interface ClutchMetric {
  name: string;
  value: number;
  fullMark: number;
}

interface ClutchMeterProps {
  playerName: string;
  metrics: ClutchMetric[];
}

const ClutchMeter: React.FC<ClutchMeterProps> = ({ 
  playerName, 
  metrics 
}) => {
  const calculateClutchScore = () => {
    const totalScore = metrics.reduce((sum, metric) => sum + metric.value, 0);
    return (totalScore / (metrics.length * 100) * 100).toFixed(1);
  };

  const getClutchDescription = (score: number) => {
    if (score > 80) return 'Elite Clutch Performance';
    if (score > 60) return 'High Clutch Performer';
    if (score > 40) return 'Solid Clutch Player';
    return 'Needs Improvement';
  };

  const getClutchColor = (score: number) => {
    if (score > 80) return 'text-green-600';
    if (score > 60) return 'text-green-500';
    if (score > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const clutchScore = parseFloat(calculateClutchScore());

  return (
    <div className="clutch-meter p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{playerName} - Clutch Performance</h2>
        <div className={`text-2xl font-bold ${getClutchColor(clutchScore)}`}>
          {clutchScore}
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-2/3">
          <RadarChart 
            width={400} 
            height={300} 
            data={metrics}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar 
              dataKey="value" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6} 
            />
          </RadarChart>
        </div>
        <div className="w-1/3 pl-4">
          <h3 className="text-lg font-semibold mb-2">
            {getClutchDescription(clutchScore)}
          </h3>
          <ul className="space-y-2">
            {metrics.map((metric, index) => (
              <li key={index} className="flex justify-between">
                <span>{metric.name}</span>
                <span className="font-bold">{metric.value.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClutchMeter;