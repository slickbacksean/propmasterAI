import { Player, Prop, PropStats, ProbabilityModel } from '../../types/props';
import { StatisticalUtils } from './statisticalUtils';

export class ProbabilityCalculator {
  /**
   * Calculate Bayesian probability for a custom prop
   * @param player Player data
   * @param propStats Historical prop statistics
   * @param customConditions Additional conditions for the prop
   * @returns Calculated probability and confidence score
   */
  static calculateCustomPropProbability(
    player: Player, 
    propStats: PropStats[], 
    customConditions?: Record<string, any>
  ): ProbabilityModel {
    // Base probability calculation using historical data
    const baseHistoricalProbability = this.calculateHistoricalProbability(propStats);
    
    // Adjust for custom conditions
    const adjustedProbability = customConditions 
      ? this.applyConditionalAdjustments(baseHistoricalProbability, customConditions)
      : baseHistoricalProbability;

    return {
      probability: adjustedProbability,
      confidenceScore: this.calculateConfidenceScore(propStats, customConditions)
    };
  }

  /**
   * Calculate historical probability based on past performance
   * @param propStats Historical prop statistics
   * @returns Base probability
   */
  private static calculateHistoricalProbability(propStats: PropStats[]): number {
    if (propStats.length === 0) return 0.5;

    const successfulProps = propStats.filter(stat => stat.hit);
    return successfulProps.length / propStats.length;
  }

  /**
   * Apply conditional adjustments to base probability
   * @param baseProbability Initial probability
   * @param conditions Custom conditions affecting probability
   * @returns Adjusted probability
   */
  private static applyConditionalAdjustments(
    baseProbability: number, 
    conditions: Record<string, any>
  ): number {
    let adjustmentFactor = 1;

    // Example adjustments - can be expanded based on specific use cases
    if (conditions.homeGame) adjustmentFactor *= 1.1;
    if (conditions.rivalTeam) adjustmentFactor *= 0.9;
    if (conditions.recentInjury) adjustmentFactor *= 0.8;

    return Math.min(Math.max(baseProbability * adjustmentFactor, 0), 1);
  }

  /**
   * Calculate confidence score for a probability estimate
   * @param propStats Historical prop statistics
   * @param conditions Additional conditions
   * @returns Confidence score between 0-100
   */
  private static calculateConfidenceScore(
    propStats: PropStats[], 
    conditions?: Record<string, any>
  ): number {
    const baseConfidence = propStats.length * 10; // More historical data increases confidence
    const conditionAdjustment = conditions ? Object.keys(conditions).length * 5 : 0;
    
    return Math.min(baseConfidence + conditionAdjustment, 100);
  }

  /**
   * Calculate compound probability for multi-variable props
   * @param individualProbabilities Array of individual probabilities
   * @returns Compound probability
   */
  static calculateCompoundProbability(individualProbabilities: number[]): number {
    // Uses Bayesian method for compound probability
    return individualProbabilities.reduce((acc, prob) => acc * prob, 1);
  }
}