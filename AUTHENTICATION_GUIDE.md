# Authentication Guide

## Overview
The AQI Monitor application now includes a comprehensive authentication system with Google OAuth integration and traditional email/password login.

## Features Implemented

### 1. **Google OAuth Sign In**
- One-click sign in with Google account
- Secure token-based authentication
- Automatic profile picture and name retrieval

### 2. **Email/Password Login**
- Traditional login form (demo mode for development)
- Password protection
- Remember me functionality via localStorage

### 3. **Protected Routes**
- Dashboard and all features require authentication
- Automatic redirect to login page if not authenticated
- Session persistence across page refreshes

### 4. **Logout Functionality**
- Secure logout with confirmation
- Clears all authentication data
- Returns user to login page

## New Views & Features

### 📊 Analytics Dashboard
- Comprehensive air quality statistics
- Trend analysis and predictions
- Historical data visualization
- Key insights and recommendations

### 👥 Team Management
- View all team members
- Online status indicators
- Member profiles with contact information
- Project collaboration tracking

### ⚙️ Settings
- Profile management
- Notification preferences (Email, SMS, Weekly Reports)
- Custom AQI alert thresholds
- Privacy settings
- Appearance customization (Light/Dark mode)
- Account management

### ❓ Help & Support
- Comprehensive FAQ sections
- Video tutorials and documentation
- Community forum access
- Direct contact support (Email & Phone)
- Searchable help articles

### 📅 Calendar View (Existing)
- AQI data displayed by date
- Color-coded air quality levels
- Monthly navigation
- Today's date highlighting

## Setting Up Google OAuth

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "AQI Monitor App"

### Step 2: Enable Google Sign-In API
1. In the Cloud Console, go to **APIs & Services > Library**
2. Search for "Google+ API" or "Google Identity Services"
3. Click **Enable**

### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: AQI Monitor
   - User support email: Your email
   - Developer contact: Your email
4. Application type: **Web application**
5. Name: "AQI Monitor Web Client"
6. Authorized JavaScript origins:
   - `http://localhost:3004` (development)
   - `https://your-production-domain.com` (production)
7. Click **Create**
8. Copy the **Client ID**

### Step 4: Configure Environment Variables
1. Navigate to the `frontend` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your Google Client ID:
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   REACT_APP_API_URL=http://localhost:3001
   ```

### Step 5: Restart the Development Server
```bash
cd frontend
npm start
```

## Demo Mode (Without Google OAuth)

If you don't want to set up Google OAuth immediately, the app includes a demo mode:

### Email/Password Login (Demo)
- Use any email and password
- The system will create a demo user account
- All features will work normally

### Quick Demo Login
- Click the "Sign in with Google" button (if Google SDK fails to load, it acts as demo)
- Or use the email/password form with any credentials

## Security Notes

### Production Deployment
1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use environment variables** in production hosting (Vercel, Netlify, etc.)
3. **Add production domains** to Google OAuth authorized origins
4. **Enable HTTPS** for production deployments

### Data Storage
- User authentication state is stored in `localStorage`
- Logout clears all stored data
- Session persists across browser refreshes
- No sensitive data is stored client-side

## Navigation Structure

```
Login Page
    ↓ (After Authentication)
Dashboard
  ├── Dashboard (Home)
  ├── Calendar (AQI by Date)
  ├── Analytics (Statistics & Insights)
  ├── Team (Team Members)
  ├── Settings (Preferences & Account)
  ├── Help (Support & FAQs)
  └── Logout (Sign Out)
```

## User Experience

### First Time Users
1. Open the application
2. See the login page with:
   - Google Sign In button
   - Email/Password form
3. Choose authentication method
4. Automatically redirected to Dashboard

### Returning Users
1. Open the application
2. Automatically logged in (if session exists)
3. Direct access to Dashboard

### Logout Flow
1. Click "Logout" in sidebar
2. Confirmation dialog appears
3. After confirmation:
   - Session cleared
   - Redirected to login page
   - Must authenticate again to access features

## Troubleshooting

### Google Sign In Not Working
- Check if `REACT_APP_GOOGLE_CLIENT_ID` is set correctly
- Verify authorized JavaScript origins in Google Console
- Clear browser cache and cookies
- Check browser console for errors

### Authentication Not Persisting
- Check browser localStorage is enabled
- Clear localStorage and try again: `localStorage.clear()`
- Check for browser extensions blocking storage

### Can't Access Dashboard
- Ensure you're logged in (check localStorage for 'user' key)
- Try logging out and back in
- Check browser console for errors

## Testing Credentials

For development/testing without Google OAuth:
- **Any email/password combination will work in demo mode**
- Example: `test@example.com` / `password123`

## Support

For issues or questions:
- Check the **Help** section in the app
- Email: support@aqimonitor.com
- Phone: +91 98765 43210

