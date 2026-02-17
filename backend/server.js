require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'KZero Inspire API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
