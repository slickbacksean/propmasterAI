import { Player, PlayerStats } from '../types/players';
import { StatisticalUtils } from './utils/statisticalUtils';

export class CorrelationAnalyzer {
  /**
   * Analyze correlations between different player performance metrics
   * @param players Array of players to analyze
   * @param metrics Metrics to correlate
   * @returns Correlation matrix and insights
   */
  static analyzeCorrelations(players: Player[], metrics: string[]): CorrelationAnalysis {
    if (players.length < 2) {
      throw new Error('Insufficient players for correlation analysis');
    }

    const correlationMatrix = this.computeCorrelationMatrix(players, metrics);
    const significantCorrelations = this.findSignificantCorrelations(correlationMatrix);

    return {
      players: players.map(p => p.name),
      metrics,
      correlationMatrix,
      significantCorrelations,
      insights: this.generateInsights(significantCorrelations)
    };
  }

  /**
   * Compute correlation matrix for given players and metrics
   * @param players Array of players
   * @param metrics Metrics to correlate
   * @returns Correlation matrix
   */
  private static computeCorrelationMatrix(players: Player[], metrics: string[]): number[][] {
    const matrix: number[][] = [];

    for (let i = 0; i < players.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < players.length; j++) {
        matrix[i][j] = this.computePlayerMetricCorrelation(
          players[i].stats, 
          players[j].stats, 
          metrics
        );
      }
    }

    return matrix;
  }

  /**
   * Compute correlation between two players' stats
   * @param playerA First player's stats
   * @param playerB Second player's stats
   * @param metrics Metrics to correlate
   * @returns Correlation coefficient
   */
  private static computePlayerMetricCorrelation(
    playerA: PlayerStats, 
    playerB: PlayerStats, 
    metrics: string[]
  ): number {
    const correlations = metrics.map(metric => {
      const valuesA = this.extractMetricValues(playerA, metric);
      const valuesB = this.extractMetricValues(playerB, metric);
      
      return StatisticalUtils.pearsonCorrelation(valuesA, valuesB);
    });

    // Average correlation across metrics
    return StatisticalUtils.mean(correlations);
  }

  /**
   * Extract metric values from player stats
   * @param stats Player stats object
   * @param metric Metric to extract
   * @returns Array of metric values
   */
  private static extractMetricValues(stats: PlayerStats, metric: string): number[] {
    const values = stats[metric as keyof PlayerStats];
    return Array.isArray(values) ? values : [values as number];
  }

  /**
   * Find statistically significant correlations
   * @param correlationMatrix Correlation matrix
   * @returns Significant correlations
   */
  private static findSignificantCorrelations(correlationMatrix: number[][]): CorrelationPair[] {
    const significantCorrelations: CorrelationPair[] = [];

    for (let i = 0; i < correlationMatrix.length; i++) {
      for (let j = i + 1; j < correlationMatrix[i].length; j++) {
        const correlation = correlationMatrix[i][j];
        
        if (Math.abs(correlation) > 0.5) { // Threshold for significant correlation
          significantCorrelations.push({
            players: [i, j],
            correlation,
            strength: this.getCorrelationStrength(correlation)
          });
        }
      }
    }

    return significantCorrelations;
  }

  /**
   * Generate insights from significant correlations
   * @param correlations Significant correlations
   * @returns Correlation insights
   */
  private static generateInsights(correlations: CorrelationPair[]): string[] {
    return correlations.map(corr => 
      `Strong ${corr.strength} correlation detected between players at indices ${corr.players[0]} and ${corr.players[1]}`
    );
  }

  /**
   * Classify correlation strength
   * @param correlation Correlation coefficient
   * @returns Correlation strength description
   */
  private static getCorrelationStrength(correlation: number): string {
    const absCorr = Math.abs(correlation);
    if (absCorr > 0.8) return 'very strong';
    if (absCorr > 0.6) return 'strong';
    if (absCorr > 0.4) return 'moderate';
    return 'weak';
  }
}

// Type definitions for clarity
interface CorrelationAnalysis {
  players: string[];
  metrics: string[];
  correlationMatrix: number[][];
  significantCorrelations: CorrelationPair[];
  insights: string[];
}

interface CorrelationPair {
  players: number[]; // Indices of correlated players
  correlation: number;
  strength: string;
}

export default CorrelationAnalyzer;