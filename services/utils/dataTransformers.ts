// services/utils/dataTransformers.ts

/**
 * Utility functions for transforming and processing sports and betting data
 */
export const dataTransformers = {
    /**
     * Convert raw prop data into a standardized format
     * @param rawData - Unprocessed prop data from sports API
     * @returns Normalized prop data object
     */
    normalizePropData: (rawData: any) => {
      return {
        playerId: rawData.player_id || null,
        playerName: rawData.player_name || '',
        sport: rawData.sport || '',
        category: rawData.category || '',
        value: rawData.value || 0,
        odds: rawData.odds || [],
        timestamp: rawData.timestamp || new Date().toISOString()
      };
    },
  
    /**
     * Aggregate prop data across multiple sources
     * @param dataSources - Array of prop data from different sources
     * @returns Aggregated and averaged prop insights
     */
    aggregatePropInsights: (dataSources: any[]) => {
      const aggregatedData: any = {};
      
      dataSources.forEach(source => {
        Object.keys(source).forEach(key => {
          if (!aggregatedData[key]) {
            aggregatedData[key] = [];
          }
          aggregatedData[key].push(source[key]);
        });
      });
  
      // Calculate averages and consensus
      const processedData: any = {};
      Object.keys(aggregatedData).forEach(key => {
        const values = aggregatedData[key];
        processedData[key] = {
          average: values.reduce((a: number, b: number) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          consensus: values.length
        };
      });
  
      return processedData;
    },
  
    /**
     * Convert raw social media sentiment data to a consistent format
     * @param rawSentimentData - Social media sentiment input
     * @returns Normalized sentiment metrics
     */
    normalizeSentimentData: (rawSentimentData: any) => {
      return {
        playerName: rawSentimentData.player || '',
        positiveCount: rawSentimentData.positive || 0,
        negativeCount: rawSentimentData.negative || 0,
        neutralCount: rawSentimentData.neutral || 0,
        overallSentiment: rawSentimentData.overallScore || 0,
        timestamp: new Date().toISOString()
      };
    },
  
    /**
     * Flatten nested prop data for easier processing
     * @param nestedData - Deeply nested prop information
     * @returns Flattened data structure
     */
    flattenPropData: (nestedData: any): any => {
      const result: any = {};
  
      const flatten = (obj: any, prefix = '') => {
        Object.keys(obj).forEach(key => {
          const prefixedKey = prefix ? `${prefix}_${key}` : key;
          
          if (obj[key] !== null && typeof obj[key] === 'object') {
            flatten(obj[key], prefixedKey);
          } else {
            result[prefixedKey] = obj[key];
          }
        });
      };
  
      flatten(nestedData);
      return result;
    }
  };