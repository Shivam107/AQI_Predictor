import { getMergedData, getAqiPrediction } from '../api';

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
export async function fetchLiveMergedHistory() {
  return await getMergedData();
}

// Simulated sensor stream (replace with real WebSocket/HTTP in production)
export function subscribeSensors(cb: (s: SensorSnapshot) => void): () => void {
  let active = true;
  const tick = () => {
    if (!active) return;
    const s: SensorSnapshot = {
      temperatureC: 22 + Math.random() * 15,
      humidityPct: 35 + Math.random() * 40,
      gasAq2Ppm: 40 + Math.random() * 140,
      gps: { lat: 23.0225 + (Math.random() - 0.5) * 0.001, lng: 72.5714 + (Math.random() - 0.5) * 0.001 },
      currentAqi: 80 + Math.random() * 180,
    };
    cb(s);
  };
  const id = setInterval(tick, 3000);
  tick();
  return () => {
    active = false;
    clearInterval(id);
  };
}


