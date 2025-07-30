const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  q1: Number,
  q2: Number,
  q3: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', resultSchema);
