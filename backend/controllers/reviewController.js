const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all reviews and rating summary for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const count = reviews.length;
    let averageRating = 0;

    if (count > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      averageRating = Number((sum / count).toFixed(1));
    }

    res.json({
      reviews,
      count,
      averageRating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit or update a product review (1 review per user + product)
// @route   POST /api/reviews
// @access  Private (Logged-in user)
const submitReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Please provide a star rating between 1 and 5' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Please provide feedback in your review' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Shoe product not found' });
    }

    // Upsert review (create or update if already reviewed)
    const review = await Review.findOneAndUpdate(
      { product: productId, user: req.user._id },
      {
        product: productId,
        user: req.user._id,
        userName: req.user.name,
        rating: numRating,
        comment: comment.trim()
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      message: 'Thank you! Your shoe review has been saved successfully.',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for Admin Panel
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('product', 'name brand image price')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review (Admin)
// @route   DELETE /api/reviews/admin/:id
// @access  Private/Admin
const deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  submitReview,
  getAllReviewsAdmin,
  deleteReviewAdmin
};
