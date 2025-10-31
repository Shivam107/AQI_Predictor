# 🚀 Quick Reference - Sensor Integration

## Start Backend
```bash
cd backend
npm start
```

## Test Sensor Integration
```bash
cd backend
./test-sensor-integration.sh
```

## Check Status
```bash
# Backend health
curl http://localhost:3001/

# Polling service status
curl http://localhost:3001/api/sensor-polling/status

# Latest sensor data
curl http://localhost:3001/api/sensor-data/latest
```

## Environment Variables (.env)
```env
SENSOR_ENDPOINT=https://aqi-predictor-krb8.onrender.com/api/sensor-data
POLL_INTERVAL=10000
MONGODB_URI=your_mongodb_uri
FRONTEND_URL=http://localhost:3000
```

## Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sensor-data/latest` | GET | Get most recent sensor reading |
| `/api/sensor-polling/status` | GET | Check polling service status |
| `/api/sensor-data` | POST | Submit sensor data directly |
| `/api/merged-data` | GET | Historical + live data |
| `/api/predict-aqi?month=N` | GET | AQI prediction for month |
| `/api/mitigation-advice?aqi=N` | GET | Get mitigation advice |

## Expected Log Output
```
🚀 Starting sensor polling service...
📡 Polling endpoint: https://aqi-predictor-krb8.onrender.com/api/sensor-data
⏱️  Poll interval: 10000ms
📥 Fetching sensor data...
✅ Successfully processed 1 sensor reading(s)
💾 Saved reading from sensor: external-sensor-001
```

## Troubleshooting

### No data showing?
1. Check backend: `curl http://localhost:3001/api/sensor-polling/status`
2. Check logs for errors
3. Verify SENSOR_ENDPOINT is correct

### Connection errors?
- Ensure sensor endpoint is accessible
- Test with: `curl https://aqi-predictor-krb8.onrender.com/api/sensor-data`
- Check network connectivity

### Frontend not updating?
- Verify REACT_APP_API_URL points to backend
- Check browser console for errors
- Ensure backend is running

## Quick Deploy to Production

### Render (Backend)
1. Push to GitHub
2. Add environment variables in Render:
   - SENSOR_ENDPOINT
   - POLL_INTERVAL
   - MONGODB_URI
   - FRONTEND_URL
3. Deploy

### Vercel (Frontend)
1. Push to GitHub
2. Set REACT_APP_API_URL to Render backend URL
3. Deploy

---
For detailed docs, see [SENSOR_INTEGRATION.md](./SENSOR_INTEGRATION.md)

