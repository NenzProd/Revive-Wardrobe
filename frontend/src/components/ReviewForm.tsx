import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import StarRating from './StarRating';
import { X } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName,
  onClose,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
    // Get backendUrl and token from store
  const backendUrl = useCartStore(state => state.backendUrl);
  const token = useCartStore(state => state.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: 'Please select a rating',
        variant: 'destructive'
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: 'Please write a review with at least 10 characters',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!token) {
        toast({
          title: 'Please login to submit a review',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch(`${backendUrl}/api/review/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Review submitted successfully!',
          description: 'Thank you for your feedback.'
        });
        onReviewSubmitted();
        onClose();
      } else {
        toast({
          title: 'Failed to submit review',
          description: data.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error submitting review',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Product:</p>
            <p className="font-medium">{productName}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review *
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                maxLength={1000}
                className="resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {comment.length}/1000 characters
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-revive-red hover:bg-revive-red/90"
                disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;