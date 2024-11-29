// types/analysis.ts

export interface TimeSeriesData {
    timestamp: string;
    value: number;
  }
  
  export interface CorrelationMatrix {
    [key: string]: {
      [key: string]: number;
    };
  }
  
  export interface SentimentAnalysis {
    overallScore: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    topKeywords: string[];
  }
  
  export interface ProbabilityModel {
    baseline: number;
    conditional: number;
    bayesianPosterior: number;
  }
  
  export interface TrendForecast {
    shortTermTrend: 'rising' | 'falling' | 'stable';
    longTermTrend: 'improving' | 'declining' | 'consistent';
    projectedValue: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
  }
  
  export interface RiskAssessment {
    propId: string;
    volatilityScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    expectedVariance: number;
    recommendedBetSize: number;
  }