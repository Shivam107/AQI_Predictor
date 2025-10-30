// Load env FIRST
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const routes = require('./app/routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ msg: 'Backend is up!' });
});

const PORT = process.env.PORT || 3001;

// Connect DB, then start server
async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    } else {
      console.warn('MONGODB_URI not set; running without DB');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

start();