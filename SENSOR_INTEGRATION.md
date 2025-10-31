# 🔌 Sensor Integration Guide

## Overview

The backend now automatically polls live sensor data from your external sensor endpoint and makes it available to the frontend dashboard in real-time.

## Architecture

```
External Sensors
      ↓
Sensor Endpoint (https://aqi-predictor-krb8.onrender.com/api/sensor-data)
      ↓
Backend Polling Service (polls every 10s)
      ↓
Backend API (/api/sensor-data/latest)
      ↓
Frontend Dashboard (updates every 3s)
```

## 🚀 Quick Start

### 1. Configure Environment Variables

Add the following to your backend `.env` file:

```bash
# Sensor endpoint to poll
SENSOR_ENDPOINT=https://aqi-predictor-krb8.onrender.com/api/sensor-data

# Poll interval in milliseconds (default: 10000 = 10 seconds)
POLL_INTERVAL=10000

# Your other environment variables...
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=your_frontend_url
```

### 2. Start the Backend

```bash
cd backend
npm install  # if not already done
npm start
```

The sensor polling service will start automatically when the server starts. You should see:

```
Server running on port 3001
🚀 Starting sensor polling service...
📡 Polling endpoint: https://aqi-predictor-krb8.onrender.com/api/sensor-data
⏱️  Poll interval: 10000ms
📥 Fetching sensor data from https://aqi-predictor-krb8.onrender.com/api/sensor-data...
✅ Successfully processed 1 sensor reading(s)
💾 Saved reading from sensor: external-sensor-001
```

### 3. Verify It's Working

Check the polling service status:

```bash
curl http://localhost:3001/api/sensor-polling/status
```

Expected response:
```json
{
  "success": true,
  "isRunning": true,
  "endpoint": "https://aqi-predictor-krb8.onrender.com/api/sensor-data",
  "pollInterval": 10000,
  "dataPointsStored": 42
}
```

Get the latest sensor reading:

```bash
curl http://localhost:3001/api/sensor-data/latest
```

Expected response:
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-10-31T12:34:56.789Z",
    "sensor_id": "external-sensor-001",
    "values": {
      "aq2": 85.5,
      "temperature": 27.3,
      "humidity": 62.1,
      "gps": {
        "latitude": 19.076,
        "longitude": 72.8777,
        "altitude": 14.2
      }
    },
    "location": {
      "latitude": 19.076,
      "longitude": 72.8777,
      "altitude": 14.2
    }
  }
}
```

## 📊 Data Flow

### Backend Polling Service

The `SensorPollingService` class handles:

1. **Automatic Polling**: Fetches data from the sensor endpoint at regular intervals
2. **Data Normalization**: Handles different sensor data formats automatically
3. **Dual Storage**: 
   - In-memory store (last 100 readings)
   - MongoDB persistence (if connected)
4. **Error Handling**: Gracefully handles network errors without crashing
5. **Graceful Shutdown**: Stops polling when server shuts down

### Supported Sensor Data Formats

The service automatically normalizes various sensor data formats:

**Format 1: Nested values**
```json
{
  "timestamp": "2025-10-31T12:00:00Z",
  "sensor_id": "sensor-001",
  "values": {
    "aq2": 85.5,
    "temperature": 27.3,
    "humidity": 62.1
  }
}
```

**Format 2: Flat structure**
```json
{
  "timestamp": "2025-10-31T12:00:00Z",
  "sensor_id": "sensor-001",
  "aq2": 85.5,
  "temperature": 27.3,
  "humidity": 62.1,
  "gps": {
    "latitude": 19.076,
    "longitude": 72.8777
  }
}
```

**Format 3: Array response**
```json
[
  {
    "timestamp": "2025-10-31T12:00:00Z",
    "sensor_id": "sensor-001",
    "values": { ... }
  },
  {
    "timestamp": "2025-10-31T12:01:00Z",
    "sensor_id": "sensor-002",
    "values": { ... }
  }
]
```

**Format 4: Wrapped response**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-10-31T12:00:00Z",
      "sensor_id": "sensor-001",
      "values": { ... }
    }
  ]
}
```

All formats are automatically normalized to the standard internal format.

## 🔧 Configuration Options

### Poll Interval

Adjust how frequently the backend polls the sensor endpoint:

```bash
# Poll every 5 seconds (more frequent updates)
POLL_INTERVAL=5000

# Poll every 30 seconds (reduce server load)
POLL_INTERVAL=30000
```

**Recommendations:**
- Development: 5-10 seconds
- Production: 10-30 seconds (balance between freshness and server load)
- High-traffic: 30-60 seconds

### Memory Management

The in-memory store keeps the last 100 sensor readings. Older readings are automatically removed to prevent memory issues. All readings are also persisted to MongoDB for long-term storage.

## 🎯 API Endpoints

### GET /api/sensor-data/latest

Get the most recent sensor reading.

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-10-31T12:34:56.789Z",
    "sensor_id": "external-sensor-001",
    "values": { ... },
    "location": { ... }
  }
}
```

### GET /api/sensor-polling/status

Check the status of the polling service.

**Response:**
```json
{
  "success": true,
  "isRunning": true,
  "endpoint": "https://aqi-predictor-krb8.onrender.com/api/sensor-data",
  "pollInterval": 10000,
  "dataPointsStored": 42
}
```

### POST /api/sensor-data

Still available for sensors to push data directly to the backend.

**Request:**
```json
{
  "timestamp": "2025-10-31T12:34:56.789Z",
  "sensor_id": "arduino-uno-001",
  "values": {
    "aq2": 85.5,
    "temperature": 27.3,
    "humidity": 62.1
  }
}
```

## 🎨 Frontend Integration

The frontend automatically displays live sensor data from the polling service:

1. **Auto-refresh**: Dashboard polls `/api/sensor-data/latest` every 3 seconds
2. **Fallback**: If backend is unavailable, shows simulated data after 3 failures
3. **Visual feedback**: Color-coded sensor cards based on threshold values

### Sensor Display Components

- **SensorCards.tsx**: Displays temperature, humidity, AQ-2 gas, and GPS
- **Dashboard.tsx**: Main dashboard with live updates
- **MapView.tsx**: Shows sensor location on map

## 🔍 Monitoring & Debugging

### Check Logs

The backend logs all polling activity:

```bash
# Start backend with logs visible
npm start

# Or check log file (if configured)
tail -f backend.log
```

### Common Log Messages

- `📥 Fetching sensor data...` - Polling in progress
- `✅ Successfully processed N sensor reading(s)` - Data received and stored
- `💾 Saved reading from sensor: sensor-id` - Persisted to MongoDB
- `⚠️ No new sensor data available` - Endpoint returned no data
- `❌ Error fetching sensor data` - Network or parsing error

### Troubleshooting

**Problem: "Connection refused" errors**

```bash
❌ Error fetching sensor data: Connection refused
   Connection refused. Is the sensor endpoint running?
```

**Solution:** 
- Verify the sensor endpoint URL is correct
- Check if the external sensor service is running
- Test the endpoint manually: `curl https://aqi-predictor-krb8.onrender.com/api/sensor-data`

**Problem: "Request timed out"**

**Solution:**
- Check network connectivity
- Increase timeout in `sensorPollingService.js` if needed
- Verify the sensor endpoint is responding quickly

**Problem: No data showing in frontend**

**Solution:**
1. Check backend is running: `curl http://localhost:3001/api/sensor-polling/status`
2. Verify sensor data is being fetched: `curl http://localhost:3001/api/sensor-data/latest`
3. Check browser console for frontend errors
4. Ensure `REACT_APP_API_URL` points to your backend

## 🚢 Deployment

### Render.com

The backend is already configured for Render deployment. The polling service will start automatically.

**Environment Variables to Set:**
- `SENSOR_ENDPOINT`: https://aqi-predictor-krb8.onrender.com/api/sensor-data
- `POLL_INTERVAL`: 10000
- `MONGODB_URI`: Your MongoDB connection string
- `FRONTEND_URL`: Your frontend URL (for CORS)

### Vercel (Frontend)

The frontend is already configured. Just ensure `REACT_APP_API_URL` environment variable points to your backend:

```bash
REACT_APP_API_URL=https://your-backend.onrender.com
```

## 🛡️ Security Considerations

1. **API Authentication**: Consider adding authentication to sensor endpoints in production
2. **Rate Limiting**: The polling service respects the configured interval
3. **CORS**: Backend CORS is configured to accept requests from your frontend
4. **Data Validation**: All sensor data is validated before storage

## 📈 Performance

- **Memory Usage**: ~1-2 MB for 100 sensor readings in memory
- **Database**: All readings persisted to MongoDB for historical analysis
- **Network**: Minimal bandwidth usage (one request per poll interval)
- **CPU**: Negligible overhead from polling service

## 🔮 Future Enhancements

- [ ] Support for multiple sensor endpoints
- [ ] Configurable retry logic with exponential backoff
- [ ] Real-time WebSocket support for instant updates
- [ ] Alert system for sensor offline/malfunction
- [ ] Data aggregation and analytics
- [ ] Sensor health monitoring dashboard

## 📞 Support

For issues or questions:
1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Test endpoints manually with curl/Postman
4. Review this documentation

---

**Status**: ✅ Fully Integrated and Running

**Last Updated**: October 31, 2025

