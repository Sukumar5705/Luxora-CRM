const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String, required: [true, 'Property title is required'], trim: true,
  },
  description: {
    type: String, required: [true, 'Description is required'],
  },
  price: {
    type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'],
  },
  type: {
    type: String, enum: ['sale', 'rent'], required: [true, 'Property type is required'],
  },
  category: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'commercial', 'land', 'condo'],
    required: [true, 'Category is required'],
  },
  status: {
    type: String, enum: ['available', 'sold', 'rented'], default: 'available',
  },
  location: {
    address:  { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    country:  { type: String, default: 'India' },
    zipCode:  { type: String },
  },
  features: {
    bedrooms:  { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area:      { type: Number, required: true },
    parking:   { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    balcony:   { type: Boolean, default: false },
    pool:      { type: Boolean, default: false },
    gym:       { type: Boolean, default: false },
  },
  images:    [{ type: String }],
  amenities: [{ type: String }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
  },
  featured: { type: Boolean, default: false },
  views:    { type: Number, default: 0 },
}, { timestamps: true });

propertySchema.index({
  title: 'text', description: 'text',
  'location.city': 'text', 'location.address': 'text',
});

module.exports = mongoose.model('Property', propertySchema);
