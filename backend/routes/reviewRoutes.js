const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  submitReview,
  getAllReviewsAdmin,
  deleteReviewAdmin
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route: get reviews for specific product
router.get('/product/:productId', getProductReviews);

// Protected route: user submits or updates review
router.post('/', protect, submitReview);

// Admin routes
router.get('/admin/all', protect, admin, getAllReviewsAdmin);
router.delete('/admin/:id', protect, admin, deleteReviewAdmin);

module.exports = router;
