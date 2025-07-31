const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  q1: {type: Number,min: 0,required: true},
  q2: {type: Number,min: 0,required: true},
  q3: {type: Number,min: 0,required: true},
  total: {type: Number,required: true},
  resultLevel: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    required: true
  },
  createdAt: {type: Date,default: Date.now}
});

module.exports = mongoose.model('QuizResult', resultSchema);
