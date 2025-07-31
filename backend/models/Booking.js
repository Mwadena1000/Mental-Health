const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  isCrisis: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Check if booking is crisis based on message content
bookingSchema.pre('save', function(next) {
  if (this.message) {
    const crisisKeywords = ['emergency', 'crisis', 'suicide', 'urgent'];
    this.isCrisis = crisisKeywords.some(keyword => 
      this.message.toLowerCase().includes(keyword)
    );
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema); 