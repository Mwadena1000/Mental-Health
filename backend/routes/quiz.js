const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const QuizResult = require('../models/QuizResult');

const router = express.Router();

router.post('/save', authMiddleware, async (req, res) => {
  const { q1, q2, q3, total } = req.body;
  try {
    await QuizResult.create({
      userId: req.user._id,
      q1, q2, q3, total
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save quiz result' });
  }
});

module.exports = router;
