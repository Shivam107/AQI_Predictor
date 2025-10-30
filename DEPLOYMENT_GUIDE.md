# 🚀 Deployment Guide: Connecting Vercel Frontend + Render Backend

This guide will help you connect your frontend (deployed on Vercel) with your backend (deployed on Render).

## 📋 Prerequisites

- Frontend deployed on Vercel
- Backend deployed on Render
- Both services are accessible

---

## 🔧 Step 1: Configure Render Backend

### Get Your Render URL
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your backend service
3. Copy the URL (it looks like: `https://your-service-name.onrender.com`)

### Set Environment Variables on Render
1. In Render Dashboard, go to your backend service
2. Click **Environment** in the left sidebar
3. Add the following environment variable:

| Key | Value | Description |
|-----|-------|-------------|
| `FRONTEND_URL` | `https://your-app.vercel.app` | Your Vercel frontend URL (without trailing slash) |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string (if not already set) |

4. Click **Save Changes**
5. Your service will automatically redeploy

---

## 🌐 Step 2: Configure Vercel Frontend

### Get Your Frontend URL
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project
3. Copy the production URL (looks like: `https://your-app.vercel.app`)

### Set Environment Variables on Vercel
1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following variable:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://your-service-name.onrender.com` | Production, Preview, Development |

**Important:** Make sure to add this for all environments (Production, Preview, and Development)

4. Click **Save**

### Redeploy Frontend
After adding the environment variable:
1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete (~1-2 minutes)

---

## ✅ Step 3: Test the Connection

### Test Backend
Open your browser and navigate to:
```
https://your-service-name.onrender.com/
```

You should see:
```json
{"msg": "Backend is up!"}
```

### Test Frontend
1. Open your Vercel frontend URL
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Interact with your app
5. Verify API calls are going to your Render backend URL
6. Check for any errors (there should be none)

---

## 🔍 Troubleshooting

### Issue: "CORS Error" in browser console
**Solution:**
- Verify `FRONTEND_URL` is set correctly in Render (exact URL, no trailing slash)
- Make sure you've pushed the latest backend code with CORS configuration
- Redeploy backend on Render

### Issue: "Failed to fetch" or network errors
**Solution:**
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-50 seconds to wake up
- Try refreshing after waiting a minute
- Consider upgrading to paid tier for always-on service

### Issue: Environment variable not working
**Solution:**
- Make sure you've redeployed after adding environment variables
- Check variable names are exactly: `REACT_APP_API_URL` and `FRONTEND_URL`
- No typos or extra spaces

### Issue: Backend returns 404
**Solution:**
- Verify your API endpoints are correct
- Check Render logs for errors: Dashboard → Your Service → Logs

---

## 📝 Quick Reference

### Your URLs
Fill these in for quick reference:

```
Backend (Render):  https://___________________.onrender.com
Frontend (Vercel): https://___________________.vercel.app
```

### Environment Variables Summary

**Render Backend:**
```
FRONTEND_URL=https://your-app.vercel.app
MONGODB_URI=mongodb+srv://...
```

**Vercel Frontend:**
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 🎉 You're Done!

Your frontend and backend are now connected! The frontend will make API calls to your Render backend, and CORS is properly configured to allow the connection.

For any issues, check the logs:
- **Render Logs:** Dashboard → Service → Logs
- **Vercel Logs:** Dashboard → Project → Deployments → Click deployment → Function Logs
- **Browser Console:** F12 → Console tab

