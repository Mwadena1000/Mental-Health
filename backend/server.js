require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URL /*, optional config object */)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Recommended: monitor connection events
mongoose.connection.on('connected', () => console.log('Mongoose event: connected'));
mongoose.connection.on('error', err => console.error('Mongoose event: error', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose event: disconnected'));

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
