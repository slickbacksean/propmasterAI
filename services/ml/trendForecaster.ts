import { Player, PlayerTrend, ForecastModel } from '../../types/players';
import { TimeSeriesAnalysis } from '../analysis/timeSeriesAnalysis';
import { StatisticalAnalyzer } from '../analysis/statisticalAnalysis';

export class TrendForecaster {
  /**
   * Forecast player performance trends
   * @param player Player data
   * @param historicalPerformance Historical performance data
   * @param forecastPeriod Number of periods to forecast
   * @returns Trend forecast model
   */
  static forecastPlayerTrends(
    player: Player, 
    historicalPerformance: PlayerTrend[], 
    forecastPeriod: number = 5
  ): ForecastModel {
    // Analyze statistical characteristics
    const statisticalModel = StatisticalAnalyzer.analyzePlayerPerformance(
      historicalPerformance.map(trend => ({
        value: trend.performanceValue,
        timestamp: trend.timestamp
      }))
    );

    // Perform time series analysis
    const timeSeriesAnalysis = TimeSeriesAnalysis.analyzeTrends(
      historicalPerformance.map(trend => ({
        value: trend.performanceValue,
        timestamp: trend.timestamp
      }))
    );

    // Generate forecast using multiple methods
    const forecastMethods = [
      this.linearTrendForecast,
      this.seasonalAdjustedForecast,
      this.exponentialSmoothingForecast
    ];

    const forecasts = forecastMethods.map(method => 
      method(historicalPerformance, forecastPeriod)
    );

    // Ensemble forecast (average of methods)
    const ensembleForecast = forecasts.reduce((a, b) => 
      a.map((value, index) => value + b[index]), 
      new Array(forecastPeriod).fill(0)
    ).map(value => value / forecasts.length);

    return {
      playerId: player.id,
      historicalTrends: timeSeriesAnalysis,
      statisticalModel,
      forecast: ensembleForecast,
      confidenceInterval: this.calculateConfidenceInterval(statisticalModel)
    };
  }

  /**
   * Linear trend forecast method
   * @param historicalTrends Historical performance trends
   * @param periods Forecast periods
   * @returns Linear trend forecast
   */
  private static linearTrendForecast(
    historicalTrends: PlayerTrend[], 
    periods: number
  ): number[] {
    const values = historicalTrends.map(trend => trend.performanceValue);
    const n = values.length;
    
    // Calculate linear regression parameters
    const sumX = (n * (n + 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, i) => sum + y * (i + 1), 0);
    const sumXSquare = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXSquare - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecast
    return Array.from({ length: periods }, (_, i) => 
      slope * (n + i + 1) + intercept
    );
  }

  /**
   * Seasonal adjusted forecast method
   * @param historicalTrends Historical performance trends
   * @param periods Forecast periods
   * @returns Seasonal adjusted forecast
   */
  private static seasonalAdjustedForecast(
    historicalTrends: PlayerTrend[], 
    periods: number
  ): number[] {
    const values = historicalTrends.map(trend => trend.performanceValue);
    const seasonalFactor = this.calculateSeasonalFactor(values);

    const lastValue = values[values.length - 1];
    return Array.from({ length: periods }, (_, i) => 
      lastValue * Math.pow(seasonalFactor, i + 1)
    );
  }

  /**
   * Exponential smoothing forecast method
   * @param historicalTrends Historical performance trends
   * @param periods Forecast periods
   * @returns Exponential smoothing forecast
   */
  private static exponentialSmoothingForecast(
    historicalTrends: PlayerTrend[], 
    periods: number,
    alpha: number = 0.3
  ): number[] {
    const values = historicalTrends.map(trend => trend.performanceValue);
    let smoothed = values[0];
    const forecast: number[] = [];

    for (let i = 1; i < values.length; i++) {
      smoothed = alpha * values[i] + (1 - alpha) * smoothed;
    }

    for (let i = 0; i < periods; i++) {
      forecast.push(smoothed);
    }

    return forecast;
  }

  /**
   * Calculate seasonal factor
   * @param values Performance values
   * @returns Seasonal multiplicative factor
   */
  private static calculateSeasonalFactor(values: number[]): number {
    const averageChange = values.reduce((sum, value, index) => {
      if (index === 0) return sum;
      return sum + (value / values[index - 1]);
    }, 0) / (values.length - 1);

    return averageChange;
  }

  /**
   * Calculate confidence interval for forecast
   * @param statisticalModel Statistical performance model
   * @returns Confidence interval
   */
  private static calculateConfidenceInterval(statisticalModel: any): [number, number] {
    const { mean, standardDeviation } = statisticalModel;
    const confidenceLevel = 1.96; // 95% confidence interval

    return [
      mean - (confidenceLevel * standardDeviation),
      mean + (confidenceLevel * standardDeviation)
    ];
  }
}