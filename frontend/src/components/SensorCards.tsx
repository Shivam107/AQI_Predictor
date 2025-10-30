import React from 'react';

type SensorReading = {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'ok' | 'warn' | 'alert';
};

interface SensorCardsProps {
  readings: {
    temperatureC?: number;
    humidityPct?: number;
    gasAq2Ppm?: number;
    gps?: { lat: number; lng: number } | null;
  };
}

const statusColor = (status: SensorReading['status']) => {
  if (status === 'alert') return 'bg-red-100 text-red-700 border-red-200';
  if (status === 'warn') return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-white text-gray-900 border-gray-200';
};

const SensorCard: React.FC<{ reading: SensorReading }> = ({ reading }) => {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${statusColor(reading.status)}`}>
      <div className="text-sm text-gray-500">{reading.label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {reading.value}
        {reading.unit ? <span className="ml-1 text-base font-normal">{reading.unit}</span> : null}
      </div>
    </div>
  );
};

const SensorCards: React.FC<SensorCardsProps> = ({ readings }) => {
  const cards: SensorReading[] = [
    {
      label: 'Temperature',
      value: readings.temperatureC != null ? readings.temperatureC.toFixed(1) : '—',
      unit: readings.temperatureC != null ? '°C' : undefined,
      status:
        readings.temperatureC != null
          ? readings.temperatureC > 40
            ? 'alert'
            : readings.temperatureC > 32
            ? 'warn'
            : 'ok'
          : undefined,
    },
    {
      label: 'Humidity',
      value: readings.humidityPct != null ? readings.humidityPct.toFixed(0) : '—',
      unit: readings.humidityPct != null ? '%' : undefined,
      status:
        readings.humidityPct != null
          ? readings.humidityPct < 25
            ? 'alert'
            : readings.humidityPct < 40
            ? 'warn'
            : 'ok'
          : undefined,
    },
    {
      label: 'AQ-2 Gas',
      value: readings.gasAq2Ppm != null ? readings.gasAq2Ppm.toFixed(2) : '—',
      unit: readings.gasAq2Ppm != null ? 'ppm' : undefined,
      status:
        readings.gasAq2Ppm != null
          ? readings.gasAq2Ppm > 150
            ? 'alert'
            : readings.gasAq2Ppm > 80
            ? 'warn'
            : 'ok'
          : undefined,
    },
    {
      label: 'GPS',
      value:
        readings.gps != null
          ? `${readings.gps.lat.toFixed(5)}, ${readings.gps.lng.toFixed(5)}`
          : 'No fix',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <SensorCard key={c.label} reading={c} />
      ))}
    </div>
  );
};

export default SensorCards;


