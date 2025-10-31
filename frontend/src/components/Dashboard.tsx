import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SensorCards from './SensorCards';
import AQISection from './AQISection';
import PredictionChart from './PredictionChart';
import MitigationPanel from './MitigationPanel';
import MapView from './MapView';
import CalendarView from './CalendarView';
import Analytics from './Analytics';
import Team from './Team';
import Settings from './Settings';
import Help from './Help';
import ConnectDeviceModal from './ConnectDeviceModal';
import NotificationsPanel from './NotificationsPanel';
import MessagesPanel from './MessagesPanel';
import { AqiPoint, fetchLiveMergedHistory, fetchPredictions, naiveForecast, subscribeSensors } from './data';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [isConnectDeviceOpen, setIsConnectDeviceOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [useRealLocation, setUseRealLocation] = useState(true);
  const [customLocation, setCustomLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get real user location
  const realLocation = useGeolocation(true); // Watch position continuously

  // Preset locations
  const presetLocations = {
    dahmiKalan: { lat: 26.8122, lng: 75.5345, name: 'Dahmi Kalan, Bagru, Jaipur' },
    ahmedabad: { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad, Gujarat' },
  };

  const refreshLocation = () => {
    // Force browser to re-request location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGps({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // Don't use cached location
        }
      );
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };
  const [history, setHistory] = useState<AqiPoint[]>([]);
  const [forecast, setForecast] = useState<AqiPoint[]>([]);
  const [temperatureC, setTemperatureC] = useState<number | null>(null);
  const [humidityPct, setHumidityPct] = useState<number | null>(null);
  const [gasAq2Ppm, setGasAq2Ppm] = useState<number | null>(null);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAqi, setCurrentAqi] = useState<number | null>(null);

  // Update GPS with real location, custom location, or sensor location
  useEffect(() => {
    if (customLocation) {
      setGps(customLocation);
    } else if (useRealLocation && realLocation.latitude && realLocation.longitude) {
      setGps({
        lat: realLocation.latitude,
        lng: realLocation.longitude,
      });
    }
  }, [realLocation.latitude, realLocation.longitude, useRealLocation, customLocation]);

  const setPresetLocation = (preset: keyof typeof presetLocations) => {
    const location = presetLocations[preset];
    setCustomLocation({ lat: location.lat, lng: location.lng });
    setUseRealLocation(false);
  };

  useEffect(() => {
    // Backend merged data for historic dashboard
    fetchLiveMergedHistory()
      .then((data) => {
        // e.g. use last 24 as history for charts
        if (Array.isArray(data) && data.length > 0) {
          const h = data.slice(-24).map((row: any, idx: number) => ({
            t: row.Month ? `M${row.Month}` : `${idx}`,
            aqi: row.AQI ? Number(row.AQI) : 0,
          }));
          setHistory(h);
          // also set one for current AQI if present
          if (h.length) setCurrentAqi(h[h.length - 1].aqi);
        }
      })
      .catch((err) => {
        console.error('Error fetching history:', err);
        // Continue with simulated data
      });
    
    // Prediction for current month (backend-powered)
    const month = new Date().getMonth() + 1;
    fetchPredictions(month)
      .then((pred) => setForecast(pred))
      .catch((err) => console.error('Error fetching predictions:', err));
    
    // Legacy: keep simulated live updating too
    let unsub = subscribeSensors((s) => {
      setTemperatureC(s.temperatureC);
      setHumidityPct(s.humidityPct);
      setGasAq2Ppm(s.gasAq2Ppm);
      setGps(s.gps);
      setCurrentAqi(s.currentAqi);
      const t = new Date();
      const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHistory((h) => [...h.slice(-23), { t: label, aqi: Math.round(s.currentAqi || 0) }]);
    });
    return () => {
      unsub();
    };
  }, []);

  const effectiveForecast = useMemo(() => {
    return forecast.length ? forecast : naiveForecast(history, 6);
  }, [forecast, history]);

  // Convert history data to calendar format
  const calendarData = useMemo(() => {
    const data: { date: Date; aqi: number }[] = [];
    const now = new Date();
    
    // Generate data for the last 30 days with some variation
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Use current AQI with some random variation for past days
      const baseAqi = currentAqi ?? 100;
      const variation = Math.random() * 40 - 20; // +/- 20
      const aqi = Math.max(0, Math.round(baseAqi + variation));
      
      data.push({ date, aqi });
    }
    
    return data;
  }, [currentAqi]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onOpenMessages={() => setIsMessagesOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' ? (
            <>
              {/* Dashboard Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">IoT Air Quality Dashboard</h1>
                  <p className="text-gray-500 mt-1">Live sensors, AQI status, forecasts, and mitigation actions.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button 
                    onClick={() => {
                      setCustomLocation(null);
                      setUseRealLocation(true);
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      useRealLocation && !customLocation
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📍 My Location
                  </button>
                  <button 
                    onClick={() => setPresetLocation('dahmiKalan')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      customLocation?.lat === presetLocations.dahmiKalan.lat
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📌 Dahmi Kalan, Jaipur
                  </button>
                  <button 
                    onClick={() => setIsConnectDeviceOpen(true)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                  >
                    Connect Device
                  </button>
                </div>
              </div>
              {/* Location Status Banner */}
              {realLocation.error && useRealLocation && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">Location Access Required</h4>
                      <p className="text-sm text-yellow-700 mb-2">{realLocation.error}</p>
                      <button
                        onClick={() => setUseRealLocation(false)}
                        className="text-sm text-yellow-800 underline hover:text-yellow-900"
                      >
                        Use simulated sensor location instead
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {customLocation && (
                <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📌</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900">
                        {presetLocations.dahmiKalan.lat === customLocation.lat 
                          ? 'Dahmi Kalan, Bagru, Jaipur, Rajasthan' 
                          : 'Custom Location'}
                      </h4>
                      <p className="text-sm text-purple-700">
                        Lat: {customLocation.lat.toFixed(6)}, Lng: {customLocation.lng.toFixed(6)}
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps?q=${customLocation.lat},${customLocation.lng}`, '_blank')}
                      className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      View on Map
                    </button>
                  </div>
                </div>
              )}

              {!realLocation.error && useRealLocation && !customLocation && realLocation.latitude && realLocation.longitude && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">Using Your Real Location</h4>
                      <p className="text-sm text-green-700">
                        Lat: {realLocation.latitude?.toFixed(6)}, Lng: {realLocation.longitude?.toFixed(6)}
                        {realLocation.accuracy && ` (±${Math.round(realLocation.accuracy)}m)`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={refreshLocation}
                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="Refresh location"
                      >
                        🔄 Refresh
                      </button>
                      <button
                        onClick={() => window.open(`https://www.google.com/maps?q=${realLocation.latitude},${realLocation.longitude}`, '_blank')}
                        className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sensor Cards */}
              <SensorCards readings={{
                temperatureC: temperatureC ?? undefined,
                humidityPct: humidityPct ?? undefined,
                gasAq2Ppm: gasAq2Ppm ?? undefined,
                gps,
              }} />
              {/* Main Grid Layout */}
              <div className="grid grid-cols-3 gap-6 mt-6">
                {/* Left Section - 2 columns */}
                <div className="col-span-2 space-y-6">
                  <AQISection currentAqi={currentAqi} predictedAqiNextHours={effectiveForecast} />
                  <PredictionChart history={history} forecast={effectiveForecast} />
                </div>
                {/* Right Section - 1 column */}
                <div className="space-y-6">
                  <MitigationPanel aqi={currentAqi ?? 100} />
                  <MapView gps={gps} />
                </div>
              </div>
            </>
          ) : activeView === 'calendar' ? (
            <CalendarView aqiData={calendarData} />
          ) : activeView === 'analytics' ? (
            <Analytics history={history} currentAqi={currentAqi} />
          ) : activeView === 'team' ? (
            <Team />
          ) : activeView === 'settings' ? (
            <Settings />
          ) : activeView === 'help' ? (
            <Help />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                <p className="text-gray-500">This feature is under development</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals and Panels */}
      <ConnectDeviceModal 
        isOpen={isConnectDeviceOpen}
        onClose={() => setIsConnectDeviceOpen(false)}
      />
      <NotificationsPanel 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <MessagesPanel 
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
