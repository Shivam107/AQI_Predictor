# Environment Variables Template

## Backend (.env file for local development)

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-db
FRONTEND_URL=https://your-app.vercel.app
PORT=3001
```

## Frontend (.env file for local development)

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

---

## Deployment Variables

### For Render (Backend)
Set these in Render Dashboard → Your Service → Environment:

```
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://your-app.vercel.app
```

### For Vercel (Frontend)
Set these in Vercel Dashboard → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

**Important:** Replace the placeholder URLs with your actual deployment URLs!

