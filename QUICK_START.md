# 🚀 Quick Start Guide

## Local Development

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (optional, app works without it)
- Git

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example)
cp ../env.example .env

# Edit .env with your MongoDB URI (or leave it to run in-memory)
# MONGODB_URI=your-mongodb-connection-string
# FRONTEND_URL=http://localhost:3004

# Start backend server
npm start
```

Backend will run on: http://localhost:3001

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:3001" > .env

# Start development server
npm run dev
```

Frontend will run on: http://localhost:3004

### 3. Access the Application

Open your browser and navigate to: **http://localhost:3004**

Default login credentials:
- Email: `shivam@gmail.com`
- Password: `password123`

---

## Production Build

### Build Frontend
```bash
cd frontend
npm run build
```

Build output: `frontend/build/`

### Test Production Build
```bash
cd frontend
npm install -g serve
serve -s build -p 3004
```

---

## Deployment

See [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) for complete deployment instructions to:
- Vercel (Frontend)
- Render (Backend)
- Alternative platforms

---

## Troubleshooting

### Backend not starting?
- Check if port 3001 is available
- MongoDB connection will show warning but app continues with in-memory storage
- Check `backend/backend.log` for errors

### Frontend shows "Failed to fetch"?
- Ensure backend is running on port 3001
- Check `REACT_APP_API_URL` in `frontend/.env`
- Check browser console for CORS errors

### Location not working?
- Browser needs HTTPS or localhost for geolocation
- Grant location permissions when prompted
- Use preset locations as fallback

---

## Features

✅ Real-time air quality monitoring  
✅ AQI predictions and forecasts  
✅ Interactive dashboard with charts  
✅ Live sensor data integration  
✅ Location-based air quality tracking  
✅ Mitigation recommendations  
✅ User authentication  
✅ Team collaboration features  

---

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Real-time data updates

**Backend:**
- Node.js + Express
- MongoDB (optional, with in-memory fallback)
- Sensor polling service
- RESTful API

---

## Project Structure

```
TOP_SECRET/
├── backend/
│   ├── app/
│   │   ├── models.js
│   │   ├── routes.js
│   │   ├── utils.js
│   │   └── sensorPollingService.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── build/ (after npm run build)
│   └── package.json
│
├── DEPLOYMENT_READY.md
├── QUICK_START.md
└── env.example
```

---

## Next Steps

1. ✅ Setup local development environment
2. ✅ Build and test locally
3. 📦 Deploy to production (see DEPLOYMENT_READY.md)
4. 🎨 Customize for your needs
5. 🚀 Share with users!

---

**Need help?** Check the documentation files or open an issue.

