import React, { useState, useMemo } from 'react';
import { SocialFeed } from '../../components/sentiment/SocialFeed';
import { PublicOpinionCard } from '../../components/sentiment/PublicOpinionCard';
import { useSentiment } from '../../hooks/useSentiment';

interface SocialSentimentProps {
  sport?: 'basketball' | 'football' | 'baseball';
  hashtag?: string;
}

const Social: React.FC<SocialSentimentProps> = ({ 
  sport = 'basketball',
  hashtag = '' 
}) => {
  const { 
    socialMediaFeeds, 
    publicOpinion, 
    socialTrends,
    isLoading,
    error 
  } = useSentiment(undefined, sport, hashtag);

  const [activeView, setActiveView] = useState<'feed' | 'trends' | 'analysis'>('feed');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const viewModes = [
    { label: 'Social Feed', value: 'feed' },
    { label: 'Social Trends', value: 'trends' },
    { label: 'Sentiment Analysis', value: 'analysis' }
  ];

  const platformFilter = useMemo(() => {
    return [...new Set(socialMediaFeeds.map(feed => feed.platform))];
  }, [socialMediaFeeds]);

  const filteredFeeds = useMemo(() => {
    return selectedPlatform 
      ? socialMediaFeeds.filter(feed => feed.platform === selectedPlatform)
      : socialMediaFeeds;
  }, [socialMediaFeeds, selectedPlatform]);

  const renderSocialFeed = useMemo(() => {
    return (
      <div className="social-feed-container">
        <div className="platform-filters">
          <button 
            className={selectedPlatform === null ? 'active' : ''}
            onClick={() => setSelectedPlatform(null)}
          >
            All Platforms
          </button>
          {platformFilter.map(platform => (
            <button
              key={platform}
              className={selectedPlatform === platform ? 'active' : ''}
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>

        <div className="social-feeds">
          {filteredFeeds.map((feed, index) => (
            <SocialFeed 
              key={index} 
              feed={feed} 
            />
          ))}
        </div>
      </div>
    );
  }, [filteredFeeds, platformFilter, selectedPlatform]);

  const renderSocialTrends = useMemo(() => {
    return (
      <div className="social-trends-container">
        <h2>Current Social Trends</h2>
        <div className="trends-grid">
          {socialTrends.map((trend, index) => (
            <div key={index} className="trend-card">
              <h3>{trend.topic}</h3>
              <div className="trend-metrics">
                <p>Mentions: {trend.mentionCount}</p>
                <p>Sentiment Score: {trend.sentimentScore.toFixed(2)}</p>
                <p>Engagement Rate: {(trend.engagementRate * 100).toFixed(2)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [socialTrends]);

  const renderSentimentAnalysis = useMemo(() => {
    return (
      <div className="sentiment-analysis-container">
        <h2>Public Opinion Analysis</h2>
        <div className="opinion-insights">
          {publicOpinion.map((opinion, index) => (
            <PublicOpinionCard 
              key={index} 
              opinion={opinion} 
            />
          ))}
        </div>
      </div>
    );
  }, [publicOpinion]);

  if (isLoading) return <div>Loading social sentiment...</div>;
  if (error) return <div>Error loading social data: {error.message}</div>;

  return (
    <div className="social-sentiment-container">
      <div className="social-header">
        <h1>
          Social Sentiment {hashtag ? `- #${hashtag}` : ''} 
          <span className="sport-tag">{sport.toUpperCase()}</span>
        </h1>
        
        <div className="view-selector">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              className={activeView === mode.value ? 'active' : ''}
              onClick={() => setActiveView(mode.value as 'feed' | 'trends' | 'analysis')}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="social-content">
        {activeView === 'feed' && renderSocialFeed}
        {activeView === 'trends' && renderSocialTrends}
        {activeView === 'analysis' && renderSentimentAnalysis}
      </div>
    </div>
  );
};

export default Social;