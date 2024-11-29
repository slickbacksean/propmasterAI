// config/api.ts
import { env } from 'process';

/**
 * API Authentication and Configuration
 */
export const APIConfig = {
  // Authentication Methods
  auth: {
    // OptiOdds API Authentication
    optiOdds: {
      type: 'apiKey',
      headerName: 'X-API-Key',
      // Use environment variable for secure key management
      apiKey: env.OPTIODDS_API_KEY || '',
      baseScopes: [
        'read:player_props',
        'read:live_odds',
        'read:historical_data'
      ]
    },
    
    // Internal PropMaster Authentication
    propMaster: {
      type: 'oauth2',
      tokenEndpoint: 'https://auth.propmaster.ai/oauth/token',
      clientId: env.PROPMASTER_CLIENT_ID || '',
      clientSecret: env.PROPMASTER_CLIENT_SECRET || '',
      scopes: [
        'user:profile',
        'props:read',
        'props:write',
        'analytics:access'
      ]
    }
  },
  
  // API Request Configuration
  requestSettings: {
    // Global timeout settings
    timeout: {
      default: 10000, // 10 seconds
      longRunning: 30000, // 30 seconds for complex queries
      mlPrediction: 20000 // 20 seconds for ML model predictions
    },
    
    // Retry and error handling
    retry: {
      maxAttempts: 3,
      baseDelay: 1000, // 1 second initial delay
      backoffFactor: 2, // Exponential backoff
      retryableStatusCodes: [
        429, // Too Many Requests
        500, // Internal Server Error
        502, // Bad Gateway
        503, // Service Unavailable
        504  // Gateway Timeout
      ]
    },
    
    // Caching configuration
    caching: {
      enabled: true,
      defaultTTL: {
        shortTerm: 300, // 5 minutes
        mediumTerm: 1800, // 30 minutes
        longTerm: 86400 // 24 hours
      },
      strategies: {
        playerProps: 'mediumTerm',
        liveOdds: 'shortTerm',
        historicalData: 'longTerm'
      }
    }
  },
  
  // Rate Limiting Configuration
  rateLimits: {
    optiOdds: {
      requestsPerMinute: 60,
      requestsPerHour: 500,
      concurrentConnections: 5
    },
    socialMedia: {
      requestsPerMinute: 30,
      requestsPerHour: 200,
      concurrentConnections: 3
    }
  },
  
  // Error Handling and Logging
  errorHandling: {
    logLevel: 'error',
    sensitivityThreshold: {
      networkError: 'high',
      authError: 'critical',
      dataIntegrityError: 'medium'
    },
    notificationChannels: [
      'email',
      'slack',
      'sentry'
    ]
  },
  
  // Data Validation and Transformation
  dataValidation: {
    strictMode: true,
    requiredFields: {
      playerProps: [
        'player_id',
        'sport',
        'prop_type',
        'current_odds'
      ],
      liveOdds: [
        'game_id',
        'timestamp',
        'prop_value'
      ]
    },
    transformations: {
      normalizeOdds: true,
      convertToDecimal: true,
      trimWhitespace: true
    }
  }
};

// Utility function for secure API key retrieval
export const getApiKey = (service: keyof typeof APIConfig.auth): string => {
  const serviceAuth = APIConfig.auth[service];
  
  if (!serviceAuth || !serviceAuth.apiKey) {
    throw new Error(`API key not configured for service: ${service}`);
  }
  
  return serviceAuth.apiKey;
};

// Export configuration sections for type safety
export const { 
  auth, 
  requestSettings, 
  rateLimits, 
  errorHandling, 
  dataValidation 
} = APIConfig;