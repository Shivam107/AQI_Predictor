# 🚀 Deploy Now - Quick Start

## Step 1: Push to GitHub (Do this first!)

Open your terminal and run:

```bash
git push
```

✅ This will trigger automatic deployments on both Render and Vercel!

---

## Step 2: Wait for Deployments (~3-5 minutes)

### Check Render
1. Go to: https://dashboard.render.com/
2. Find `live-sensor-backend` service
3. Watch the "Events" tab - wait until you see "Deploy live"
4. Copy your backend URL (e.g., `https://live-sensor-backend-xxxx.onrender.com`)

### Check Vercel
1. Go to: https://vercel.com/dashboard
2. Find your project
3. Watch for deployment completion
4. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

---

## Step 3: Configure Environment Variables

### On Render (Backend)
1. Go to your service → **Environment** tab
2. You'll see `FRONTEND_URL` listed (from render.yaml)
3. Click on it and set the value to your Vercel URL
4. Example: `https://your-app.vercel.app`
5. Save (will trigger redeploy - wait ~2 minutes)

### On Vercel (Frontend)
1. Go to your project → **Settings** → **Environment Variables**
2. Add new variable:
   - Name: `REACT_APP_API_URL`
   - Value: Your Render backend URL (e.g., `https://live-sensor-backend-xxxx.onrender.com`)
   - Select: ✓ Production ✓ Preview ✓ Development
3. Save
4. Go to **Deployments** → Click ⋯ on latest → **Redeploy**

---

## Step 4: Test (After ~2 minutes)

### Test Backend
Open in browser:
```
https://YOUR-BACKEND-URL.onrender.com/
```
Should show: `{"msg": "Backend is up!"}`

### Test Frontend
1. Open your Vercel URL
2. Press F12 (DevTools)
3. Check Console tab - no CORS errors = ✅ Success!

---

## 📋 Checklist

- [ ] Run `git push`
- [ ] Wait for Render deployment (check dashboard)
- [ ] Wait for Vercel deployment (check dashboard)
- [ ] Copy both URLs
- [ ] Set `FRONTEND_URL` on Render
- [ ] Set `REACT_APP_API_URL` on Vercel
- [ ] Redeploy both services
- [ ] Test backend endpoint
- [ ] Test frontend (no CORS errors)
- [ ] 🎉 **DONE!**

---

## Need Help?

See `SETUP_INSTRUCTIONS.md` for detailed troubleshooting.

