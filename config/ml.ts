// config/ml.ts
import { ModelType } from '../types/analysis';

/**
 * Configuration for machine learning models used in PropMaster AI
 */
export const MLConfig = {
  models: {
    // Time Series Forecasting Configuration
    timeSeries: {
      type: ModelType.ARIMA,
      seasonalPeriod: 7, // Weekly seasonality
      forecastHorizon: 30, // Days ahead prediction
      confidenceLevel: 0.95,
      hyperparameters: {
        p: 1,
        d: 1,
        q: 1,
        P: 1,
        D: 1,
        Q: 1
      }
    },
    
    // Sentiment Analysis Configuration
    sentiment: {
      type: ModelType.TRANSFORMER,
      modelName: 'distilbert-base-uncased',
      maxSequenceLength: 128,
      batchSize: 16,
      learningRate: 2e-5,
      thresholds: {
        positive: 0.7,
        negative: 0.3
      }
    },
    
    // Clutch Performance Model Configuration
    clutchPredictor: {
      type: ModelType.REINFORCEMENT,
      rewardMetrics: [
        'points_in_last_2_minutes',
        'game_winning_plays',
        'pressure_situation_performance'
      ],
      explorationRate: 0.1,
      discountFactor: 0.99
    },
    
    // Fatigue Prediction Configuration
    fatiguePrediction: {
      type: ModelType.REGRESSION,
      features: [
        'games_played_last_7_days',
        'travel_distance',
        'rest_days',
        'minutes_played'
      ],
      performanceDecayRate: 0.05
    }
  },
  
  // Global ML Settings
  globalSettings: {
    dataRefreshRate: 3600, // Seconds (1 hour)
    modelRetrainingFrequency: 'weekly',
    cacheExpirationTime: 86400, // 24 hours
    loggingLevel: 'INFO'
  },
  
  // Performance Thresholds
  performanceThresholds: {
    minConfidenceScore: 0.6,
    maxPredictionError: 0.2,
    significanceLevel: 0.05
  }
};

// Export model types for type safety
export const { models, globalSettings, performanceThresholds } = MLConfig;