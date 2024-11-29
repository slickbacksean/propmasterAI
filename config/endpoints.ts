// config/endpoints.ts
export const ENDPOINTS = {
    // Sportsbooks and Odds APIs
    sportsbooks: {
      optiOdds: {
        baseUrl: 'https://api.opticodds.com/v1',
        endpoints: {
          playerProps: '/player-props',
          liveOdds: '/live-odds',
          historicalData: '/historical'
        }
      },
      // Placeholder for additional sportsbook integrations
      backup: {
        baseUrl: 'https://api.alternateodds.com/v1',
        endpoints: {
          playerProps: '/props',
          liveOdds: '/live'
        }
      }
    },
    
    // Internal ML Services
    mlServices: {
      baseUrl: 'https://ml.propmaster.ai/api',
      endpoints: {
        trendPrediction: '/predict/trends',
        sentimentAnalysis: '/analyze/sentiment',
        clutchPerformance: '/predict/clutch',
        fatigueModel: '/predict/fatigue'
      }
    },
    
    // Social Media and Sentiment Data
    socialData: {
      twitter: {
        baseUrl: 'https://api.twitter.com/2',
        endpoints: {
          recentSearch: '/tweets/search/recent',
          userTweets: '/users/{id}/tweets'
        }
      },
      reddit: {
        baseUrl: 'https://oauth.reddit.com/api/v1',
        endpoints: {
          subredditSearch: '/search',
          comments: '/comments'
        }
      }
    },
    
    // External Sports Data Providers
    sportsData: {
      statsPerform: {
        baseUrl: 'https://api.statsperform.com/v1',
        endpoints: {
          playerStats: '/players/stats',
          gameLog: '/games/log',
          teamInfo: '/teams'
        }
      }
    },
    
    // Internal API Endpoints
    internal: {
      baseUrl: 'https://api.propmaster.ai/v1',
      endpoints: {
        userProps: '/user/props',
        savedAnalysis: '/analysis/saved',
        notifications: '/notifications'
      }
    }
  };
  
  // Utility function to construct full endpoint URLs
  export const getEndpointUrl = (service: keyof typeof ENDPOINTS, endpoint: string): string => {
    const serviceConfig = ENDPOINTS[service];
    
    if (!serviceConfig) {
      throw new Error(`Service ${service} not found in endpoint configuration`);
    }
    
    const fullUrl = `${serviceConfig.baseUrl}${serviceConfig.endpoints[endpoint]}`;
    
    if (!fullUrl) {
      throw new Error(`Endpoint ${endpoint} not found for service ${service}`);
    }
    
    return fullUrl;
  };
  
  // Export endpoint categories for type safety
  export const { 
    sportsbooks, 
    mlServices, 
    socialData, 
    sportsData, 
    internal 
  } = ENDPOINTS;