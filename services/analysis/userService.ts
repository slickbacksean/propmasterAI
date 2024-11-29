import { User, UserPreferences, BettingProfile } from '../../types/props';
import { StatisticalAnalyzer } from './statisticalAnalysis';
import { ProbabilityCalculator } from './probabilityCalculations';

export class UserService {
  /**
   * Create a personalized betting profile based on user's historical performance
   * @param user User data
   * @param historicalBets User's historical betting data
   * @returns Personalized betting profile
   */
  static createBettingProfile(
    user: User, 
    historicalBets: any[]
  ): BettingProfile {
    const performanceAnalysis = StatisticalAnalyzer.analyzePlayerPerformance(
      historicalBets.map(bet => ({
        value: bet.amount,
        timestamp: bet.timestamp
      }))
    );

    return {
      userId: user.id,
      riskTolerance: this.calculateRiskTolerance(performanceAnalysis),
      preferredSports: this.identifyPreferredSports(historicalBets),
      recommendedBetTypes: this.recommendBetTypes(performanceAnalysis),
      performanceMetrics: performanceAnalysis
    };
  }

  /**
   * Calculate user's risk tolerance based on statistical performance
   * @param performanceModel Statistical performance model
   * @returns Risk tolerance score (0-100)
   */
  private static calculateRiskTolerance(performanceModel: any): number {
    const { volatility, standardDeviation } = performanceModel;
    
    // Lower volatility and standard deviation suggest lower risk tolerance
    const riskScore = 100 - (volatility + standardDeviation);
    return Math.max(Math.min(riskScore, 100), 0);
  }

  /**
   * Identify user's preferred sports based on betting history
   * @param historicalBets User's betting history
   * @returns Array of preferred sports
   */
  private static identifyPreferredSports(historicalBets: any[]): string[] {
    const sportCounts = historicalBets.reduce((acc, bet) => {
      acc[bet.sport] = (acc[bet.sport] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(sportCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
  }

  /**
   * Recommend bet types based on user's performance
   * @param performanceModel Statistical performance model
   * @returns Recommended bet types
   */
  private static recommendBetTypes(performanceModel: any): string[] {
    const { mean, standardDeviation } = performanceModel;
    
    const recommendations = [];
    
    if (mean > 0 && standardDeviation < 10) {
      recommendations.push('conservative_props');
    }
    
    if (mean > 50 && standardDeviation > 20) {
      recommendations.push('high_risk_props');
    }
    
    return recommendations.length ? recommendations : ['balanced_props'];
  }

  /**
   * Update user preferences
   * @param userId User identifier
   * @param newPreferences Updated preferences
   * @returns Updated user preferences
   */
  static updateUserPreferences(
    userId: string, 
    newPreferences: Partial<UserPreferences>
  ): UserPreferences {
    // This would typically involve a database update
    // For now, we'll simulate the update
    return {
      userId,
      ...newPreferences,
      lastUpdated: new Date()
    };
  }
}