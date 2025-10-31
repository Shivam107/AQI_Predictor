// Load env FIRST
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const routes = require('./app/routes');
const SensorPollingService = require('./app/sensorPollingService');

const app = express();

// CORS configuration - allow your Vercel frontend and local development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3004',
      'http://localhost:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ msg: 'Backend is up!' });
});

const PORT = process.env.PORT || 3001;

// Initialize Sensor Polling Service
const SENSOR_ENDPOINT = process.env.SENSOR_ENDPOINT || 'https://aqi-predictor-krb8.onrender.com/api/sensor-data';
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '10000'); // 10 seconds default

const sensorPollingService = new SensorPollingService(SENSOR_ENDPOINT, POLL_INTERVAL);

// Make polling service available to routes
app.locals.sensorPollingService = sensorPollingService;

// Connect DB, then start server
async function start() {
  try {
    // Try to connect to MongoDB if URI is provided
    if (process.env.MONGODB_URI) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');
      } catch (dbErr) {
        console.warn('⚠️  MongoDB connection failed, running without database:', dbErr.message);
        console.warn('Server will continue with in-memory storage only');
      }
    } else {
      console.warn('MONGODB_URI not set; running without DB');
    }
    
    // Start server regardless of DB connection status
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      
      // Start sensor polling service after server is up
      const { getLiveSensorDataRef } = require('./app/routes');
      sensorPollingService.start(getLiveSensorDataRef());
      console.log('✅ Sensor polling service started successfully');
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  sensorPollingService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  sensorPollingService.stop();
  process.exit(0);
});

start();