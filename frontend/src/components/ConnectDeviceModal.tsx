import React, { useState } from 'react';
import { X, Wifi, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface ConnectDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectDeviceModal: React.FC<ConnectDeviceModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const generateApiKey = () => {
    const key = 'AQI_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(key);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate device connection
    setTimeout(() => {
      setIsConnecting(false);
      setStep(3);
    }, 2000);
  };

  const resetModal = () => {
    setStep(1);
    setDeviceName('');
    setDeviceId('');
    setApiKey('');
    setIsConnecting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Wifi size={24} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Connect IoT Device</h2>
              <p className="text-sm text-gray-500">Add a new air quality sensor to your network</p>
            </div>
          </div>
          <button
            onClick={resetModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium text-gray-600">Device Info</span>
            <span className="text-xs font-medium text-gray-600">Configuration</span>
            <span className="text-xs font-medium text-gray-600">Complete</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Device Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Name
                </label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="e.g., Living Room Sensor"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device ID / MAC Address
                </label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="e.g., ESP8266-A1B2C3 or 00:1A:2B:3C:4D:5E"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Device Requirements</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• ESP8266 or ESP32 with WiFi capability</li>
                      <li>• MQ135 or similar air quality sensor</li>
                      <li>• DHT11/DHT22 for temperature & humidity</li>
                      <li>• Power supply (5V USB or battery)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!deviceName || !deviceId}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Configure Device
              </button>
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    placeholder="Click 'Generate' to create API key"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={generateApiKey}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use this key in your device code to authenticate API requests
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">ESP8266 Configuration Code</h4>
                <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
{`// Add to your ESP8266 sketch
const char* apiKey = "${apiKey || 'YOUR_API_KEY'}";
const char* serverUrl = "http://localhost:3001/api/sensor-data";

void sendData() {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", apiKey);
  
  String payload = "{\\"temperature\\":" + String(temp) + 
                   ",\\"humidity\\":" + String(humidity) + 
                   ",\\"aq2\\":" + String(gasLevel) + "}";
  
  int httpCode = http.POST(payload);
  http.end();
}`}
                </pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!apiKey || isConnecting}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Device'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="space-y-6 text-center py-8">
              <div className="flex justify-center">
                <div className="p-4 bg-green-50 rounded-full">
                  <CheckCircle size={64} className="text-green-600" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Device Connected!</h3>
                <p className="text-gray-600">
                  {deviceName} has been successfully added to your network
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-4">Device Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{deviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Device ID:</span>
                    <span className="font-medium text-gray-900 font-mono text-sm">{deviceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="flex items-center gap-2 text-green-600 font-medium">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">API Key:</span>
                    <span className="font-medium text-gray-900 font-mono text-xs">{apiKey}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900 mb-1">Next Steps</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Upload the code to your ESP8266 device</li>
                      <li>• Power on the device and wait for WiFi connection</li>
                      <li>• Data will appear on the dashboard within 30 seconds</li>
                      <li>• Monitor real-time readings in the Sensor Cards section</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={resetModal}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectDeviceModal;

