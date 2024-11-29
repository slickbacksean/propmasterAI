// src/config/constants.ts
export const APP_CONSTANTS = {
    APP_NAME: 'PropMaster AI',
    VERSION: '1.0.0',
    
    // Betting Insights
    PROP_VALUE_THRESHOLDS: {
      LOW_RISK: 0.3,
      MEDIUM_RISK: 0.6,
      HIGH_RISK: 0.9
    },
    
    // Machine Learning
    ML_MODEL_VERSIONS: {
      TREND_FORECASTER: '2.1',
      PROP_PREDICTOR: '1.5',
      SENTIMENT_ANALYZER: '3.0'
    },
    
    // UI Configurations
    UI: {
      THEME: {
        PRIMARY_COLOR: '#4A90E2',
        SECONDARY_COLOR: '#50E3C2'
      }
    }
  };
  
  export const SPORTS_TYPES = [
    'NBA', 
    'NFL', 
    'MLB', 
    'NHL', 
    'Soccer'
  ];