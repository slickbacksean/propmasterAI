import { Player, ClutchPerformance, GameContext } from '../../types/players';
import { StatisticalAnalyzer } from '../analysis/statisticalAnalysis';
import { ProbabilityCalculator } from '../analysis/probabilityCalculations';

export class ClutchAnalyzer {
  /**
   * Analyze player's clutch performance
   * @param player Player data
   * @param historicalClutchData Historical clutch performance data
   * @returns Clutch performance model
   */
  static analyzeClutchPerformance(
    player: Player, 
    historicalClutchData: ClutchPerformance[]
  ): ClutchPerformanceModel {
    // Extract clutch scenario performances
    const clutchScenarios = this.extractClutchScenarios(historicalClutchData);

    // Calculate statistical model for clutch performances
    const clutchStatistics = StatisticalAnalyzer.analyzePlayerPerformance(
      clutchScenarios.map(scenario => ({
        value: scenario.performanceValue,
        timestamp: scenario.timestamp
      }))
    );

    // Calculate probability of high-performance in clutch scenarios
    const clutchProbability = ProbabilityCalculator.calculateCustomPropProbability(
      player, 
      clutchScenarios
    );

    return {
      playerId: player.id,
      clutchScenarios: clutchScenarios,
      performanceStatistics: clutchStatistics,
      clutchProbability: clutchProbability,
      clutchScore: this.calculateClutchScore(clutchStatistics, clutchProbability)
    };
  }

  /**
   * Extract and filter clutch performance scenarios
   * @param historicalData Historical performance data
   * @returns Filtered clutch scenarios
   */
  private static extractClutchScenarios(
    historicalData: ClutchPerformance[]
  ): ClutchPerformance[] {
    return historicalData.filter(scenario => 
      this.isClutchScenario(scenario)
    );
  }

  /**
   * Determine if a performance scenario is a clutch scenario
   * @param scenario Performance scenario
   * @returns Boolean indicating if it's a clutch scenario
   */
  private static isClutchScenario(scenario: ClutchPerformance): boolean {
    const CLUTCH_THRESHOLDS = {
      lastFiveMinutes: true,
      scoreDifferential: 5,
      playoffGame: true,
      finalQuarter: true
    };

    return (
      (scenario.gameContext.timeRemaining <= 300) || // Last 5 minutes
      (Math.abs(scenario.gameContext.scoreDifferential) <= CLUTCH_THRESHOLDS.scoreDifferential) ||
      scenario.gameContext.isPlayoffGame ||
      scenario.gameContext.period === 'finalQuarter'
    );
  }

  /**
   * Calculate comprehensive clutch performance score
   * @param clutchStatistics Clutch performance statistics
   * @param clutchProbability Clutch performance probability
   * @returns Clutch performance score
   */
  private static calculateClutchScore(
    clutchStatistics: any, 
    clutchProbability: any
  ): number {
    const { mean, standardDeviation } = clutchStatistics;
    const { probability, confidenceScore } = clutchProbability;

    // Weighted calculation of clutch score
    return (
      (mean * 0.4) + 
      (probability * 100 * 0.3) + 
      (confidenceScore * 0.3)
    );
  }

  /**
   * Predict performance in future clutch scenarios
   * @param player Player data
   * @param historicalClutchData Historical clutch performance
   * @param predictedGameContext Predicted game context
   * @returns Clutch performance prediction
   */
  static predictClutchPerformance(
    player: Player, 
    historicalClutchData: ClutchPerformance[],
    predictedGameContext?: GameContext
  ): ClutchPerformancePrediction {
    const clutchModel = this.analyzeClutchPerformance(player, historicalClutchData);

    // Adjust prediction based on predicted game context
    const contextAdjustedScore = predictedGameContext
      ?