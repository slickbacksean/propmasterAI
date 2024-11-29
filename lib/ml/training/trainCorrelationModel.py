import sys
import os
import numpy as np
import pandas as pd
import joblib
import json
from datetime import datetime

# Ensure the models directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.correlationModel import PlayerPropCorrelationAnalyzer

def load_player_data(data_path: str) -> pd.DataFrame:
    """
    Load player performance data from CSV
    
    Args:
        data_path (str): Path to player performance data CSV
    
    Returns:
        pd.DataFrame: Loaded player performance data
    """
    try:
        return pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_path}")
        sys.exit(1)

def train_correlation_analysis(
    data_path: str, 
    output_dir: str,
    correlation_threshold: float = 0.5
):
    """
    Perform correlation analysis and save results
    
    Args:
        data_path (str): Path to input data
        output_dir (str): Directory to save analysis results
        correlation_threshold (float): Threshold for significant correlations
    """
    # Load data
    player_data = load_player_data(data_path)
    
    # Initialize correlation analyzer
    correlation_analyzer = PlayerPropCorrelationAnalyzer(
        correlation_threshold=correlation_threshold
    )
    
    # Perform comprehensive correlation analysis
    analysis_results = correlation_analyzer.analyze_prop_relationships(player_data)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate unique filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Prepare serializable results
    serializable_results = {
        'correlation_matrix': analysis_results['correlation_matrix'].to_dict(),
        'significant_correlations': [
            {'feature1': f1, 'feature2': f2, 'correlation': float(corr)} 
            for f1, f2, corr in analysis_results['significant_correlations']
        ],
        'pca_results': {
            'explained_variance': analysis_results['pca_results']['explained_variance'].tolist(),
            'components': analysis_results['pca_results']['components'].tolist()
        },
        'mutual_information': analysis_results['mutual_information'].to_dict()
    }
    
    # Save results
    results_filename = os.path.join(output_dir, f"correlation_analysis_{timestamp}.json")
    with open(results_filename, 'w') as f:
        json.dump(serializable_results, f, indent=2)
    
    # Save PCA model for future use
    pca_model_filename = os.path.join(output_dir, f"pca_model_{timestamp}.joblib")
    joblib.dump(correlation_analyzer.pca, pca_model_filename)
    
    print(f"Correlation analysis results saved to: {results_filename}")
    print(f"PCA model saved to: {pca_model_filename}")
    
    # Return key insights
    return {
        'significant_correlations_count': len(serializable_results['significant_correlations']),
        'top_pca_variance': serializable_results['pca_results']['explained_variance'][:3]
    }

def main():
    # Example usage with command-line arguments
    if len(sys.argv) != 3:
        print("Usage: python train_correlation_model.py <data_path> <output_dir>")
        sys.exit(1)
    
    data_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    train_correlation_analysis(data_path, output_dir)

if __name__ == "__main__":
    main()