import React, { useState, useMemo } from 'react';
import { SentimentGraph } from '../../components/sentiment/SentimentGraph';
import { PublicOpinionCard } from '../../components/sentiment/PublicOpinionCard';
import { SentimentTrends } from '../../components/sentiment/SentimentTrends';
import { useSentiment } from '../../hooks/useSentiment';

interface SentimentDashboardProps {
  player?: string;
  sport?: 'basketball' | 'football' | 'baseball';
}

const Dashboard: React.FC<SentimentDashboardProps> = ({ 
  player = '',
  sport = 'basketball' 
}) => {
  const { 
    overallSentiment, 
    sentimentTrends, 
    publicOpinion, 
    socialMediaInsights,
    isLoading,
    error
  } = useSentiment(player, sport);

  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'social'>('overview');

  const viewModes = [
    { label: 'Sentiment Overview', value: 'overview' },
    { label: 'Sentiment Trends', value: 'trends' },
    { label: 'Social Media Insights', value: 'social' }
  ];

  const renderSentimentOverview = useMemo(() => {
    return (
      <div className="sentiment-overview">
        <div className="sentiment-summary">
          <h2>Overall Sentiment</h2>
          <div className="sentiment-score">
            <span className={`sentiment-indicator ${
              overallSentiment.score > 0 ? 'positive' : 
              overallSentiment.score < 0 ? 'negative' : 'neutral'
            }`}>
              {overallSentiment.score.toFixed(2)}
            </span>
            <p>{overallSentiment.description}</p>
          </div>
        </div>

        <div className="public-opinion-section">
          <h2>Public Opinion Highlights</h2>
          <div className="opinion-cards">
            {publicOpinion.map((opinion, index) => (
              <PublicOpinionCard 
                key={index} 
                opinion={opinion} 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }, [overallSentiment, publicOpinion]);

  const renderSentimentTrends = useMemo(() => {
    return (
      <div className="sentiment-trends">
        <h2>Sentiment Trends Analysis</h2>
        <SentimentGraph 
          data={sentimentTrends} 
          player={player} 
          sport={sport} 
        />
        <SentimentTrends 
          trends={sentimentTrends} 
          player={player} 
        />
      </div>
    );
  }, [sentimentTrends, player, sport]);

  const renderSocialMediaInsights = useMemo(() => {
    return (
      <div className="social-media-insights">
        <h2>Social Media Sentiment Breakdown</h2>
        <div className="insights-grid">
          {socialMediaInsights.map((insight, index) => (
            <div key={index} className="social-insight-card">
              <h3>{insight.platform}</h3>
              <div className="insight-metrics">
                <p>Positive Mentions: {insight.positiveMentions}</p>
                <p>Negative Mentions: {insight.negativeMentions}</p>
                <p>Sentiment Score: {insight.sentimentScore.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [socialMediaInsights]);

  if (isLoading) return <div>Loading sentiment data...</div>;
  if (error) return <div>Error loading sentiment: {error.message}</div>;

  return (
    <div className="sentiment-dashboard-container">
      <div className="dashboard-header">
        <h1>
          {player ? `${player}'s ` : ''}Sentiment Dashboard 
          <span className="sport-tag">{sport.toUpperCase()}</span>
        </h1>
        
        <div className="view-selector">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              className={activeView === mode.value ? 'active' : ''}
              onClick={() => setActiveView(mode.value as 'overview' | 'trends' | 'social')}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sentiment-content">
        {activeView === 'overview' && renderSentimentOverview}
        {activeView === 'trends' && renderSentimentTrends}
        {activeView === 'social' && renderSocialMediaInsights}
      </div>
    </div>
  );
};

export default Dashboard;