import sys
import os
import numpy as np
import pandas as pd
import joblib
from datetime import datetime

# Ensure the models directory is in the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.sentimentModel import SportsSentimentAnalyzer

def load_sentiment_data(data_path: str) -> tuple:
    """
    Load sports sentiment data from CSV
    
    Args:
        data_path (str): Path to sentiment data CSV
    
    Returns:
        tuple: Texts and labels
    """
    try:
        data = pd.read_csv(data_path)
        return data['text'].tolist(), data['sentiment'].to_numpy()
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_path}")
        sys.exit(1)
    except KeyError as e:
        print(f"Error: Missing required columns in CSV - {e}")
        sys.exit(1)

def train_sentiment_model(
    data_path: str, 
    output_dir: str,
    max_words: int = 10000,
    max_len: int = 200
):
    """
    Train and save sentiment analysis model
    
    Args:
        data_path (str): Path to input data
        output_dir (str): Directory to save trained model
        max_words (int): Maximum vocabulary size
        max_len (int): Maximum sequence length
    """
    # Load data
    texts, labels = load_sentiment_data(data_path)
    
    # Initialize and train model
    sentiment_analyzer = SportsSentimentAnalyzer(
        max_words=max_words, 
        max_len=max_len
    )
    sentiment_analyzer.train(texts, labels)
    
    # Evaluate model
    performance_metrics = sentiment_analyzer.evaluate_model(texts, labels)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate unique filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_filename = os.path.join(output_dir, f"sentiment_model_{timestamp}.joblib")
    metrics_filename = os.path.join(output_dir, f"sentiment_metrics_{timestamp}.json")
    tokenizer_filename = os.path.join(output_dir, f"sentiment_tokenizer_{timestamp}.joblib")
    
    # Save model, metrics, and tokenizer
    joblib.dump(sentiment_analyzer.model, model_filename)
    joblib.dump(sentiment_analyzer.tokenizer, tokenizer_filename)
    
    # Save performance metrics
    import json
    with open(metrics_filename, 'w') as f:
        json.dump({k: float(v) for k, v in performance_metrics.items()}, f)
    
    print(f"Model saved to: {model_filename}")
    print(f"Tokenizer saved to: {tokenizer_filename}")
    print(f"Performance Metrics: {performance_metrics}")

def main():
    # Example usage with command-line arguments
    if len(sys.argv) != 3:
        print("Usage: python train_sentiment_model.py <data_path> <output_dir>")
        sys.exit(1)
    
    data_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    train_sentiment_model(data_path, output_dir)

if __name__ == "__main__":
    main()