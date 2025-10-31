# Live Sensor & Analytics Backend (Node.js/Express)

This backend replicates the features of the previous Python FastAPI server, using Express and Node.js.

## Features
- `/` (GET): Health check – returns `{ msg: "Backend is up!" }`.
- `/api/sensor-data` (POST): Submit live sensor data (in-memory store).
- `/api/sensor-data/latest` (GET): Get the most recent sensor reading.
- `/api/sensor-polling/status` (GET): Check status of the sensor polling service.
- `/api/merged-data` (GET): Returns merged historical (CSV) and live sensor data.
- `/api/predict-aqi?month={int}` (GET): Predict the AQI for a given month, with mitigation advice.
- `/api/mitigation-advice?aqi={float}` (GET): Get AQI category, warnings, and actions for any AQI value.
- **🆕 Automatic Sensor Polling**: Backend automatically polls external sensor endpoints for live data.

## Local Setup
1. (From the `backend` directory)
2. Create a `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-db
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   SENSOR_ENDPOINT=https://aqi-predictor-krb8.onrender.com/api/sensor-data
   POLL_INTERVAL=10000
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm run dev
   # or
   npm start
   ```
5. The API will be running at `http://localhost:3001/`.

The sensor polling service will start automatically and fetch live data from the configured endpoint.

## Deployment

### Render (Backend)
Set environment variables in Render:
- `PORT`: 3001 (Render sets this automatically; do not hardcode)
- `MONGODB_URI`: your Mongo connection string
- `FRONTEND_URL`: your Vercel frontend URL
- `SENSOR_ENDPOINT`: https://aqi-predictor-krb8.onrender.com/api/sensor-data
- `POLL_INTERVAL`: 10000 (optional, defaults to 10 seconds)

Build & Start Commands:
- Build: `npm install`
- Start: `node index.js`

Health check: `/` should return `{ msg: "Backend is up!" }`.
Sensor polling status: `/api/sensor-polling/status` should show `{ "success": true, "isRunning": true, ... }`.

### Vercel (Frontend)
Set env variable:
- `REACT_APP_API_URL`: `https://<your-render-service>.onrender.com`

Vercel will use `npm run build` and serve the build.

## Data
- The server expects a `city_day.csv` file in `backend/app/`. If missing, historical endpoints will return empty results.
- **Live sensor data** is automatically fetched from the configured `SENSOR_ENDPOINT` every `POLL_INTERVAL` milliseconds.
- Sensor readings are stored both in-memory (last 100 readings) and persisted to MongoDB.
- Sensors can also push data directly via POST `/api/sensor-data`.

## API Format
- Data formats and endpoint paths are exactly as in the old Python FastAPI version.
- The frontend can be pointed at this backend with no needed changes.

## Development Tips
- You can run the React frontend (if present) alongside this backend. The most common setup is:
  - Backend at `http://localhost:3001/`
  - Frontend at `http://localhost:3000/`
- CORS is enabled for local development convenience.

## Sensor Integration

The backend now includes an automatic sensor polling service that:
- Fetches live data from external sensor endpoints
- Normalizes different sensor data formats
- Stores data in-memory and MongoDB
- Provides real-time updates to the frontend

For detailed information, see [SENSOR_INTEGRATION.md](../SENSOR_INTEGRATION.md).

---
**Contact:** Please update your `city_day.csv` with actual project data to get real AQI stats.
