import sys
import os
import numpy as np
import pandas as pd
import joblib
from datetime import datetime

# Ensure the models directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.timeSeriesModel import PlayerTimeSeriesPredictor

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

def train_time_series_model(
    data_path: str, 
    target_column: str, 
    output_dir: str
):
    """
    Train and save time series prediction model
    
    Args:
        data_path (str): Path to input data
        target_column (str): Column to predict
        output_dir (str): Directory to save trained model
    """
    # Load data
    player_data = load_player_data(data_path)
    
    # Initialize and train model
    predictor = PlayerTimeSeriesPredictor()
    predictor.train(player_data, target_column)
    
    # Evaluate model
    performance_metrics = predictor.evaluate_model(player_data, target_column)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate unique filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_filename = os.path.join(output_dir, f"time_series_model_{timestamp}.joblib")
    metrics_filename = os.path.join(output_dir, f"time_series_metrics_{timestamp}.json")
    
    # Save model
    joblib.dump(predictor, model_filename)
    
    # Save performance metrics
    import json
    with open(metrics_filename, 'w') as f:
        json.dump({k: float(v) for k, v in performance_metrics.items()}, f)
    
    print(f"Model saved to: {model_filename}")
    print(f"Performance Metrics: {performance_metrics}")

def main():
    # Example usage with command-line arguments
    if len(sys.argv) != 4:
        print("Usage: python train_time_series_model.py <data_path> <target_column> <output_dir>")
        sys.exit(1)
    
    data_path = sys.argv[1]
    target_column = sys.argv[2]
    output_dir = sys.argv[3]
    
    train_time_series_model(data_path, target_column, output_dir)

if __name__ == "__main__":
    main()