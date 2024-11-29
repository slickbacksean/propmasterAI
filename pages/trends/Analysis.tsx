import React, { useState, useEffect } from 'react';
import { TrendGraph } from '../../components/trends/TrendGraph';
import { StreakIndicator } from '../../components/trends/StreakIndicator';
import { ForecastView } from '../../components/trends/ForecastView';
import { PerformanceMetrics } from '../../components/trends/PerformanceMetrics';
import { useTrends } from '../../hooks/useTrends';

interface TrendsAnalysisProps {
  sport?: string;
  player?: string;
}

const Analysis: React.FC<TrendsAnalysisProps> = ({ 
  sport = 'basketball', 
  player = '' 
}) => {
  const { 
    trendData, 
    forecastData, 
    performanceMetrics, 
    isLoading, 
    error 
  } = useTrends(sport, player);

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1W' | '1M' | '3M'>('1M');

  const timeframes = [
    { label: '1 Week', value: '1W' },
    { label: '1 Month', value: '1M' },
    { label: '3 Months', value: '3M' }
  ];

  if (isLoading) return <div>Loading trend analysis...</div>;
  if (error) return <div>Error loading trends: {error.message}</div>;

  return (
    <div className="trends-analysis-container">
      <div className="trends-header">
        <h1>Trend Analysis {player ? `for ${player}` : ''}</h1>
        <div className="timeframe-selector">
          {timeframes.map((tf) => (
            <button 
              key={tf.value}
              className={selectedTimeframe === tf.value ? 'active' : ''}
              onClick={() => setSelectedTimeframe(tf.value as '1W' | '1M' | '3M')}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="trends-content">
        <div className="primary-trend-view">
          <TrendGraph 
            data={trendData} 
            timeframe={selectedTimeframe} 
          />
          <StreakIndicator 
            data={trendData} 
            timeframe={selectedTimeframe} 
          />
        </div>

        <div className="forecast-section">
          <ForecastView 
            forecastData={forecastData} 
            timeframe={selectedTimeframe} 
          />
        </div>

        <div className="performance-metrics">
          <PerformanceMetrics 
            metrics={performanceMetrics} 
            timeframe={selectedTimeframe} 
          />
        </div>
      </div>
    </div>
  );
};

export default Analysis;