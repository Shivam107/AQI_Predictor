# Live Sensor & Analytics Backend (Node.js/Express)

This backend replicates the features of the previous Python FastAPI server, using Express and Node.js.

## Features
- `/` (GET): Health check – returns `{ msg: "Backend is up!" }`.
- `/api/sensor-data` (POST): Submit live sensor data (in-memory store).
- `/api/merged-data` (GET): Returns merged historical (CSV) and live sensor data.
- `/api/predict-aqi?month={int}` (GET): Predict the AQI for a given month, with mitigation advice.
- `/api/mitigation-advice?aqi={float}` (GET): Get AQI category, warnings, and actions for any AQI value.

## Local Setup
1. (From the `backend` directory)
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm run dev
   # or
   npm start
   ```
4. The API will be running at `http://localhost:3001/`.

## Deployment

### Render (Backend)
Set environment variables in Render:
- `PORT`: 3001 (Render sets this automatically; do not hardcode)
- `MONGODB_URI`: your Mongo connection string

Build & Start Commands:
- Build: `npm install`
- Start: `node index.js`

Health check: `/` should return `{ msg: "Backend is up!" }`.

### Vercel (Frontend)
Set env variable:
- `REACT_APP_API_URL`: `https://<your-render-service>.onrender.com`

Vercel will use `npm run build` and serve the build.

## Data
- The server expects a `city_day.csv` file in `backend/app/`. If missing, historical endpoints will return empty results.
- Sensor data submission is in-memory (just like original code; non-persistent!).

## API Format
- Data formats and endpoint paths are exactly as in the old Python FastAPI version.
- The frontend can be pointed at this backend with no needed changes.

## Development Tips
- You can run the React frontend (if present) alongside this backend. The most common setup is:
  - Backend at `http://localhost:3001/`
  - Frontend at `http://localhost:3000/`
- CORS is enabled for local development convenience.

---
**Contact:** Please update your `city_day.csv` with actual project data to get real AQI stats.
