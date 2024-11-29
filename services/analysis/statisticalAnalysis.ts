import { Player, PlayerPerformance, StatisticalModel } from '../../types/players';
import { TimeSeriesAnalysis } from './timeSeriesAnalysis';

export class StatisticalAnalyzer {
  /**
   * Perform comprehensive statistical analysis on player performance
   * @param performanceData Historical performance data
   * @returns Detailed statistical model
   */
  static analyzePlayerPerformance(
    performanceData: PlayerPerformance[]
  ): StatisticalModel {
    return {
      mean: this.calculateMean(performanceData),
      median: this.calculateMedian(performanceData),
      standardDeviation: this.calculateStandardDeviation(performanceData),
      trends: TimeSeriesAnalysis.analyzeTrends(performanceData),
      volatility: this.calculateVolatility(performanceData)
    };
  }

  /**
   * Calculate mean of performance metrics
   * @param data Performance data
   * @returns Mean value
   */
  private static calculateMean(data: PlayerPerformance[]): number {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, perf) => acc + perf.value, 0);
    return sum / data.length;
  }

  /**
   * Calculate median of performance metrics
   * @param data Performance data
   * @returns Median value
   */
  private static calculateMedian(data: PlayerPerformance[]): number {
    if (data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a.value - b.value);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 !== 0 
      ? sorted[mid].value 
      : (sorted[mid - 1].value + sorted[mid].value) / 2;
  }

  /**
   * Calculate standard deviation of performance
   * @param data Performance data
   * @returns Standard deviation
   */
  private static calculateStandardDeviation(data: PlayerPerformance[]): number {
    if (data.length < 2) return 0;
    
    const mean = this.calculateMean(data);
    const variance = data.reduce((acc, perf) => 
      acc + Math.pow(perf.value - mean, 2), 0) / (data.length - 1);
    
    return Math.sqrt(variance);
  }

  /**
   * Calculate performance volatility
   * @param data Performance data
   * @returns Volatility score
   */
  private static calculateVolatility(data: PlayerPerformance[]): number {
    if (data.length < 2) return 0;
    
    const standardDeviation = this.calculateStandardDeviation(data);
    const mean = this.calculateMean(data);
    
    return (standardDeviation / mean) * 100;
  }

  /**
   * Identify performance anomalies
   * @param data Performance data
   * @param threshold Sensitivity for detecting anomalies
   * @returns Array of anomalous performances
   */
  static detectPerformanceAnomalies(
    data: PlayerPerformance[], 
    threshold: number = 1.5
  ): PlayerPerformance[] {
    const model = this.analyzePlayerPerformance(data);
    
    return data.filter(perf => 
      Math.abs(perf.value - model.mean) > (threshold * model.standardDeviation)
    );
  }
}