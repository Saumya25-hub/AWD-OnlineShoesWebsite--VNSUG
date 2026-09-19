const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please provide a product ID']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  userName: {
    type: String,
    required: [true, 'Please provide the user name'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Please select a star rating between 1 and 5'],
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maximum rating is 5']
  },
  comment: {
    type: String,
    required: [true, 'Please provide your review feedback'],
    trim: true
  }
}, {
  timestamps: true
});

// Enforce 1 review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
