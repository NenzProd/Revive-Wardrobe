import { useState, useEffect } from 'react';
import { useCartStore } from '../stores/useCartStore';

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

export const useReviewSummary = (productId: string) => {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const backendUrl = useCartStore(state => state.backendUrl);

  useEffect(() => {
    const fetchReviewSummary = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${backendUrl}/api/review/product/${productId}`);
        const data = await response.json();

        if (data.success && data.summary) {
          setSummary(data.summary);
        } else {
          setSummary(null);
        }
      } catch (err) {
        console.error('Error fetching review summary:', err);
        setError('Failed to fetch reviews');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewSummary();
  }, [productId, backendUrl]);

  return { summary, loading, error };
};