import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from typing import Dict, List, Any

class ClutchPerformancePredictor:
    def __init__(self, clutch_threshold: float = 0.7):
        """
        Initialize clutch performance prediction model
        
        Args:
            clutch_threshold (float): Threshold for defining clutch performance
        """
        self.clutch_threshold = clutch_threshold
        self.scaler = StandardScaler()
        self.model = None

    def define_clutch_performance(self, data: pd.DataFrame, performance_columns: List[str]) -> pd.Series:
        """
        Define clutch performance based on various metrics
        
        Args:
            data (pd.DataFrame): Player performance data
            performance_columns (List[str]): Columns to consider for clutch performance
        
        Returns:
            pd.Series: Binary clutch performance labels
        """
        # Compute normalized performance score
        performance_score = data[performance_columns].apply(
            lambda x: (x - x.min()) / (x.max()
            - x.min()) * 100, axis=0
        ).mean(axis=1)
        
        # Define clutch performance based on performance score and high-stakes conditions
        clutch_labels = (performance_score >= performance_score.quantile(self.clutch_threshold)).astype(int)
        
        return clutch_labels

    def prepare_features(self, data: pd.DataFrame, clutch_features: List[str]) -> np.ndarray:
        """
        Prepare and scale features for clutch performance prediction
        
        Args:
            data (pd.DataFrame): Player performance data
            clutch_features (List[str]): Features to use for prediction
        
        Returns:
            np.ndarray: Scaled feature matrix
        """
        # Select and scale features
        X = data[clutch_features]
        return self.scaler.fit_transform(X)

    def build_model(self, input_shape: int) -> Sequential:
        """
        Build neural network model for clutch performance prediction
        
        Args:
            input_shape (int): Number of input features
        
        Returns:
            Sequential: Compiled Keras model
        """
        model = Sequential([
            Dense(64, activation='relu', input_shape=(input_shape,)),
            Dropout(0.3),
            Dense(32, activation='relu'),
            Dropout(0.2),
            Dense(16, activation='relu'),
            Dense(1, activation='sigmoid')  # Binary classification
        ])
        
        model.compile(
            optimizer='adam', 
            loss='binary_crossentropy', 
            metrics=['accuracy']
        )
        
        return model

    def train(self, 
              data: pd.DataFrame, 
              clutch_features: List[str], 
              performance_columns: List[str]):
        """
        Train the clutch performance prediction model
        
        Args:
            data (pd.DataFrame): Player performance data
            clutch_features (List[str]): Features to use for prediction
            performance_columns (List[str]): Columns to define clutch performance
        """
        # Define clutch performance labels
        y = self.define_clutch_performance(data, performance_columns)
        
        # Prepare features
        X = self.prepare_features(data, clutch_features)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Build and train model
        self.model = self.build_model(input_shape=(X.shape[1],))
        
        # Class weights to handle potential imbalance
        class_weights = {
            0: 1.,
            1: len(y[y == 0]) / len(y[y == 1])
        }
        
        self.model.fit(
            X_train, y_train, 
            epochs=50, 
            batch_size=32, 
            validation_split=0.2,
            class_weight=class_weights,
            verbose=0
        )

    def predict_clutch_probability(self, data: pd.DataFrame, clutch_features: List[str]) -> np.ndarray:
        """
        Predict clutch performance probabilities
        
        Args:
            data (pd.DataFrame): Player performance data
            clutch_features (List[str]): Features to use for prediction
        
        Returns:
            np.ndarray: Predicted clutch performance probabilities
        """
        if self.model is None:
            raise ValueError("Model must be trained before prediction")
        
        # Prepare and scale features
        X = self.prepare_features(data, clutch_features)
        
        # Predict probabilities
        return self.model.predict(X)

    def evaluate_model(self, 
                       data: pd.DataFrame, 
                       clutch_features: List[str], 
                       performance_columns: List[str]) -> Dict[str, float]:
        """
        Evaluate model performance
        
        Args:
            data (pd.DataFrame): Player performance data
            clutch_features (List[str]): Features to use for prediction
            performance_columns (List[str]): Columns to define clutch performance
        
        Returns:
            Dict[str, float]: Model performance metrics
        """
        # Define clutch performance labels
        y = self.define_clutch_performance(data, performance_columns)
        
        # Prepare features
        X = self.prepare_features(data, clutch_features)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Predict and evaluate
        y_pred_proba = self.model.predict(X_test)
        y_pred = (y_pred_proba > 0.5).astype(int)
        
        # Compute various metrics
        from sklearn.metrics import (
            accuracy_score, 
            precision_score, 
            recall_score, 
            f1_score, 
            roc_auc_score, 
            confusion_matrix
        )
        
        return {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1_score': f1_score(y_test, y_pred),
            'roc_auc': roc_auc_score(y_test, y_pred_proba),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
        }

    def feature_importance(self, clutch_features: List[str]) -> Dict[str, float]:
        """
        Analyze feature importance for clutch performance prediction
        
        Args:
            clutch_features (List[str]): Features used in the model
        
        Returns:
            Dict[str, float]: Importance of each feature
        """
        if self.model is None:
            raise ValueError("Model must be trained before analyzing feature importance")
        
        # Extract weights from the first layer
        first_layer_weights = self.model.layers[0].get_weights()[0]
        
        # Compute absolute mean of weights for each feature
        feature_importance = np.abs(first_layer_weights).mean(axis=1)
        
        # Normalize to percentage
        feature_importance = feature_importance / feature_importance.sum() * 100
        
        return dict(zip(clutch_features, feature_importance))