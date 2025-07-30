require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
