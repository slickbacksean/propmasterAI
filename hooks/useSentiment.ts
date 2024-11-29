// hooks/useSentiment.ts
import { useState, useEffect } from 'react';
import { socialMedia } from '../services/api/socialMedia';
import { SentimentResult } from '../types/analysis';

export const useSentiment = (playerName: string) => {
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        setLoading(true);
        const sentimentData = await socialMedia.analyzeSentiment(playerName);
        setSentiment(sentimentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sentiment analysis failed');
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
  }, [playerName]);

  return { sentiment, loading, error };
};