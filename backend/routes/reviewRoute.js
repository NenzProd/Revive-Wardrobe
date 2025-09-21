import express from 'express';
import { createReview, getProductReviews, canUserReview, getUserReview } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

// Create a new review (requires authentication)
reviewRouter.post('/create', authUser, createReview);

// Get all reviews for a product (public)
reviewRouter.get('/product/:productId', getProductReviews);

// Check if user can review a product (requires authentication)
reviewRouter.post('/can-review', authUser, canUserReview);

// Get user's review for a specific product (requires authentication)
reviewRouter.post('/user-review', authUser, getUserReview);

export default reviewRouter;