const QuizResult = require('../models/QuizResult');

// Save quiz answers submitted by authenticated users
exports.saveQuiz = async (req, res) => {
  try {
    const { q1, q2, q3 } = req.body;

    // Validate numeric fields
    if (![q1, q2, q3].every(val => typeof val === 'number')) {
      return res.status(400).json({ message: 'q1, q2, and q3 must be numbers.' });
    }

    const total = q1 + q2 + q3;

    const result = await QuizResult.create({
      userId: req.user._id,
      q1,
      q2,
      q3,
      total
    });

    res.status(201).json({ success: true, result });
  } catch (error) {
    console.error('Error in saveQuiz:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Retrieve all quiz results submitted by the logged-in user
exports.getUserResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
                                    .sort({ createdAt: -1 })
                                    .lean();

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error in getUserResults:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
