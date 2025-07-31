const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { 
  createBooking, 
  getUserBookings, 
  getBooking, 
  cancelBooking 
} = require('../controllers/bookingController');

const router = express.Router();

// All booking routes require authentication
router.use(authMiddleware);

// Create a new booking
router.post('/create', createBooking);

// Get all bookings for the authenticated user
router.get('/my-bookings', getUserBookings);

// Get a specific booking by ID
router.get('/:bookingId', getBooking);

// Cancel a booking
router.patch('/:bookingId/cancel', cancelBooking);

module.exports = router; 