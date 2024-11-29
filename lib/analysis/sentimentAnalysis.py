# lib/analysis/sentimentAnalysis.py

import re
import numpy as np
import pandas as pd
from typing import Dict, List, Any
from textblob import TextBlob

class SentimentAnalyzer:
    """
    Advanced sentiment analysis for sports and betting context
    """
    @staticmethod
    def analyze_social_sentiment(
        texts: List[str], 
        sports_context: bool = True
    ) -> Dict[str, Any]:
        """
        Perform multi-dimensional sentiment analysis
        
        Args:
            texts (List[str]): List of text for sentiment analysis
            sports_context (bool): Apply sports-specific sentiment weighting
        
        Returns:
            Dict with comprehensive sentiment analysis
        """
        if not texts:
            return {
                'overall_sentiment': 0,
                'sentiment_breakdown': {},
                'text_count': 0
            }
        
        # Sentiment scoring
        sentiments = [TextBlob(text).sentiment.polarity for text in texts]
        
        # Sports context adjustment
        if sports_context:
            sentiments = [
                sentiment * (1.2 if sentiment > 0 else 0.8) 
                for sentiment in sentiments
            ]
        
        # Categorize sentiments
        sentiment_categories = {
            'very_negative': [s for s in sentiments if s < -0.6],
            'negative': [s for s in sentiments if -0.6 <= s < -0.2],
            'neutral': [s for s in sentiments if -0.2 <= s <= 0.2],
            'positive': [s for s in sentiments if 0.2 < s <= 0.6],
            'very_positive': [s for s in sentiments if s > 0.6]
        }
        
        return {
            'overall_sentiment': np.mean(sentiments),
            'sentiment_breakdown': {
                category: len(scores) for category, scores in sentiment_categories.items()
            },
            'text_count': len(texts),
            'sentiment_std_dev': np.std(sentiments)
        }
    
    @staticmethod
    def extract_key_phrases(
        texts: List[str], 
        top_n: int = 10
    ) -> Dict[str, float]:
        """
        Extract and rank key phrases from text
        
        Args:
            texts (List[str]): Texts to analyze
            top_n (int): Number of top phrases to return
        
        Returns:
            Dict of key phrases with their importance scores
        """
        # Preprocessing
        cleaned_texts = [re.sub(r'[^\w\s]', '', text.lower()) for text in texts]
        
        # Phrase extraction
        all_phrases = [
            phrase.strip() 
            for text in cleaned_texts 
            for phrase in text.split() 
            if len(phrase) > 2
        ]
        
        # Phrase frequency and scoring
        phrase_freq = pd.Series(all_phrases).value_counts()
        
        return dict(phrase_freq.head(top_n))
    
    @staticmethod
    def sentiment_trend_analysis(
        sentiment_history: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Analyze sentiment trends over time
        
        Args:
            sentiment_history (pd.DataFrame): Historical sentiment data
        
        Returns:
            Dict with sentiment trend insights
        """
        if sentiment_history.empty:
            return {'trend_status': 'insufficient_data'}
        
        # Time-series sentiment analysis
        sentiment_history['sentiment_ewm'] = sentiment_history['sentiment'].ewm(
            span=5, 
            adjust=False
        ).mean()
        
        # Trend detection
        trend_slope, _ = np.polyfit(
            sentiment_history.index, 
            sentiment_history['sentiment_ewm'], 
            1
        )
        
        return {
            'trend_status': (
                'improving' if trend_slope > 0 else 
                'declining' if trend_slope < 0 else 
                'stable'
            ),
            'trend_slope': trend_slope,
            'volatility': sentiment_history['sentiment'].std()
        }