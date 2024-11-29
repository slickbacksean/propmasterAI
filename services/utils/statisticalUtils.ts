// services/utils/statisticalUtils.ts

/**
 * Advanced statistical utility functions for prop bet analysis
 */
export const statisticalUtils = {
    /**
     * Calculate standard deviation of a dataset
     * @param data - Array of numeric values
     * @returns Standard deviation of the dataset
     */
    calculateStandardDeviation: (data: number[]): number => {
      if (data.length === 0) return 0;
  
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const variance = data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / data.length;
      
      return Math.sqrt(variance);
    },
  
    /**
     * Compute moving average for time-series data
     * @param data - Numeric array of time-series data
     * @param windowSize - Size of the moving window
     * @returns Array of moving averages
     */
    calculateMovingAverage: (data: number[], windowSize: number = 3): number[] => {
      if (data.length < windowSize) return data;
  
      return data.map((_, index, arr) => {
        const window = arr.slice(
          Math.max(0, index - windowSize + 1), 
          index + 1
        );
        return window.reduce((a, b) => a + b, 0) / window.length;
      });
    },
  
    /**
     * Calculate Bayesian probability
     * @param priorProbability - Initial probability
     * @param likelihoodData - Additional evidence
     * @returns Updated posterior probability
     */
    bayesianProbability: (priorProbability: number, likelihoodData: number[]): number => {
      const totalLikelihood = likelihoodData.reduce((a, b) => a * b, 1);
      return (priorProbability * totalLikelihood) / 
             ((priorProbability * totalLikelihood) + (1 - priorProbability));
    },
  
    /**
     * Compute correlation coefficient between two datasets
     * @param dataX - First numeric dataset
     * @param dataY - Second numeric dataset
     * @returns Pearson correlation coefficient
     */
    calculateCorrelation: (dataX: number[], dataY: number[]): number => {
      if (dataX.length !== dataY.length) {
        throw new Error('Datasets must be of equal length');
      }
  
      const n = dataX.length;
      const sumX = dataX.reduce((a, b) => a + b, 0);
      const sumY = dataY.reduce((a, b) => a + b, 0);
      const sumXSquare = dataX.reduce((a, b) => a + b * b, 0);
      const sumYSquare = dataY.reduce((a, b) => a + b * b, 0);
      const sumXY = dataX.reduce((a, x, i) => a + x * dataY[i], 0);
  
      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt(
        (n * sumXSquare - sumX * sumX) * 
        (n * sumYSquare - sumY * sumY)
      );
  
      return denominator !== 0 ? numerator / denominator : 0;
    },
  
    /**
     * Generate confidence interval for prop bet predictions
     * @param mean - Mean of the prediction
     * @param standardDeviation - Standard deviation of the data
     * @param confidenceLevel - Statistical confidence level (default 95%)
     * @returns Confidence interval object
     */
    calculateConfidenceInterval: (
      mean: number, 
      standardDeviation: number, 
      confidenceLevel: number = 0.95,
      sampleSize: number = 30
    ): { lower: number, upper: number } => {
      // Z-score for 95% confidence interval
      const zScore = confidenceLevel === 0.95 ? 1.96 : 1.645;
      const standardError = standardDeviation / Math.sqrt(sampleSize);
      
      return {
        lower: mean - (zScore * standardError),
        upper: mean + (zScore * standardError)
      };
    }
  };