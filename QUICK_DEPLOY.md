# ⚡ Quick Deploy Checklist

Use this checklist to quickly connect your Vercel frontend with Render backend.

## 🎯 Action Items

### 1️⃣ Render (Backend)
- [ ] Copy your Render backend URL: `https://__________.onrender.com`
- [ ] Go to: Dashboard → Your Service → Environment
- [ ] Add variable: `FRONTEND_URL` = `https://your-app.vercel.app`
- [ ] Service will auto-redeploy (wait ~2-3 minutes)

### 2️⃣ Vercel (Frontend)
- [ ] Copy your Vercel URL: `https://__________.vercel.app`
- [ ] Go to: Dashboard → Your Project → Settings → Environment Variables
- [ ] Add variable: `REACT_APP_API_URL` = `https://your-backend.onrender.com`
- [ ] Select all environments: Production ✓ Preview ✓ Development ✓
- [ ] Save, then go to Deployments → ⋯ → Redeploy

### 3️⃣ Test
- [ ] Visit: `https://your-backend.onrender.com/` → Should see `{"msg": "Backend is up!"}`
- [ ] Visit: `https://your-frontend.vercel.app` → Open DevTools (F12) → Check Network tab
- [ ] No CORS errors? ✅ You're good!

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| CORS error | Double-check `FRONTEND_URL` in Render matches your Vercel URL exactly |
| Failed to fetch | Render free tier sleeps - wait 30-60 seconds for first request |
| Env vars not working | Must redeploy after adding environment variables |

---

**Need detailed instructions?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

