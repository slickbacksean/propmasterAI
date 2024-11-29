import { SentimentData, SocialMediaPost } from '../types/analysis';
import { Player } from '../types/players';

export class SentimentAnalyzer {
  /**
   * Analyze sentiment from social media posts about a player
   * @param posts Array of social media posts
   * @param player Player to analyze sentiment for
   * @returns Comprehensive sentiment analysis
   */
  static analyzeSentiment(posts: SocialMediaPost[], player: Player): SentimentAnalysis {
    if (posts.length === 0) {
      return this.defaultSentimentAnalysis(player);
    }

    const sentimentScores = posts.map(this.calculatePostSentiment);
    
    return {
      playerId: player.id,
      playerName: player.name,
      totalPosts: posts.length,
      sentimentDistribution: this.calculateSentimentDistribution(sentimentScores),
      avgSentimentScore: this.calculateAverageSentiment(sentimentScores),
      keyTopics: this.extractKeyTopics(posts),
      performanceCorrelation: this.correlateWithPerformance(sentimentScores, player)
    };
  }

  /**
   * Calculate sentiment score for an individual post
   * @param post Social media post
   * @returns Sentiment score (-1 to 1)
   */
  private static calculatePostSentiment(post: SocialMediaPost): number {
    // Basic NLP-like sentiment scoring
    const positiveWords = ['great', 'amazing', 'fantastic', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'worst', 'horrible'];

    const text = post.content.toLowerCase();
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;

    return (positiveCount - negativeCount) / (positiveCount + negativeCount + 1);
  }

  /**
   * Calculate sentiment distribution
   * @param sentimentScores Array of sentiment scores
   * @returns Sentiment distribution breakdown
   */
  private static calculateSentimentDistribution(sentimentScores: number[]): SentimentDistribution {
    return {
      positive: sentimentScores.filter(score => score > 0.2).length / sentimentScores.length,
      neutral: sentimentScores.filter(score => Math.abs(score) <= 0.2).length / sentimentScores.length,
      negative: sentimentScores.filter(score => score < -0.2).length / sentimentScores.length
    };
  }

  /**
   * Calculate average sentiment score
   * @param sentimentScores Array of sentiment scores
   * @returns Average sentiment score
   */
  private static calculateAverageSentiment(sentimentScores: number[]): number {
    return sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
  }

  /**
   * Extract key discussion topics from posts
   * @param posts Social media posts
   * @returns Array of key topics
   */
  private static extractKeyTopics(posts: SocialMediaPost[]): string[] {
    // Simplified topic extraction
    const topicKeywords: {[key: string]: string[]} = {
      'performance': ['stats', 'game', 'play', 'score'],
      'injury': ['hurt', 'injury', 'recovery'],
      'team': ['trade', 'contract', 'team']
    };

    const topicCounts: {[key: string]: number} = {};

    posts.forEach(post => {
      const text = post.content.toLowerCase();
      Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword))) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        }
      });
    });

    return Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  /**
   * Correlate sentiment with player performance
   * @param sentimentScores Sentiment scores
   * @param player Player data
   * @returns Performance correlation score
   */
  private static correlateWithPerformance(sentimentScores: number[], player: Player): number {
    // Placeholder correlation logic
    const avgSentiment = this.calculateAverageSentiment(sentimentScores);
    const recentPerformanceScore = player.recentStats?.performanceIndex || 0;
    
    return Math.abs(avgSentiment - recentPerformanceScore);
  }

  /**
   * Provide default sentiment analysis if no posts are available
   * @param player Player to generate default analysis for
   * @returns Default sentiment analysis object
   */
  private static defaultSentimentAnalysis(player: Player): SentimentAnalysis {
    return {
      playerId: player.id,
      playerName: player.name,
      totalPosts: 0,
      sentimentDistribution: {
        positive: 0.5,
        neutral: 0.3,
        negative: 0.2
      },
      avgSentimentScore: 0,
      keyTopics: [],
      performanceCorrelation: 0
    };
  }
}

// Type definitions for clarity
interface SentimentAnalysis {
  playerId: string;
  playerName: string;
  totalPosts: number;
  sentimentDistribution: SentimentDistribution;
  avgSentimentScore: number;
  keyTopics: string[];
  performanceCorrelation: number;
}

interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export default SentimentAnalyzer;