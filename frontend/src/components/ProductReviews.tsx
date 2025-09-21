import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '../stores/useCartStore';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { ShieldCheck, MessageSquare } from 'lucide-react';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { toast } = useToast();
  
  // Get backendUrl and token from store
  const backendUrl = useCartStore(state => state.backendUrl);
  const token = useCartStore(state => state.token);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/review/product/${productId}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/review/can-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ productId })
      });

      const data = await response.json();
      if (data.success) {
        setCanReview(data.canReview);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const fetchUserReview = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/review/user-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ productId })
      });

      const data = await response.json();
      if (data.success && data.review) {
        setUserReview(data.review);
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkCanReview();
    fetchUserReview();
  }, [productId]);

  const handleReviewSubmitted = () => {
    fetchReviews();
    checkCanReview();
    fetchUserReview();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingPercentage = (rating: number) => {
    if (!summary || summary.totalReviews === 0) return 0;
    return (summary.ratingDistribution[rating] / summary.totalReviews) * 100;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {summary && summary.totalReviews > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {summary.averageRating.toFixed(1)}
              </div>
              <StarRating rating={summary.averageRating} readonly size="lg" />
              <div className="text-sm text-gray-600 mt-1">
                Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-3">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getRatingPercentage(rating)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {summary.ratingDistribution[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare size={20} />
          Customer Reviews
          {summary && (
            <span className="text-sm font-normal text-gray-600">
              ({summary.totalReviews})
            </span>
          )}
        </h3>
        
        {canReview && !userReview && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-revive-red hover:bg-revive-red/90"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* User's Review */}
      {userReview && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-blue-800">Your Review</span>
            <ShieldCheck size={16} className="text-blue-600" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={userReview.rating} readonly size="sm" />
            <span className="text-sm text-gray-600">
              {formatDate(userReview.createdAt)}
            </span>
          </div>
          <p className="text-gray-700">{userReview.comment}</p>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {review.userName}
                    </span>
                    {review.isVerifiedPurchase && (
                      <div className="flex items-center gap-1 text-green-600">
                        <ShieldCheck size={14} />
                        <span className="text-xs">Verified Purchase</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} readonly size="sm" />
                    <span className="text-sm text-gray-600">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          productName={productName}
          onClose={() => setShowReviewForm(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

// Import Star component
const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default ProductReviews;