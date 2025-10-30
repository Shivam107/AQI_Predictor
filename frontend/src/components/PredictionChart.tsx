import React from 'react';

interface PredictionChartProps {
  history: Array<{ t: string; aqi: number }>;
  forecast: Array<{ t: string; aqi: number }>;
}

// Minimal SVG line chart to avoid adding chart libs
const PredictionChart: React.FC<PredictionChartProps> = ({ history, forecast }) => {
  const all = [...history, ...forecast];
  const w = 600;
  const h = 200;
  const pad = 24;
  const maxAqi = Math.max(100, ...all.map((d) => d.aqi));
  const minAqi = Math.min(0, ...all.map((d) => d.aqi));
  const scaleX = (i: number, n: number) => pad + (i * (w - 2 * pad)) / Math.max(1, n - 1);
  const scaleY = (v: number) => h - pad - ((v - minAqi) * (h - 2 * pad)) / Math.max(1, maxAqi - minAqi);

  const pathFrom = (data: Array<{ t: string; aqi: number }>, offset: number) =>
    data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(offset + i, all.length)} ${scaleY(d.aqi)}`)
      .join(' ');

  const histPath = pathFrom(history, 0);
  const fcPath = pathFrom(forecast, history.length);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold text-gray-900">AQI History & Forecast</div>
      </div>
      <svg width={w} height={h} className="w-full h-52">
        <rect x={0} y={0} width={w} height={h} fill="white" />
        <path d={histPath} stroke="#0ea5e9" strokeWidth={2} fill="none" />
        <path d={fcPath} stroke="#f97316" strokeWidth={2} fill="none" strokeDasharray="6 6" />
      </svg>
      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-sky-500 inline-block"></span> History</div>
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-orange-500 inline-block"></span> Forecast</div>
      </div>
    </div>
  );
};

export default PredictionChart;


