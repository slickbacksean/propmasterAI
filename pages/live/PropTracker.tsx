import React, { useState, useMemo } from 'react';
import { useRealtime } from '../../hooks/useRealtime';
import { usePropBuilder } from '../../hooks/usePropBuilder';

interface PropTrackerProps {
  sport?: 'basketball' | 'football' | 'baseball';
  userId?: string;
}

const PropTracker: React.FC<PropTrackerProps> = ({ 
  sport = 'basketball',
  userId 
}) => {
  const { 
    activeLivePropsBySport, 
    upcomingProps, 
    trackedProps 
  } = useRealtime(undefined, sport, userId);

  const { predictPropOutcome } = usePropBuilder();

  const [propView, setPropView] = useState<'live' | 'tracked' | 'upcoming'>('live');
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);

  const viewModes = [
    { label: 'Live Props', value: 'live' },
    { label: 'Tracked Props', value: 'tracked' },
    { label: 'Upcoming Props', value: 'upcoming' }
  ];

  const displayProps = useMemo(() => {
    switch (propView) {
      case 'live': return activeLivePropsBySport;
      case 'tracked': return trackedProps;
      case 'upcoming': return upcomingProps;
      default: return [];
    }
  }, [propView, activeLivePropsBySport, trackedProps, upcomingProps]);

  const handlePropSelect = (propId: string) => {
    setSelectedPropId(propId);
  };

  const renderPropDetails = (propId: string | null) => {
    if (!propId) return null;

    const selectedProp = displayProps.find(prop => prop.id === propId);
    if (!selectedProp) return null;

    const propPrediction = predictPropOutcome(selectedProp);

    return (
      <div className="prop-details-modal">
        <h2>{selectedProp.player} - {selectedProp.propType}</h2>
        <div className="prop-prediction-details">
          <p>Current Odds: {selectedProp.currentOdds}</p>
          <p>Predicted Outcome: {propPrediction.outcome}</p>
          <p>Confidence: {propPrediction.confidence}%</p>
          <div className="prediction-breakdown">
            {propPrediction.factors.map((factor, index) => (
              <div key={index} className="prediction-factor">
                <span>{factor.name}:</span>
                <span>{factor.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="prop-tracker-container">
      <div className="prop-tracker-header">
        <h1>Prop Tracker - {sport.toUpperCase()}</h1>
        <div className="view-selector">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              className={propView === mode.value ? 'active' : ''}
              onClick={() => setPropView(mode.value as 'live' | 'tracked' | 'upcoming')}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="props-content">
        <div className="props-list">
          {displayProps.map((prop) => (
            <div 
              key={prop.id} 
              className={`prop-item ${selectedPropId === prop.id ? 'selected' : ''}`}
              onClick={() => handlePropSelect(prop.id)}
            >
              <div className="prop-basic-info">
                <h3>{prop.player}</h3>
                <p>{prop.propType} - {prop.currentOdds}</p>
                <span className="prop-status">{prop.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="prop-details">
          {renderPropDetails(selectedPropId)}
        </div>
      </div>
    </div>
  );
};

export default PropTracker;