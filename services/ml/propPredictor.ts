import { Player, Prop, PropPrediction } from '../../types/props';
import { TimeSeriesAnalysis } from '../analysis/timeSeriesAnalysis';
import { StatisticalAnalyzer } from '../analysis/statisticalAnalysis';
import { ProbabilityCalculator } from '../analysis/probabilityCalculations';

export class PropPredictor {
  /**
   * Predict prop performance for a given player
   * @param player Player data
   * @param historicalProps Historical prop performance data
   * @param gameContext Current game context
   * @returns Prop performance prediction
   */
  static predictProp(
    player: Player, 
    historicalProps: Prop[], 
    gameContext?: any
  ): PropPrediction {
    // Analyze historical trends
    const trendAnalysis = TimeSeriesAnalysis.analyzeTrends(
      historicalProps.map(prop => ({
        value: prop.value,
        timestamp: prop.timestamp
      }))
    );

    // Calculate statistical model
    const statisticalModel = StatisticalAnalyzer.analyzePlayerPerformance(
      historicalProps.map(prop => ({
        value: prop.value,
        timestamp: prop.timestamp
      }))
    );

    // Apply game context adjustments
    const contextAdjustedProbability = this.adjustPredictionByContext(
      statisticalModel.mean, 
      gameContext
    );

    // Calculate prop prediction probability
    const propProbability = ProbabilityCalculator.calculateCustomPropProbability(
      player, 
      historicalProps,
      gameContext
    );

    return {
      playerId: player.id,
      predictionValue: contextAdjustedProbability,
      probabilityModel: propProbability,
      trends: trendAnalysis,
      confidenceScore: propProbability.confidenceScore
    };
  }

  /**
   * Adjust prediction based on game context
   * @param basePrediction Base prediction value
   * @param gameContext Current game context
   * @returns Adjusted prediction
   */
  private static adjustPredictionByContext(
    basePrediction: number, 
    gameContext?: any
  ): number {
    if (!gameContext) return basePrediction;

    let contextFactor = 1;

    // Contextual adjustments
    if (gameContext.homeGame) contextFactor *= 1.1;
    if (gameContext.rivalTeam) contextFactor *= 0.9;
    if (gameContext.recentInjury) contextFactor *= 0.8;
    if (gameContext.weatherConditions) {
      switch (gameContext.weatherConditions) {
        case 'extreme':
          contextFactor *= 0.7;
          break;
        case 'favorable':
          contextFactor *= 1.2;
          break;
      }
    }

    return basePrediction * contextFactor;
  }

  /**
   * Generate ensemble predictions by combining multiple prediction methods
   * @param player Player data
   * @param historicalProps Historical prop data
   * @param predictionMethods Optional custom prediction methods
   * @returns Ensemble prop prediction
   */
  static ensemblePrediction(
    player: Player, 
    historicalProps: Prop[], 
    predictionMethods?: Array<(player: Player, props: Prop[]) => number>
  ): PropPrediction {
    // Default prediction methods if not provided
    const defaultMethods = [
      this.linearRegressionPredictor,
      this.movingAveragePredictor,
      this.exponentialSmoothingPredictor
    ];

    const methodsToUse = predictionMethods || defaultMethods;

    // Calculate predictions from each method
    const predictions = methodsToUse.map(method => 
      method(player, historicalProps)
    );

    // Calculate ensemble prediction (simple average)
    const ensemblePrediction = predictions.reduce((a, b) => a + b, 0) / predictions.length;

    return this.predictProp(player, historicalProps);
  }

  // Example prediction methods (can be expanded)
  private static linearRegressionPredictor(player: Player, props: Prop[]): number {
    // Simple linear regression prediction
    const values = props.map(prop => prop.value);
    const n = values.length;
    const sumX = values.reduce((a, b) => a + b, 0);
    const avgX = sumX / n;
    return avgX;
  }

  private static movingAveragePredictor(player: Player, props: Prop[], window: number = 5): number {
    const values = props.map(prop => prop.value);
    const windowedValues = values.slice(-window);
    return windowedValues.reduce((a, b) => a + b, 0) / windowedValues.length;
  }

  private static exponentialSmoothingPredictor(player: Player, props: Prop[], alpha: number = 0.3): number {
    const values = props.map(prop => prop.value);
    let smoothed = values[0];
    
    for (let i = 1; i < values.length; i++) {
      smoothed = alpha * values[i] + (1 - alpha) * smoothed;
    }

    return smoothed;
  }
}