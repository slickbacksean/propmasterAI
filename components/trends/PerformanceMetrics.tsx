import React from 'react';

interface MetricData {
  name: string;
  value: number;
  change: number;
  icon?: React.ReactNode;
}

interface PerformanceMetricsProps {
  metrics: MetricData[];
  title?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  metrics, 
  title = 'Performance Overview' 
}) => {
  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    return change > 0 ? '▲' : change < 0 ? '▼' : '―';
  };

  return (
    <div className="performance-metrics p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="p-4 border rounded-lg flex flex-col items-center text-center"
          >
            {metric.icon && <div className="mb-2">{metric.icon}</div>}
            <h3 className="font-semibold">{metric.name}</h3>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className={`text-sm ${getChangeColor(metric.change)}`}>
              {getChangeIcon(metric.change)} {Math.abs(metric.change)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;