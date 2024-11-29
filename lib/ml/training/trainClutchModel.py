import sys
import os
import numpy as np
import pandas as pd
import joblib
import json
from datetime import datetime

# Ensure the models directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.clutchModel import ClutchPerformancePredictor

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

def train_clutch_performance_model(
    data_path: str, 
    output_dir: str,
    clutch_features: list = None,
    performance_columns: list = None,
    clutch_threshold: float = 0.7
):
    """
    Train and save clutch performance prediction model
    
    Args:
        data_path (str): Path to input data
        output_dir (str): Directory to save trained model
        clutch_features (list): Features to use for prediction
        performance_columns (list): Columns to define clutch performance
        clutch_threshold (float): Threshold for defining clutch performance
    """
    # Load data
    player_data = load_player_data(data_path)
    
    # Set default features if not provided
    if clutch_features is None:
        clutch_features = [
            'points_in_close_games', 
            'fourth_quarter_performance', 
            'game_winning_shots'
        ]
    
    if performance_columns is None:
        performance_columns = ['points', 'assists', 'rebounds']
    
    # Initialize and train model
    clutch_predictor = ClutchPerformancePredictor(clutch_threshold=clutch_threshold)
    clutch_predictor.train(player_data, clutch_features, performance_columns)
    
    # Evaluate model
    performance_metrics = clutch_predictor.evaluate_model(
        player_data, 
        clutch_features, 
        performance_columns
    )
    
    # Analyze feature importance
    feature_importance = clutch_predictor.feature_importance(clutch_features)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate unique filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_filename = os.path.join(output_dir, f"clutch_model_{timestamp}.joblib")
    metrics_filename = os.path.join(output_dir, f"clutch_metrics_{timestamp}.json")
    feature_importance_filename = os.path.join(output_dir, f"feature_importance_{timestamp}.json")
    
    # Save model
    joblib.dump(clutch_predictor, model_filename)
    
    # Save performance metrics
    with open(metrics_filename, 'w') as f:
        json.dump({k: float(v) for k, v in performance_metrics.items()}, f)
    
    # Save feature importance
    with open(feature_importance_filename, 'w') as f:
        json.dump({k: float(v) for k, v in feature_importance.items()}, f)
    
    print(f"Model saved to: {model_filename}")
    print(f"Performance Metrics saved to: {metrics_filename}")
    print(f"Feature Importance saved to: {feature_importance_filename}")
    
    # Return key insights
    return {
        'model_path': model_filename,
        'accuracy': performance_metrics['accuracy'],
        'feature_importance': dict(feature_importance)
    }

def main():
    # Example usage with command-line arguments
    if len(sys.argv) < 3:
        print("Usage: python train_clutch_model.py <data_path> <output_dir> [clutch_threshold]")
        sys.exit(1)
    
    data_path = sys.argv[1]
    output_dir = sys.argv[2]
    clutch_threshold = float(sys.argv[3]) if len(sys.argv) > 3 else 0.7
    
    train_clutch_performance_model(
        data_path, 
        output_dir, 
        clutch_threshold=clutch_threshold
    )

if __name__ == "__main__":
    main()