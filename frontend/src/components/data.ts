import { getMergedData, getAqiPrediction, getLatestSensorData } from '../api';

export type SensorSnapshot = {
  temperatureC: number | null;
  humidityPct: number | null;
  gasAq2Ppm: number | null;
  gps: { lat: number; lng: number } | null;
  currentAqi: number | null;
};

export type AqiPoint = { t: string; aqi: number };

// Fetch forecasts from backend for the next 6 hours based on historical predictions
export async function fetchPredictions(month: number): Promise<AqiPoint[]> {
  try {
    const res = await getAqiPrediction(month);
    if (res && res.predicted_aqi != null) {
      // return 6 future prediction points with same predicted aqi for UI
      const now = new Date();
      return Array.from({ length: 6 }, (_, i) => {
        const t = new Date(now.getTime() + (i + 1) * 60 * 60 * 1000);
        return { t: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), aqi: Math.round(res.predicted_aqi) };
      });
    }
    return [];
  } catch {
    return [];
  }
}

// Minimal moving-average forecast fallback
export function naiveForecast(history: AqiPoint[], horizon = 6): AqiPoint[] {
  const last = history.slice(-6);
  const avg = last.length ? last.reduce((a, b) => a + b.aqi, 0) / last.length : 100;
  const now = new Date();
  return Array.from({ length: horizon }, (_, i) => {
    const t = new Date(now.getTime() + (i + 1) * 60 * 60 * 1000);
    return { t: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), aqi: Math.round(avg) };
  });
}

// Replace with backend sensor fetch (future DB/Atlas integration)
export async function fetchLiveMergedHistory(city?: string) {
  return await getMergedData(city);
}

// Fetch real sensor data with fallback to simulated data
export function subscribeSensors(cb: (s: SensorSnapshot) => void): () => void {
  let active = true;
  let consecutiveFailures = 0;
  const MAX_FAILURES = 3;

  const tick = async () => {
    if (!active) return;
    
    try {
      // Try to fetch real sensor data
      const result = await getLatestSensorData();
      
      if (result.success && result.data && result.data.values) {
        consecutiveFailures = 0;
        const values = result.data.values;
        const s: SensorSnapshot = {
          temperatureC: values.temperature ?? null,
          humidityPct: values.humidity ?? null,
          gasAq2Ppm: values.aq2 ?? null,
          gps: values.gps ? { 
            lat: values.gps.latitude, 
            lng: values.gps.longitude 
          } : null,
          currentAqi: values.aq2 ? Math.round(values.aq2) : null,
        };
        cb(s);
      } else {
        throw new Error('No sensor data available');
      }
    } catch (error) {
      consecutiveFailures++;
      
      // Fallback to simulated data after failures
      if (consecutiveFailures >= MAX_FAILURES) {
        console.log('Falling back to simulated sensor data');
        const s: SensorSnapshot = {
          temperatureC: 22 + Math.random() * 15,
          humidityPct: 35 + Math.random() * 40,
          gasAq2Ppm: 40 + Math.random() * 140,
          gps: { 
            lat: 23.0225 + (Math.random() - 0.5) * 0.001, 
            lng: 72.5714 + (Math.random() - 0.5) * 0.001 
          },
          currentAqi: 80 + Math.random() * 180,
        };
        cb(s);
      }
    }
  };

  const id = setInterval(tick, 3000);
  tick(); // Initial call
  
  return () => {
    active = false;
    clearInterval(id);
  };
}


