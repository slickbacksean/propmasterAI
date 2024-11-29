import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
from typing import List, Dict, Any

class SportsSentimentAnalyzer:
    def __init__(self, max_words: int = 10000, max_len: int = 200):
        """
        Initialize sentiment analysis model for sports context
        
        Args:
            max_words (int): Maximum number of words to keep in vocabulary
            max_len (int): Maximum length of input sequences
        """
        self.max_words = max_words
        self.max_len = max_len
        self.tokenizer = Tokenizer(num_words=max_words)
        self.model = None

    def preprocess_text(self, texts: List[str]) -> np.ndarray:
        """
        Preprocess text data for model input
        
        Args:
            texts (List[str]): List of text inputs
        
        Returns:
            np.ndarray: Tokenized and padded sequences
        """
        # Fit tokenizer on texts
        self.tokenizer.fit_on_texts(texts)
        
        # Convert texts to sequences
        sequences = self.tokenizer.texts_to_sequences(texts)
        
        # Pad sequences
        return pad_sequences(sequences, maxlen=self.max_len)

    def build_model(self, vocab_size: int) -> Sequential:
        """
        Build sentiment analysis LSTM model
        
        Args:
            vocab_size (int): Size of vocabulary
        
        Returns:
            Sequential: Compiled Keras model
        """
        model = Sequential([
            Embedding(vocab_size, 100, input_length=self.max_len),
            LSTM(128, return_sequences=True),
            Dropout(0.2),
            LSTM(64),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(1, activation='sigmoid')  # Binary sentiment classification
        ])
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model

    def train(self, texts: List[str], labels: np.ndarray):
        """
        Train the sentiment analysis model
        
        Args:
            texts (List[str]): Text data for training
            labels (np.ndarray): Corresponding sentiment labels
        """
        # Preprocess text
        X = self.preprocess_text(texts)
        
        # Get vocabulary size
        vocab_size = min(len(self.tokenizer.word_index) + 1, self.max_words)
        
        # Build and train model
        self.model = self.build_model(vocab_size)
        self.model.fit(X, labels, epochs=10, validation_split=0.2, batch_size=32)

    def predict_sentiment(self, texts: List[str]) -> np.ndarray:
        """
        Predict sentiment for input texts
        
        Args:
            texts (List[str]): Text data to classify
        
        Returns:
            np.ndarray: Sentiment scores (0-1)
        """
        if self.model is None:
            raise ValueError("Model must be trained before prediction")
        
        # Preprocess input texts
        X = self.preprocess_text(texts)
        
        # Predict sentiment
        return self.model.predict(X)

    def evaluate_model(self, texts: List[str], labels: np.ndarray) -> Dict[str, float]:
        """
        Evaluate model performance
        
        Args:
            texts (List[str]): Test texts
            labels (np.ndarray): Corresponding true labels
        
        Returns:
            Dict[str, float]: Performance metrics
        """
        X = self.preprocess_text(texts)
        
        # Evaluate model
        loss, accuracy = self.model.evaluate(X, labels)
        
        return {
            'loss': loss,
            'accuracy': accuracy
        }