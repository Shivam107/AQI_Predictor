# 🚀 Deployment Guide - Production Ready

## ✅ Build Status

- **Frontend**: Built successfully ✓
- **Backend**: Ready for deployment ✓
- **Build artifacts**: Located in `frontend/build/` ✓

---

## 📦 Quick Deploy Steps

### 1. Deploy Backend to Render

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Production build ready"
   git push origin main
   ```

2. **Go to [Render Dashboard](https://dashboard.render.com)**

3. **Create New Web Service**:
   - Connect your GitHub repository
   - Name: `aqi-backend` (or your preferred name)
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node index.js`
   - Plan: Free (or your choice)

4. **Set Environment Variables** in Render:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/aqi-db
   FRONTEND_URL=https://your-frontend.vercel.app
   SENSOR_ENDPOINT=https://aqi-predictor-krb8.onrender.com/api/sensor-data
   POLL_INTERVAL=10000
   PORT=3001
   ```

5. **Deploy** - Render will automatically deploy your backend

6. **Copy your backend URL**: `https://your-backend.onrender.com`

---

### 2. Deploy Frontend to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Import Project**:
   - Connect your GitHub repository
   - Framework Preset: Create React App
   - Root Directory: `frontend`

3. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Set Environment Variables** in Vercel:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```
   (Use the backend URL from step 1.6)

5. **Deploy** - Vercel will build and deploy your frontend

6. **Copy your frontend URL**: `https://your-frontend.vercel.app`

7. **Update Backend CORS**: Go back to Render and update `FRONTEND_URL` with your Vercel URL

---

## 🔄 Alternative Deployment Options

### Option A: Deploy Both to Render

**Frontend:**
- Type: Static Site
- Build Command: `cd frontend && npm install && npm run build`
- Publish Directory: `frontend/build`

**Backend:** (same as above)

### Option B: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Create new project from GitHub
3. Add services for both frontend and backend
4. Set environment variables
5. Deploy

### Option C: Deploy to Heroku

**Backend:**
```bash
cd backend
heroku create your-backend-name
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set FRONTEND_URL="your-frontend-url"
git push heroku main
```

**Frontend:** Use Vercel or Netlify

---

## 📋 Environment Variables Reference

### Backend (.env in production)
```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aqi-db
FRONTEND_URL=https://your-frontend-url.com
PORT=3001

# Optional (with defaults)
SENSOR_ENDPOINT=https://aqi-predictor-krb8.onrender.com/api/sensor-data
POLL_INTERVAL=10000
```

### Frontend (.env in production)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

---

## 🧪 Test Your Deployment

After deployment, test these endpoints:

1. **Backend Health Check**:
   ```bash
   curl https://your-backend.onrender.com/
   # Should return: {"msg":"Backend is up!"}
   ```

2. **API Endpoint**:
   ```bash
   curl https://your-backend.onrender.com/api/merged-data
   # Should return JSON data
   ```

3. **Frontend**: Open `https://your-frontend.vercel.app` in browser

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" errors in frontend
**Solution**: Check that `REACT_APP_API_URL` in Vercel matches your backend URL

### Issue: CORS errors
**Solution**: Update `FRONTEND_URL` in backend environment variables

### Issue: MongoDB connection failed
**Solution**: 
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- The app will work with in-memory storage if MongoDB is unavailable

### Issue: Backend not starting
**Solution**: Check Render logs for errors. Ensure all dependencies are in `package.json`

---

## 📊 Performance Optimization (Optional)

### Enable Caching
Add to backend `index.js`:
```javascript
app.use(express.static('public', { maxAge: '1d' }));
```

### Enable Compression
```bash
cd backend
npm install compression
```

Add to `index.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

---

## 🔐 Security Checklist

- [ ] Environment variables are set (not hardcoded)
- [ ] MongoDB credentials are secure
- [ ] CORS is configured correctly
- [ ] API rate limiting enabled (optional)
- [ ] HTTPS is enabled (automatic on Vercel/Render)

---

## 📝 Post-Deployment

1. **Update README** with your live URLs
2. **Test all features** in production
3. **Monitor logs** for any errors
4. **Set up monitoring** (optional): Use Render's built-in monitoring or add services like Sentry

---

## 🎉 Your App is Live!

**Frontend**: `https://your-frontend.vercel.app`  
**Backend**: `https://your-backend.onrender.com`

Share your IoT Air Quality Dashboard with the world! 🌍

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

---

**Built and ready for deployment on:** October 31, 2025  
**Last updated:** After successful production build

