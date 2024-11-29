# lib/analysis/statisticalAnalysis.py

import numpy as np
import pandas as pd
import scipy.stats as stats
from typing import Dict, List, Any, Tuple

class StatisticalAnalyzer:
    """
    Advanced statistical analysis for prop bet modeling
    """
    @staticmethod
    def calculate_z_score(
        data: np.ndarray, 
        threshold_percentile: float = 0.95
    ) -> Dict[str, Any]:
        """
        Calculate Z-scores and identify statistical outliers
        
        Args:
            data (np.ndarray): Input numerical data
            threshold_percentile (float): Outlier threshold
        
        Returns:
            Dict with statistical outlier analysis
        """
        if len(data) == 0:
            return {'outliers': [], 'z_scores': []}
        
        mean = np.mean(data)
        std_dev = np.std(data)
        z_scores = (data - mean) / std_dev
        
        # Identify outliers
        threshold = stats.norm.ppf(threshold_percentile)
        outliers = data[np.abs(z_scores) > threshold]
        
        return {
            'mean': mean,
            'standard_deviation': std_dev,
            'outliers': list(outliers),
            'z_scores': list(z_scores),
            'outlier_indices': np.where(np.abs(z_scores) > threshold)[0].tolist()
        }
    
    @staticmethod
    def probabilistic_prop_model(
        historical_data: pd.DataFrame, 
        prop_metric: str
    ) -> Dict[str, Any]:
        """
        Create probabilistic model for prop bet predictions
        
        Args:
            historical_data (pd.DataFrame): Historical performance data
            prop_metric (str): Metric to model (e.g., 'points')
        
        Returns:
            Dict with probabilistic model insights
        """
        if historical_data.empty:
            return {'model_status': 'insufficient_data'}
        
        # Kernel Density Estimation
        kde = stats.gaussian_kde(historical_data[prop_metric])
        
        # Probability Distribution Analysis
        x_range = np.linspace(
            historical_data[prop_metric].min(), 
            historical_data[prop_metric].max(), 
            100
        )
        
        return {
            'distribution': {
                'x': list(x_range),
                'pdf': list(kde(x_range))
            },
            'mean': historical_data[prop_metric].mean(),
            'median': historical_data[prop_metric].median(),
            'mode': stats.mode(historical_data[prop_metric])[0][0],
            'standard_deviation': historical_data[prop_metric].std(),
            'skewness': historical_data[prop_metric].skew(),
            'kurtosis': historical_data[prop_metric].kurtosis()
        }
    
    @staticmethod
    def bayesian_probability_estimation(
        prior_prob: float, 
        evidence_data: List[float]
    ) -> Dict[str, float]:
        """
        Compute Bayesian probability estimates
        
        Args:
            prior_prob (float): Initial probability estimate
            evidence_data (List[float]): Additional evidence/data points
        
        Returns:
            Dict with Bayesian probability metrics
        """
        # Likelihood calculation
        likelihood = np.prod([
            stats.norm.pdf(x, loc=np.mean(evidence_data), scale=np.std(evidence_data)) 
            for x in evidence_data
        ])
        
        # Posterior probability
        posterior = (prior_prob * likelihood) / (
            (prior_prob * likelihood) + (1 - prior_prob)
        )
        
        return {
            'prior_probability': prior_prob,
            'likelihood': likelihood,
            'posterior_probability': posterior,
            'probability_shift': posterior - prior_prob
        }
    
    @staticmethod
    def multi_variable_correlation(
        data: pd.DataFrame, 
        variables: List[str]
    ) -> Dict[str, Any]:
        """
        Compute correlations between multiple variables
        
        Args:
            data (pd.DataFrame): Dataset for correlation analysis
            variables (List[str]): Variables to analyze
        
        Returns:
            Dict with correlation matrix and insights
        """
        if not all(var in data.columns for var in variables):
            return {'correlation_status': 'invalid_variables'}
        
        corr_matrix = data[variables].corr()
        
        return {
            'correlation_matrix': corr_matrix.to_dict(),
            'strongest_correlation': {
                'variables': corr_matrix.unstack().nlargest(1).index[0],
                'correlation_value': corr_matrix.unstack().nlargest(1)[0]
            }
        }