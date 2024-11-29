import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from typing import List, Dict, Any

class PlayerTimeSeriesPredictor:
    def __init__(self, lookback_period: int = 10, forecast_horizon: int = 5):
        """
        Initialize the time series predictor for player performance
        
        Args:
            lookback_period (int): Number of previous periods to use for prediction
            forecast_horizon (int): Number of future periods to predict
        """
        self.lookback_period = lookback_period
        self.forecast_horizon = forecast_horizon
        self.model = None
        self.scaler = MinMaxScaler()

    def prepare_data(self, player_data: pd.DataFrame, target_column: str) -> tuple:
        """
        Prepare time series data for LSTM model
        
        Args:
            player_data (pd.DataFrame): DataFrame with player performance data
            target_column (str): Column to predict
        
        Returns:
            tuple: Preprocessed X and y data
        """
        # Normalize the data
        scaled_data = self.scaler.fit_transform(player_data[[target_column]])
        
        # Create sequences
        X, y = [], []
        for i in range(len(scaled_data) - self.lookback_period - self.forecast_horizon + 1):
            X.append(scaled_data[i:i+self.lookback_period])
            y.append(scaled_data[i+self.lookback_period:i+self.lookback_period+self.forecast_horizon].flatten())
        
        return np.array(X), np.array(y)

    def build_model(self, input_shape: tuple) -> Sequential:
        """
        Build LSTM model for time series prediction
        
        Args:
            input_shape (tuple): Shape of input data
        
        Returns:
            Sequential: Compiled Keras model
        """
        model = Sequential([
            LSTM(50, activation='relu', input_shape=input_shape, return_sequences=True),
            Dropout(0.2),
            LSTM(50, activation='relu'),
            Dropout(0.2),
            Dense(self.forecast_horizon)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def train(self, player_data: pd.DataFrame, target_column: str):
        """
        Train the time series model for a specific player
        
        Args:
            player_data (pd.DataFrame): DataFrame with player performance data
            target_column (str): Column to predict
        """
        X, y = self.prepare_data(player_data, target_column)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Build and train model
        self.model = self.build_model(input_shape=(X.shape[1], X.shape[2]))
        self.model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.2, verbose=0)

    def predict(self, player_data: pd.DataFrame, target_column: str) -> np.ndarray:
        """
        Make predictions for future periods
        
        Args:
            player_data (pd.DataFrame): DataFrame with player performance data
            target_column (str): Column to predict
        
        Returns:
            np.ndarray: Predicted values
        """
        if self.model is None:
            raise ValueError("Model must be trained before prediction")
        
        X, _ = self.prepare_data(player_data, target_column)
        predictions = self.model.predict(X)
        
        # Inverse transform predictions
        return self.scaler.inverse_transform(predictions)

    def evaluate_model(self, player_data: pd.DataFrame, target_column: str) -> Dict[str, float]:
        """
        Evaluate model performance
        
        Args:
            player_data (pd.DataFrame): DataFrame with player performance data
            target_column (str): Column to predict
        
        Returns:
            Dict[str, float]: Performance metrics
        """
        X, y = self.prepare_data(player_data, target_column)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Predict and calculate metrics
        y_pred = self.model.predict(X_test)
        mse = np.mean(np.square(y_test - y_pred))
        mae = np.mean(np.abs(y_test - y_pred))
        
        return {
            'mean_squared_error': mse,
            'mean_absolute_error': mae
        }