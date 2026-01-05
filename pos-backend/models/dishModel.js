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
    data: {
      type: Buffer,
      default: Buffer.alloc(0)  // Buffer vuoto invece di null
    },
    contentType: {
      type: String,
      default: 'image/svg+xml'
    },
    size: {
      type: Number,
      default: 0
    },
    filename: {
      type: String,
      default: 'default-icon.svg'
    }
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

// Middleware per la validazione dell'immagine
dishSchema.pre('validate', function(next) {
  if (this.image && this.image.data && this.image.data.length > 0) {
    // Verifica le dimensioni massime
    if (this.image.size > 5 * 1024 * 1024) {
      this.invalidate('image', 'Image size must be less than 5MB', this.image.size);
    }
    
    // Verifica i tipi di file consentiti (solo immagini)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(this.image.contentType)) {
      this.invalidate('image', `Unsupported file type: ${this.image.contentType}`);
    }
  }
  next();
});

// Indexes
dishSchema.index({ name: 'text', description: 'text' });

// Virtual per ottenere l'URL pubblico dell'immagine
dishSchema.virtual('imageUrl').get(function() {
  if (this.image && this.image.data && this.image.data.length > 0) {
    // Converte il buffer in una stringa base64
    const base64 = this.image.data.toString('base64');
    return `data:${this.image.contentType};base64,${base64}`;
  }
  return '/images/default-dish.jpg';
});

// Virtual per ottenere le informazioni della categoria
dishSchema.virtual('categoryInfo', {
  ref: 'Category',
  localField: 'category',
  foreignField: '_id',
  justOne: true
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;