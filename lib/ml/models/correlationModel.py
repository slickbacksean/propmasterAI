import numpy as np
import pandas as pd
import scipy.stats as stats
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from typing import Dict, List, Tuple

class PlayerPropCorrelationAnalyzer:
    def __init__(self, correlation_threshold: float = 0.5):
        """
        Initialize correlation analysis for player props
        
        Args:
            correlation_threshold (float): Threshold for significant correlations
        """
        self.correlation_threshold = correlation_threshold
        self.scaler = StandardScaler()
        self.pca = PCA()

    def preprocess_data(self, data: pd.DataFrame) -> np.ndarray:
        """
        Preprocess data for correlation and dimensionality reduction
        
        Args:
            data (pd.DataFrame): Input player performance data
        
        Returns:
            np.ndarray: Scaled and processed data
        """
        # Scale the data
        scaled_data = self.scaler.fit_transform(data)
        return scaled_data

    def compute_correlation_matrix(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Compute correlation matrix for player prop features
        
        Args:
            data (pd.DataFrame): Input player performance data
        
        Returns:
            pd.DataFrame: Correlation matrix
        """
        return data.corr(method='pearson')

    def find_significant_correlations(self, correlation_matrix: pd.DataFrame) -> List[Tuple[str, str, float]]:
        """
        Find statistically significant correlations
        
        Args:
            correlation_matrix (pd.DataFrame): Correlation matrix
        
        Returns:
            List[Tuple[str, str, float]]: List of (feature1, feature2, correlation_value)
        """
        significant_correlations = []
        for i in range(len(correlation_matrix.columns)):
            for j in range(i+1, len(correlation_matrix.columns)):
                corr_value = correlation_matrix.iloc[i, j]
                if abs(corr_value) >= self.correlation_threshold:
                    significant_correlations.append(
                        (correlation_matrix.columns[i], 
                         correlation_matrix.columns[j], 
                         corr_value)
                    )
        return significant_correlations

    def perform_pca(self, data: pd.DataFrame) -> Dict[str, np.ndarray]:
        """
        Perform Principal Component Analysis
        
        Args:
            data (pd.DataFrame): Input player performance data
        
        Returns:
            Dict[str, np.ndarray]: PCA results
        """
        scaled_data = self.preprocess_data(data)
        
        # Fit PCA
        self.pca.fit(scaled_data)
        
        # Compute explained variance
        explained_variance = self.pca.explained_variance_ratio_
        
        # Transform data
        transformed_data = self.pca.transform(scaled_data)
        
        return {
            'transformed_data': transformed_data,
            'explained_variance': explained_variance,
            'components': self.pca.components_
        }

    def compute_mutual_information(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Compute mutual information between features
        
        Args:
            data (pd.DataFrame): Input player performance data
        
        Returns:
            pd.DataFrame: Mutual information matrix
        """
        # Discretize continuous data for mutual information
        discretized_data = data.apply(pd.cut, bins=10)
        
        # Compute mutual information
        mi_matrix = pd.DataFrame(
            index=data.columns,
            columns=data.columns,
            data=np.zeros((len(data.columns), len(data.columns)))
        )
        
        for col1 in data.columns:
            for col2 in data.columns:
                mi_matrix.loc[col1, col2] = stats.mutual_info_score(
                    discretized_data[col1], 
                    discretized_data[col2]
                )
        
        return mi_matrix

    def analyze_prop_relationships(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Comprehensive analysis of player prop relationships
        
        Args:
            data (pd.DataFrame): Input player performance data
        
        Returns:
            Dict[str, Any]: Comprehensive correlation analysis results
        """
        # Compute correlation matrix
        correlation_matrix = self.compute_correlation_matrix(data)
        
        # Find significant correlations
        significant_correlations = self.find_significant_correlations(correlation_matrix)
        
        # Perform PCA
        pca_results = self.perform_pca(data)
        
        # Compute mutual information
        mutual_info_matrix = self.compute_mutual_information(data)
        
        return {
            'correlation_matrix': correlation_matrix,
            'significant_correlations': significant_correlations,
            'pca_results': pca_results,
            'mutual_information': mutual_info_matrix
        }