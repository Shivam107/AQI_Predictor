// API utility functions for AQI dashboard

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3001').replace(/\/$/, '');

export async function uploadSensorData(sensorPayload: any) {
  const response = await fetch(`${API_BASE}/api/sensor-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sensorPayload),
  });
  return response.json();
}

export async function getLatestSensorData() {
  try {
    const response = await fetch(`${API_BASE}/api/sensor-data/latest`);
    const result = await response.json();
    return result;
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function getMergedData() {
  const response = await fetch(`${API_BASE}/api/merged-data`);
  return response.json();
}

export async function getAqiPrediction(month: number) {
  const response = await fetch(`${API_BASE}/api/predict-aqi/?month=${month}`);
  return response.json();
}

export async function getMitigationAdvice(aqi: number) {
  try {
    const response = await fetch(`${API_BASE}/api/mitigation-advice/?aqi=${aqi}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (err) {
    // Graceful fallback to avoid crashing UI when backend is down or unreachable
    return {
      AQI: aqi,
      Category: 'Unknown',
      Warnings: ['Backend unavailable or network error.'],
      Actions: ['Retry later', 'Check server at REACT_APP_API_URL or :3001'],
    };
  }
}
