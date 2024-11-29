// services/utils/validation.ts

/**
 * Comprehensive validation utility for PropMaster AI
 */
export const validation = {
    /**
     * Validate prop bet input
     * @param propData - Prop bet data to validate
     * @returns Validation result with errors
     */
    validatePropBet: (propData: any) => {
      const errors: string[] = [];
  
      // Required fields validation
      const requiredFields = [
        'playerId', 'playerName', 'sport', 
        'category', 'value', 'odds'
      ];
  
      requiredFields.forEach(field => {
        if (!propData[field]) {
          errors.push(`${field} is required`);
        }
      });
  
      // Value range validations
      if (propData.value !== undefined) {
        if (typeof propData.value !== 'number') {
          errors.push('Value must be a number');
        }
        if (propData.value < 0) {
          errors.push('Value cannot be negative');
        }
      }
  
      // Odds validation
      if (propData.odds && !Array.isArray(propData.odds)) {
        errors.push('Odds must be an array');
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    },
  
    /**
     * Sanitize and clean input data
     * @param data - Input data to sanitize
     * @returns Sanitized data
     */
    sanitizeData: (data: any) => {
      const sanitized: any = {};
  
      Object.keys(data).forEach(key => {
        // Remove null or undefined values
        if (data[key] !== null && data[key] !== undefined) {
          // Trim string values
          if (typeof data[key] === 'string') {
            sanitized[key] = data[key].trim();
          } 
          // Handle numbers
          else if (typeof data[key] === 'number') {
            sanitized[key] = Number(data[key].toFixed(2));
          }
          // Deep copy for objects and arrays
          else if (typeof data[key] === 'object') {
            sanitized[key] = JSON.parse(JSON.stringify(data[key]));
          }
          else {
            sanitized[key] = data[key];
          }
        }
      });
  
      return sanitized;
    },
  
    /**
     * Validate player performance data
     * @param performanceData - Player performance metrics
     * @returns Validation result
     */
    validatePlayerPerformance: (performanceData: any) => {
      const errors: string[] = [];
  
      const requiredMetrics = [
        'points', 'rebounds', 'assists', 
        'fieldGoalPercentage', 'playTime'
      ];
  
      requiredMetrics.forEach(metric => {
        if (performanceData[metric] === undefined) {
          errors.push(`Missing performance metric: ${metric}`);
        }
      });
  
      // Range checks
      if (performanceData.points && 
          (performanceData.points < 0 || performanceData.points > 100)) {
        errors.push('Invalid points range');
      }
  
      if (performanceData.fieldGoalPercentage && 
          (performanceData.fieldGoalPercentage < 0 || 
           performanceData.fieldGoalPercentage > 100)) {
        errors.push('Invalid field goal percentage');
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    },
  
    /**
     * Email validation
     * @param email - Email address to validate
     * @returns Boolean indicating email validity
     */
    isValidEmail: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  
    /**
     * Validate betting limits and constraints
     * @param betAmount - Proposed bet amount
     * @param userBalance - User's current balance
     * @returns Validation result
     */
    validateBetConstraints: (
      betAmount: number, 
      userBalance: number, 
      minBet: number = 1, 
      maxBet: number = 1000
    ) => {
      const errors: string[] = [];
  
      if (betAmount < minBet) {
        validateBetConstraints: (
            betAmount: number, 
            userBalance: number, 
            minBet: number = 1, 
            maxBet: number = 1000
          ) => {
            const errors: string[] = [];
        
            if (betAmount < minBet) {
              errors.push(`Bet amount must be at least $${minBet}`);
            }
        
            if (betAmount > maxBet) {
              errors.push(`Bet amount cannot exceed $${maxBet}`);
            }
        
            if (betAmount > userBalance) {
              errors.push('Insufficient balance for this bet');
            }
        
            return {
              isValid: errors.length === 0,
              errors
            };
          },
        
          /**
           * Validate API request parameters
           * @param params - Request parameters
           * @param requiredKeys - Keys that must be present
           * @returns Validation result
           */
          validateApiParams: (
            params: Record<string, any>, 
            requiredKeys: string[] = []
          ) => {
            const errors: string[] = [];
        
            requiredKeys.forEach(key => {
              if (params[key] === undefined || params[key] === null) {
                errors.push(`Missing required parameter: ${key}`);
              }
            });
        
            // Optional type checking
            Object.keys(params).forEach(key => {
              const value = params[key];
              
              // Add specific type validations as needed
              if (key.includes('Id') && typeof value !== 'string') {
                errors.push(`${key} must be a string`);
              }
        
              if (key.includes('Count') && typeof value !== 'number') {
                errors.push(`${key} must be a number`);
              }
            });
        
            return {
              isValid: errors.length === 0,
              errors
            };
          },
        
          /**
           * Validate password strength
           * @param password - Password to validate
           * @returns Validation result with strength metrics
           */
          validatePassword: (password: string) => {
            const errors: string[] = [];
            let strength = 0;
        
            // Minimum length
            if (password.length < 8) {
              errors.push('Password must be at least 8 characters long');
            } else {
              strength += 1;
            }
        
            // Uppercase check
            if (!/[A-Z]/.test(password)) {
              errors.push('Password must contain at least one uppercase letter');
            } else {
              strength += 1;
            }
        
            // Lowercase check
            if (!/[a-z]/.test(password)) {
              errors.push('Password must contain at least one lowercase letter');
            } else {
              strength += 1;
            }
        
            // Number check
            if (!/[0-9]/.test(password)) {
              errors.push('Password must contain at least one number');
            } else {
              strength += 1;
            }
        
            // Special character check
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
              errors.push('Password must contain at least one special character');
            } else {
              strength += 1;
            }
        
            // Strength categorization
            const strengthLabel = 
              strength <= 1 ? 'Very Weak' :
              strength <= 2 ? 'Weak' :
              strength <= 3 ? 'Medium' :
              strength <= 4 ? 'Strong' : 
              'Very Strong';
        
            return {
              isValid: errors.length === 0,
              errors,
              strength,
              strengthLabel
            };
          },
        
          /**
           * Validate numeric range
           * @param value - Number to validate
           * @param options - Validation options
           * @returns Validation result
           */
          validateNumericRange: (
            value: number, 
            options: {
              min?: number, 
              max?: number, 
              integer?: boolean
            } = {}
          ) => {
            const errors: string[] = [];
        
            // Integer check
            if (options.integer && !Number.isInteger(value)) {
              errors.push('Value must be an integer');
            }
        
            // Minimum value check
            if (options.min !== undefined && value < options.min) {
              errors.push(`Value must be at least ${options.min}`);
            }
        
            // Maximum value check
            if (options.max !== undefined && value > options.max) {
              errors.push(`Value must not exceed ${options.max}`);
            }
        
            return {
              isValid: errors.length === 0,
              errors
            };
          }
        };
        
        // Export the entire validation utility
        export default validation;