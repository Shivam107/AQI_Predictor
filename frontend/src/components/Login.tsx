import React, { useEffect, useState } from 'react';
import { Mail, Lock, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google?: any;
  }
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Only load Google Sign-In if a valid client ID is configured
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID' && !clientId.includes('your-')) {
      // Load Google Sign-In script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
        initializeGoogleSignIn();
      };
      document.body.appendChild(script);

      return () => {
        try {
          document.body.removeChild(script);
        } catch (e) {
          // Script already removed
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeGoogleSignIn = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (window.google && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSignIn,
        });

        const buttonDiv = document.getElementById('googleSignInButton');
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: 'outline',
            size: 'large',
            width: 400,
            text: 'signin_with',
          });
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        setIsGoogleLoaded(false);
      }
    }
  };

  const handleGoogleSignIn = (response: any) => {
    try {
      // Decode JWT token to get user info
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const userData = JSON.parse(jsonPayload);
      
      login({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        id: userData.sub,
      });
    } catch (error) {
      console.error('Error processing Google Sign-In:', error);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login for testing without Google OAuth setup
    if (email && password) {
      login({
        email: email,
        name: email.split('@')[0],
        id: 'demo-' + Date.now(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 border-4 border-white rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AQI Monitor</h1>
          <p className="text-gray-500">Sign in to access your air quality dashboard</p>
        </div>

        {/* Google Sign In Button */}
        <div className="mb-6">
          {isGoogleLoaded ? (
            <div id="googleSignInButton" className="flex justify-center"></div>
          ) : (
            <button
              type="button"
              onClick={() => {
                // Demo mode: Quick login without Google OAuth
                login({
                  email: 'demo@gmail.com',
                  name: 'Demo User',
                  picture: 'https://ui-avatars.com/api/?name=Demo+User&background=10b981&color=fff',
                  id: 'demo-google-' + Date.now(),
                });
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Chrome size={20} />
              Sign in with Google (Demo)
            </button>
          )}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <button className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

