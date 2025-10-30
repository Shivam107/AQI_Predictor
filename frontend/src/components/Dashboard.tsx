import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SensorCards from './SensorCards';
import AQISection from './AQISection';
import PredictionChart from './PredictionChart';
import MitigationPanel from './MitigationPanel';
import MapView from './MapView';
import { AqiPoint, fetchLiveMergedHistory, fetchPredictions, naiveForecast, subscribeSensors } from './data';

const Dashboard: React.FC = () => {
  const [isSidebarOpen] = useState(true);
  const [history, setHistory] = useState<AqiPoint[]>([]);
  const [forecast, setForecast] = useState<AqiPoint[]>([]);
  const [temperatureC, setTemperatureC] = useState<number | null>(null);
  const [humidityPct, setHumidityPct] = useState<number | null>(null);
  const [gasAq2Ppm, setGasAq2Ppm] = useState<number | null>(null);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAqi, setCurrentAqi] = useState<number | null>(null);

  useEffect(() => {
    // Backend merged data for historic dashboard
    fetchLiveMergedHistory().then((data) => {
      // e.g. use last 24 as history for charts
      if (Array.isArray(data)) {
        const h = data.slice(-24).map((row: any, idx: number) => ({
          t: row.Month ? `M${row.Month}` : `${idx}`,
          aqi: row.AQI ? Number(row.AQI) : 0,
        }));
        setHistory(h);
        // also set one for current AQI if present
        if (h.length) setCurrentAqi(h[h.length - 1].aqi);
      }
    });
    // Prediction for current month (backend-powered)
    const month = new Date().getMonth() + 1;
    fetchPredictions(month).then((pred) => setForecast(pred));
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">IoT Air Quality Dashboard</h1>
              <p className="text-gray-500 mt-1">Live sensors, AQI status, forecasts, and mitigation actions.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
                Connect Device
              </button>
            </div>
          </div>
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
