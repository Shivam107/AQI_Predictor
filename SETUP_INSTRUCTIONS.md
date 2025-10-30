# 🎯 Complete Setup Instructions

Follow these steps to connect your deployed Vercel frontend with Render backend.

---

## Step 1: Push Your Code to GitHub

```bash
git push
```

This will trigger automatic deployments on both Render and Vercel.

---

## Step 2: Get Your Deployment URLs

### Get Render Backend URL
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your `live-sensor-backend` service
3. Copy the URL at the top (looks like: `https://live-sensor-backend-xxxx.onrender.com`)
4. **Save this URL** - you'll need it for Vercel

### Get Vercel Frontend URL
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Copy the production URL (looks like: `https://your-app.vercel.app` or `https://your-app-xxx.vercel.app`)
4. **Save this URL** - you'll need it for Render

---

## Step 3: Configure Render (Backend)

1. In [Render Dashboard](https://dashboard.render.com/), click your `live-sensor-backend` service
2. Click **Environment** in the left sidebar
3. Find or add these environment variables:

| Variable | Value | Example |
|----------|-------|---------|
| `FRONTEND_URL` | Your Vercel URL from Step 2 | `https://your-app.vercel.app` |
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |

4. Click **Save Changes**
5. Wait for automatic redeploy (~2-3 minutes)

---

## Step 4: Configure Vercel (Frontend)

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add or update this variable:

| Variable | Value | Environment |
|----------|-------|-------------|
| `REACT_APP_API_URL` | Your Render backend URL from Step 2 | Production ✓ Preview ✓ Development ✓ |

**Example:** `https://live-sensor-backend-xxxx.onrender.com`

5. Click **Save**
6. Go to **Deployments** tab
7. Click the three dots (⋯) on the latest deployment
8. Select **Redeploy**

### Option B: Update vercel.json and Push

1. Open `vercel.json` in your project root
2. Update line 7:
```json
"REACT_APP_API_URL": "https://your-actual-backend.onrender.com"
```
3. Commit and push:
```bash
git add vercel.json
git commit -m "Update API URL"
git push
```

---

## Step 5: Test Everything

### Test 1: Backend Health Check
Open in browser:
```
https://your-backend.onrender.com/
```

Expected response:
```json
{"msg": "Backend is up!"}
```

⚠️ **Note:** First request may take 30-60 seconds if the backend was sleeping (Render free tier).

### Test 2: Frontend Connection
1. Open your Vercel frontend URL in browser
2. Press `F12` to open DevTools
3. Go to **Console** tab - check for errors
4. Go to **Network** tab
5. Interact with your app
6. You should see API calls to your Render backend URL
7. ✅ **No CORS errors** = Success!

### Test 3: API Endpoints
Test these endpoints in your browser or using curl:

```bash
# Health check
curl https://your-backend.onrender.com/

# Merged data
curl https://your-backend.onrender.com/api/merged-data

# Predict AQI
curl https://your-backend.onrender.com/api/predict-aqi?month=3

# Mitigation advice
curl https://your-backend.onrender.com/api/mitigation-advice?aqi=150
```

---

## 🎉 You're Done!

Your frontend and backend are now connected!

### Quick Reference

**Your Setup:**
```
Frontend: https://__________.vercel.app
Backend:  https://__________.onrender.com
```

**Environment Variables:**
- Render: `FRONTEND_URL` = your Vercel URL
- Vercel: `REACT_APP_API_URL` = your Render URL

---

## 🔧 Troubleshooting

### CORS Error
- **Problem:** "Access to fetch has been blocked by CORS policy"
- **Solution:** 
  - Verify `FRONTEND_URL` in Render exactly matches your Vercel URL
  - No trailing slash in the URL
  - Redeploy backend after changing

### Backend Not Responding
- **Problem:** "Failed to fetch" or "net::ERR_CONNECTION_REFUSED"
- **Solution:**
  - Render free tier sleeps after 15 minutes
  - First request takes 30-60 seconds to wake up
  - Wait and try again

### Wrong API URL
- **Problem:** Frontend making requests to localhost or wrong URL
- **Solution:**
  - Check `REACT_APP_API_URL` in Vercel settings
  - Must redeploy frontend after adding env vars
  - Clear browser cache and hard refresh (Ctrl+Shift+R)

### Environment Variable Not Working
- **Problem:** Changes not reflected
- **Solution:**
  - Must redeploy after adding environment variables
  - Check for typos in variable names
  - Verify variable is set for correct environment (Production)

---

## 📚 Additional Resources

- [Render Docs: Environment Variables](https://render.com/docs/environment-variables)
- [Vercel Docs: Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

Need help? Check the browser console and deployment logs for specific error messages.

