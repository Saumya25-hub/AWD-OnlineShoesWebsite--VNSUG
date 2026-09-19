const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter brand name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true
  },
  logo: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Auto-generate clean slug before saving if not provided
brandSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
