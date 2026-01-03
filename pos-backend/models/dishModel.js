const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Dish name is required'],
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  },
  image: {
    type: String, // Store the URL or path to the image
    default: '/images/default-dish.jpg' // Default image path
  },
  description: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
dishSchema.index({ name: 'text', description: 'text' });

// Virtual for getting the category name
dishSchema.virtual('categoryInfo', {
  ref: 'Category',
  localField: 'category',
  foreignField: '_id',
  justOne: true
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;