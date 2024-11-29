import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ConsensusMetric {
  name: string;
  crowdPercentage: number;
  expertPercentage: number;
}

interface ConsensusViewProps {
  metrics: ConsensusMetric[];
}

const ConsensusView: React.FC<ConsensusViewProps> = ({ metrics }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const calculateOverallConsensus = () => {
    const avgCrowdConsensus = metrics.reduce((sum, metric) => sum + metric.crowdPercentage, 0) / metrics.length;
    const avgExpertConsensus = metrics.reduce((sum, metric) => sum + metric.expertPercentage, 0) / metrics.length;
    
    return {
      crowd: avgCrowdConsensus.toFixed(1),
      expert: avgExpertConsensus.toFixed(1)
    };
  };

  const consensus = calculateOverallConsensus();

  return (
    <div className="consensus-view p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Consensus Analysis</h2>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Crowd Consensus</div>
            <div className="text-lg font-bold text-blue-600">{consensus.crowd}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Expert Consensus</div>
            <div className="text-lg font-bold text-green-600">{consensus.expert}%</div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="crowdPercentage"
                label={({ name, crowdPercentage }) => `${name}: ${crowdPercentage.toFixed(1)}%`}
              >
                {metrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3 pl-4">
          <h3 className="text-lg font-semibold mb-4">Consensus Breakdown</h3>
          <ul className="space-y-2">
            {metrics.map((metric, index) => (
              <li key={index} className="flex justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-2 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{metric.name}</span>
                </div>
                <div className="font-bold">
                  {metric.crowdPercentage.toFixed(1)}%
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConsensusView;