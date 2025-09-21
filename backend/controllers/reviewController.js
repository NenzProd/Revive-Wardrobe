import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Create a new review
const createReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    // Validate required fields
    if (!userId || !productId || !rating || !comment) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Check if user has already reviewed this product
    const existingReview = await reviewModel.findOne({ userId, productId });
    if (existingReview) {
      return res.json({ success: false, message: "You have already reviewed this product" });
    }

    // Check if user has purchased this product
    const userOrders = await orderModel.find({ 
      userId, 
      status: { $in: ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"] }
    });

    let hasPurchased = false;
    let purchaseOrderId = "";

    for (const order of userOrders) {
      const hasProduct = order.line_items.some(item => item.product_id === productId);
      if (hasProduct) {
        hasPurchased = true;
        purchaseOrderId = order._id.toString();
        break;
      }
    }

    if (!hasPurchased) {
      return res.json({ success: false, message: "You can only review products you have purchased" });
    }

    // Create new review
    const newReview = new reviewModel({
      userId,
      productId,
      rating: parseInt(rating),
      comment: comment.trim(),
      userName: user.name,
      userEmail: user.email,
      isVerifiedPurchase: true,
      orderId: purchaseOrderId
    });

    await newReview.save();

    res.json({ 
      success: true, 
      message: "Review submitted successfully",
      review: {
        _id: newReview._id,
        rating: newReview.rating,
        comment: newReview.comment,
        userName: newReview.userName,
        isVerifiedPurchase: newReview.isVerifiedPurchase,
        createdAt: newReview.createdAt
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const reviews = await reviewModel.find({ productId })
      .sort({ createdAt: -1 })
      .select('rating comment userName isVerifiedPurchase createdAt');

    // Calculate average rating and rating distribution
    const totalReviews = reviews.length;
    let averageRating = 0;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (totalReviews > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = (totalRating / totalReviews).toFixed(1);
      
      reviews.forEach(review => {
        ratingDistribution[review.rating]++;
      });
    }

    res.json({ 
      success: true, 
      reviews,
      summary: {
        totalReviews,
        averageRating: parseFloat(averageRating),
        ratingDistribution
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Check if user can review a product
const canUserReview = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.json({ success: false, message: "User ID and Product ID are required" });
    }

    // Check if user has already reviewed this product
    const existingReview = await reviewModel.findOne({ userId, productId });
    if (existingReview) {
      return res.json({ 
        success: true, 
        canReview: false, 
        reason: "already_reviewed",
        message: "You have already reviewed this product"
      });
    }

    // Check if user has purchased this product
    const userOrders = await orderModel.find({ 
      userId, 
      status: { $in: ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"] }
    });

    let hasPurchased = false;
    for (const order of userOrders) {
      const hasProduct = order.line_items.some(item => item.product_id === productId);
      if (hasProduct) {
        hasPurchased = true;
        break;
      }
    }

    if (!hasPurchased) {
      return res.json({ 
        success: true, 
        canReview: false, 
        reason: "not_purchased",
        message: "You can only review products you have purchased"
      });
    }

    res.json({ 
      success: true, 
      canReview: true, 
      message: "You can review this product"
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user's review for a specific product
const getUserReview = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.json({ success: false, message: "User ID and Product ID are required" });
    }

    const review = await reviewModel.findOne({ userId, productId })
      .select('rating comment createdAt updatedAt');

    if (!review) {
      return res.json({ success: true, review: null });
    }

    res.json({ success: true, review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  createReview,
  getProductReviews,
  canUserReview,
  getUserReview
};