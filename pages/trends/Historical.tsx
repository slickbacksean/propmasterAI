import React, { useState, useMemo } from 'react';
import { TrendGraph } from '../../components/trends/TrendGraph';
import { CorrelationView } from '../../components/analysis/CorrelationView';
import { useTrends } from '../../hooks/useTrends';

interface HistoricalTrendsProps {
  sport?: string;
  seasonYear?: number;
}

const Historical: React.FC<HistoricalTrendsProps> = ({ 
  sport = 'basketball', 
  seasonYear = new Date().getFullYear() 
}) => {
  const { 
    historicalData, 
    seasonalTrends, 
    correlationData,
    isLoading, 
    error 
  } = useTrends(sport, '', seasonYear);

  const [selectedView, setSelectedView] = useState<'overall' | 'player' | 'correlation'>('overall');

  const viewModes = [
    { label: 'Overall Trends', value: 'overall' },
    { label: 'Player Comparisons', value: 'player' },
    { label: 'Prop Correlations', value: 'correlation' }
  ];

  const renderSelectedView = useMemo(() => {
    switch (selectedView) {
      case 'overall':
        return (
          <div className="overall-trends">
            <h2>Season {seasonYear} Overall Trends</h2>
            <TrendGraph 
              data={historicalData} 
              timeframe="season" 
            />
          </div>
        );
      
      case 'player':
        return (
          <div className="player-comparisons">
            <h2>Top Player Season Performances</h2>
            {seasonalTrends.map((playerTrend) => (
              <div key={playerTrend.player} className="player-trend-card">
                <h3>{playerTrend.player}</h3>
                <TrendGraph 
                  data={playerTrend.data} 
                  timeframe="season" 
                />
              </div>
            ))}
          </div>
        );
      
      case 'correlation':
        return (
          <div className="prop-correlations">
            <h2>Seasonal Prop Correlations</h2>
            <CorrelationView 
              correlationData={correlationData} 
              season={seasonYear} 
            />
          </div>
        );
      
      default:
        return null;
    }
  }, [selectedView, historicalData, seasonalTrends, correlationData, seasonYear]);

  if (isLoading) return <div>Loading historical trends...</div>;
  if (error) return <div>Error loading historical data: {error.message}</div>;

  return (
    <div className="historical-trends-container">
      <div className="trends-header">
        <h1>Historical Trends - {sport} {seasonYear}</h1>
        <div className="view-selector">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              className={selectedView === mode.value ? 'active' : ''}
              onClick={() => setSelectedView(mode.value as 'overall' | 'player' | 'correlation')}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="historical-content">
        {renderSelectedView}
      </div>
    </div>
  );
};

export default Historical;