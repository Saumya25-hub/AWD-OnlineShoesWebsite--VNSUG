const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please enter brand name'],
    trim: true,
    default: 'Nike'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  price: {
    type: Number,
    required: [true, 'Please enter price'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please enter available stock'],
    min: 0,
    default: 10
  },
  sizes: {
    type: [String],
    default: ['6', '7', '8', '9', '10', '11']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image']
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
