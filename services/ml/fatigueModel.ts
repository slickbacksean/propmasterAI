import { Player, FatigueModel, GameSchedule } from '../../types/players';
import { StatisticalAnalyzer } from '../analysis/statisticalAnalysis';
import { ProbabilityCalculator } from '../analysis/probabilityCalculations';

export class FatiguePredictor {
  /**
   * Predict player fatigue based on game schedule and performance history
   * @param player Player data
   * @param gameSchedule Recent and upcoming game schedules
   * @param performanceHistory Historical performance data
   * @returns Fatigue prediction model
   */
  static predictFatigue(
    player: Player, 
    gameSchedule: GameSchedule[], 
    performanceHistory: any[]
  ): FatigueModel {
    // Analyze game density and rest periods
    const gameDensityScore = this.calculateGameDensityScore(gameSchedule);
    
    // Analyze performance degradation
    const performanceAnalysis = StatisticalAnalyzer.analyzePlayerPerformance(
      performanceHistory.map(perf => ({
        value: perf.performanceMetric,
        timestamp: perf.timestamp
      }))
    );

    // Calculate fatigue probability
    const fatigueProbability = ProbabilityCalculator.calculateCustomPropProbability(
      player,
      performanceHistory,
      { gameDensity: gameDensityScore }
    );

    // Detailed fatigue breakdown
    return {
      playerId: player.id,
      gameDensityScore,
      restDays: this.calculateRestDays(gameSchedule),
      performanceModel: performanceAnalysis,
      fatigueRisk: this.calculateFatigueRisk(
        gameDensityScore, 
        performanceAnalysis, 
        fatigueProbability
      ),
      performanceDegradation: this.estimatePerformanceDegradation(
        performanceAnalysis, 
        gameDensityScore
      )
    };
  }

  /**
   * Calculate game density score based on recent schedule
   * @param gameSchedule Game schedule history
   * @returns Game density score (0-100)
   */
  private static calculateGameDensityScore(gameSchedule: GameSchedule[]): number {
    // Sort games by date
    const sortedSchedule = [...gameSchedule].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate days between games
    const daysBetweenGames = sortedSchedule.slice(1).map((game, index) => {
      const prevGame = sortedSchedule[index];
      const daysDiff = (new Date(game.date).getTime() - new Date(prevGame.date).getTime()) 
        / (1000 * 3600 * 24);
      return daysDiff;
    });

    // Higher score indicates less rest (more fatigue)
    const averageDaysBetweenGames = daysBetweenGames.length 
      ? daysBetweenGames.reduce((a, b) => a + b, 0) / daysBetweenGames.length 
      : 7; // Default to 7 days if no schedule

    // Inverse relationship: fewer days between games = higher fatigue score
    const gameDensityScore = Math.min(
      Math.max(100 - (averageDaysBetweenGames * 10), 0), 
      100
    );

    return gameDensityScore;
  }

  /**
   * Calculate consecutive rest days
   * @param gameSchedule Game schedule
   * @returns Number of consecutive rest days
   */
  private static calculateRestDays(gameSchedule: GameSchedule[]): number {
    const sortedSchedule = [...gameSchedule].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let maxRestDays = 0;
    let currentRestDays = 0;

    for (let i = 1; i < sortedSchedule.length; i++) {
      const daysBetween = (new Date(sortedSchedule[i].date).getTime() - 
        new Date(sortedSchedule[i-1].date).getTime()) / (1000 * 3600 * 24);
      
      if (daysBetween > 1) {
        currentRestDays = daysBetween - 1;
        maxRestDays = Math.max(maxRestDays, currentRestDays);
      }
    }

    return maxRestDays;
  }

  /**
   * Calculate fatigue risk based on multiple factors
   * @param gameDensityScore Game density score
   * @param performanceAnalysis Performance statistical model
   * @param fatigueProbability Fatigue probability
   * @returns Fatigue risk score (0-100)
   */
  private static calculateFatigueRisk(
    gameDensityScore: number, 
    performanceAnalysis: any, 
    fatigueProbability: any
  ): number {
    const { standardDeviation } = performanceAnalysis;
    const { probability } = fatigueProbability;

    // Composite fatigue risk calculation
    return Math.min(
      (gameDensityScore * 0.5) + 
      (standardDeviation * 10) + 
      (probability * 100 * 0.5),
      100
    );
  }

  /**
   * Estimate performance degradation due to fatigue
   * @param performanceAnalysis Performance statistical model
   * @param gameDensityScore Game density score
   * @returns Performance degradation percentage
   */
  private static estimatePerformanceDegradation(
    performanceAnalysis: any, 
    gameDensityScore: number
  ): number {
    const { mean, standardDeviation } = performanceAnalysis;

    // Performance degradation increases with game density
    const degradationFactor = gameDensityScore / 100;
    
    // Estimate performance drop based on standard deviation and game density
    return Math.min(
      (standardDeviation * degradationFactor * 2),
      mean * 0.3 // Cap performance drop at 30%
    );
  }

  /**
   * Recommend rest or load management
   * @param fatigueModel Fatigue prediction model
   * @returns Recommended actions
   */
  static recommendLoadManagement(fatigueModel: FatigueModel): string[] {
    const recommendations: string[] = [];

    if (fatigueModel.fatigueRisk > 70) {
      recommendations.push('Consider player rest');
    }

    if (fatigueModel.performanceDegradation > 0.2) {
      recommendations.push('Reduce playing time');
    }

    if (fatigueModel.restDays < 2) {
      recommendations.push('Implement active recovery protocol');
    }

    return recommendations.length 
      ? recommendations 
      : ['No specific load management required'];
  }
}