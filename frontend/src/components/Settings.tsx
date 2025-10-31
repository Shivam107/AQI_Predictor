import React, { useState } from 'react';
import { User, Bell, Shield, Eye, MapPin, Wifi, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    aqiAlerts: true,
    emailUpdates: true,
    smsAlerts: false,
    weeklyReports: true,
  });

  const [thresholds, setThresholds] = useState({
    aqiWarning: 150,
    aqiDanger: 200,
    tempWarning: 35,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareLocation: true,
    publicProfile: false,
    dataSharing: true,
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <User size={24} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                <p className="text-sm text-gray-500">Update your personal information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full"
                />
                <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition">
                  Change Photo
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    defaultValue="Ahmedabad, Gujarat, India"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">Manage your alert preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-500">
                      {key === 'aqiAlerts' && 'Get notified when AQI exceeds thresholds'}
                      {key === 'emailUpdates' && 'Receive updates via email'}
                      {key === 'smsAlerts' && 'Get SMS alerts for critical levels'}
                      {key === 'weeklyReports' && 'Weekly summary of air quality data'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => setNotifications({ ...notifications, [key]: !value })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* AQI Thresholds */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Wifi size={24} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Alert Thresholds</h2>
                <p className="text-sm text-gray-500">Set custom thresholds for alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AQI Warning Level
                </label>
                <input
                  type="number"
                  value={thresholds.aqiWarning}
                  onChange={(e) => setThresholds({ ...thresholds, aqiWarning: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Get warning alerts when AQI exceeds this value</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AQI Danger Level
                </label>
                <input
                  type="number"
                  value={thresholds.aqiDanger}
                  onChange={(e) => setThresholds({ ...thresholds, aqiDanger: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Get critical alerts when AQI exceeds this value</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature Warning (°C)
                </label>
                <input
                  type="number"
                  value={thresholds.tempWarning}
                  onChange={(e) => setThresholds({ ...thresholds, tempWarning: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Get alerts when temperature exceeds this value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Shield size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Privacy</h2>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(privacySettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => setPrivacySettings({ ...privacySettings, [key]: !value })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Eye size={24} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Appearance</h2>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition text-left">
                🌞 Light Mode (Active)
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-left">
                🌙 Dark Mode
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-left">
                ⚡ Auto
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                Reset All Settings
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

