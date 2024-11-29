// services/utils/dateFormatters.ts

export const dateFormatters = {
    /**
     * Format date to a consistent readable format
     * @param date - Date object or date string
     * @param format - Desired output format
     * @returns Formatted date string
     */
    formatDate: (date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string => {
      const inputDate = typeof date === 'string' ? new Date(date) : date;
  
      switch (format) {
        case 'short':
          return inputDate.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit'
          });
        
        case 'long':
          return inputDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
        
        case 'time':
          return inputDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
      }
    },
  
    /**
     * Calculate days between two dates
     * @param startDate - First date
     * @param endDate - Second date
     * @returns Number of days between dates
     */
    daysBetween: (startDate: Date, endDate: Date): number => {
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      return Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / millisecondsPerDay));
    },
  
    /**
     * Check if a date is within a specific range
     * @param date - Date to check
     * @param startDate - Range start
     * @param endDate - Range end
     * @returns Boolean indicating if date is in range
     */
    isDateInRange: (date: Date, startDate: Date, endDate: Date): boolean => {
      return date >= startDate && date <= endDate;
    },
  
    /**
     * Get relative time description
     * @param date - Input date
     * @returns Human-readable relative time
     */
    getRelativeTime: (date: Date): string => {
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
      ];
  
      for (let interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
          return count === 1 
            ? `1 ${interval.label} ago` 
            : `${count} ${interval.label}s ago`;
        }
      }
  
      return 'just now';
    }
  };