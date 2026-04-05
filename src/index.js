const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const vocabularyRoutes = require('./routes/vocabularyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Revised Database Connection for Serverless
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) return cachedConnection;

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Disable buffering to fail fast if not connected
    });
    console.log('Connected to MongoDB');
    return cachedConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Global Middleware to ensure DB connection before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', vocabularyRoutes);

// General Route
app.get('/', (req, res) => {
  res.send('Vocabulary Collector API is running...');
});

// Local server listener
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
