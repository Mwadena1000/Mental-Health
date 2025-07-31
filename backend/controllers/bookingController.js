const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { name, email, date, time, message } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!name || !email || !date || !time) {
      return res.status(400).json({ 
        message: 'Name, email, date, and time are required.' 
      });
    }

    // Validate date is not in the past
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({ 
        message: 'Booking date cannot be in the past.' 
      });
    }

    // Check for existing booking at same date/time
    const existingBooking = await Booking.findOne({
      date: bookingDate,
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({ 
        message: 'This time slot is already booked. Please choose another time.' 
      });
    }

    // Create new booking
    const booking = new Booking({
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      date: bookingDate,
      time,
      message: message ? message.trim() : ''
    });

    await booking.save();

    res.status(201).json({
      success: true,
      booking: {
        id: booking._id,
        name: booking.name,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        message: booking.message,
        isCrisis: booking.isCrisis,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const bookings = await Booking.find({ userId })
      .sort({ date: 1, time: 1 })
      .select('-__v')
      .lean();

    res.json({
      success: true,
      bookings: bookings
    });

  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings.' });
  }
};

// Get a specific booking by ID
exports.getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, userId })
      .select('-__v')
      .lean();

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('Error in getBooking:', error);
    res.status(500).json({ message: 'Failed to retrieve booking.' });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully.'
    });

  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({ message: 'Failed to cancel booking.' });
  }
}; 