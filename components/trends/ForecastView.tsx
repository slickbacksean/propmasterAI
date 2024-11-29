import React from 'react';

interface ForecastData {
  metric: string;
  currentValue: number;
  prediction: number;
  confidence: number;
}

interface ForecastViewProps {
  forecasts: ForecastData[];
  timeframe?: string;
}

const ForecastView: React.FC<ForecastViewProps> = ({ 
  forecasts, 
  timeframe = 'Next Game' 
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'bg-green-100 text-green-800';
    if (confidence > 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="forecast-view p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Forecast ({timeframe})</h2>
      <div className="space-y-4">
        {forecasts.map((forecast, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex-grow">
              <h3 className="font-semibold">{forecast.metric}</h3>
              <div className="flex items-center space-x-4">
                <span>Current: {forecast.currentValue}</span>
                <span className="font-bold">→</span>
                <span>Predicted: {forecast.prediction}</span>
              </div>
            </div>
            <div 
              className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(forecast.confidence)}`}
            >
              {forecast.confidence}% Confidence
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastView;