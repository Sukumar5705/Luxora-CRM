const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name:    { type: String, required: [true, 'Name is required'], trim: true },
  email:   { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  phone:   { type: String, required: [true, 'Phone is required'] },
  message: { type: String, required: [true, 'Message is required'] },
  property: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  },
  status: {
    type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
