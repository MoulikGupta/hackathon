require('dotenv').config();

const express = require('express');
const cors = require('cors');

const resourceRoutes = require('./routes/resources');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'KZero Inspire API is running' });
});

// API Routes
app.use('/api/resources', resourceRoutes);
app.use('/api/resources/:id/reviews', reviewRoutes);

// Global error handler for multer
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 50MB.' });
  }
  if (err.message === 'File type not supported') {
    return res.status(415).json({ error: 'File type not supported.' });
  }
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
