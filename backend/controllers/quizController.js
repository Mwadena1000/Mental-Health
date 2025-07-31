const QuizResult = require('../models/QuizResult');

// Save quiz answers submitted by authenticated users
exports.saveQuiz = async (req, res) => {
  try {
    const { q1, q2, q3, resultLevel } = req.body;

    // Validate that all required fields are present
    if (q1 === undefined || q2 === undefined || q3 === undefined) {
      return res.status(400).json({ 
        success: false,
        message: 'q1, q2, and q3 are required fields.' 
      });
    }

    // Validate numeric fields
    if (!Number.isInteger(q1) || !Number.isInteger(q2) || !Number.isInteger(q3)) {
      return res.status(400).json({ 
        success: false,
        message: 'q1, q2, and q3 must be valid numbers.' 
      });
    }

    // Validate value ranges (assuming 1-3 scale)
    if (q1 < 1 || q1 > 3 || q2 < 1 || q2 > 3 || q3 < 1 || q3 > 3) {
      return res.status(400).json({ 
        success: false,
        message: 'q1, q2, and q3 must be between 1 and 3.' 
      });
    }

    // Validate resultLevel
    if (!resultLevel || !['low', 'moderate', 'high'].includes(resultLevel)) {
      return res.status(400).json({ 
        success: false,
        message: 'resultLevel must be one of: low, moderate, high.' 
      });
    }

    const total = q1 + q2 + q3;

    const result = await QuizResult.create({
      userId: req.user._id,
      q1,
      q2,
      q3,
      total,
      resultLevel
    });

    res.status(201).json({ 
      success: true, 
      message: 'Quiz results saved successfully',
      result 
    });
  } catch (error) {
    console.error('Error in saveQuiz:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error' 
    });
  }
};

// Retrieve all quiz results submitted by the logged-in user
exports.getUserResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
                                    .sort({ createdAt: -1 })
                                    .lean();

    res.json({ 
      success: true, 
      message: 'Quiz results retrieved successfully',
      results 
    });
  } catch (error) {
    console.error('Error in getUserResults:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error' 
    });
  }
};
