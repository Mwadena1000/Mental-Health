const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { saveQuiz, getUserResults } = require('../controllers/quizController');

const router = express.Router();

// Save quiz result (authenticated)
router.post('/save', authMiddleware, saveQuiz);

// Retrieve the user's past quiz results
router.get('/my-results', authMiddleware, getUserResults);

module.exports = router;
