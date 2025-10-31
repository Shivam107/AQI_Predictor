import React from 'react';

interface PredictionChartProps {
  history: Array<{ t: string; aqi: number }>;
  forecast: Array<{ t: string; aqi: number }>;
}

// Enhanced SVG line chart with readable labels and grid
const PredictionChart: React.FC<PredictionChartProps> = ({ history, forecast }) => {
  const all = [...history, ...forecast];
  const w = 700;
  const h = 300;
  const padLeft = 50;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 40;
  
  const maxAqi = Math.max(100, ...all.map((d) => d.aqi), 1);
  const minAqi = Math.min(0, ...all.map((d) => d.aqi));
  const aqiRange = maxAqi - minAqi;
  
  const scaleX = (i: number, n: number) => padLeft + (i * (w - padLeft - padRight)) / Math.max(1, n - 1);
  const scaleY = (v: number) => padTop + ((maxAqi - v) * (h - padTop - padBottom)) / Math.max(1, aqiRange);

  const pathFrom = (data: Array<{ t: string; aqi: number }>, offset: number) =>
    data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(offset + i, all.length)} ${scaleY(d.aqi)}`)
      .join(' ');

  const histPath = pathFrom(history, 0);
  const fcPath = pathFrom(forecast, history.length);

  // Generate Y-axis labels (AQI values)
  const yLabels = [];
  const numYLabels = 5;
  for (let i = 0; i <= numYLabels; i++) {
    const value = Math.round(minAqi + (aqiRange * i) / numYLabels);
    const y = scaleY(value);
    yLabels.push({ value, y });
  }

  // Generate X-axis labels (time/index) - improved for readability
  const xLabels = [];
  const totalPoints = all.length;
  
  if (totalPoints <= 10) {
    // Show all labels if few points
    for (let i = 0; i < totalPoints; i++) {
      xLabels.push({ label: all[i].t, x: scaleX(i, totalPoints) });
    }
  } else if (totalPoints <= 30) {
    // Show every 3rd label
    for (let i = 0; i < totalPoints; i += 3) {
      xLabels.push({ label: all[i].t, x: scaleX(i, totalPoints) });
    }
    // Always show the last point
    if ((totalPoints - 1) % 3 !== 0) {
      xLabels.push({ label: all[totalPoints - 1].t, x: scaleX(totalPoints - 1, totalPoints) });
    }
  } else {
    // Show ~8-10 evenly spaced labels for better readability
    const step = Math.floor(totalPoints / 8);
    for (let i = 0; i < totalPoints; i += step) {
      xLabels.push({ label: all[i].t, x: scaleX(i, totalPoints) });
    }
    // Always include the last point
    if ((totalPoints - 1) % step !== 0) {
      xLabels.push({ label: all[totalPoints - 1].t, x: scaleX(totalPoints - 1, totalPoints) });
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-gray-900">AQI History & Forecast</div>
        <div className="text-sm text-gray-500">
          Range: {minAqi} - {Math.round(maxAqi)} AQI
        </div>
      </div>
      <svg width={w} height={h} className="w-full" style={{ maxHeight: '350px' }}>
        {/* Background */}
        <rect x={0} y={0} width={w} height={h} fill="white" />
        
        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <g key={`grid-y-${i}`}>
            <line
              x1={padLeft}
              y1={label.y}
              x2={w - padRight}
              y2={label.y}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          </g>
        ))}
        
        {/* Y-axis labels (AQI values) */}
        {yLabels.map((label, i) => (
          <text
            key={`label-y-${i}`}
            x={padLeft - 10}
            y={label.y + 4}
            textAnchor="end"
            fontSize="12"
            fill="#6b7280"
          >
            {label.value}
          </text>
        ))}
        
        {/* X-axis labels (time) - improved spacing and rotation for readability */}
        {xLabels.map((label, i) => (
          <text
            key={`label-x-${i}`}
            x={label.x}
            y={h - 10}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
            transform={xLabels.length > 8 ? `rotate(-45, ${label.x}, ${h - 10})` : undefined}
          >
            {label.label}
          </text>
        ))}
        
        {/* Y-axis title */}
        <text
          x={15}
          y={h / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          fontWeight="600"
          transform={`rotate(-90, 15, ${h / 2})`}
        >
          AQI Value
        </text>
        
        {/* X-axis title */}
        <text
          x={w / 2}
          y={h - 2}
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          fontWeight="600"
        >
          Time Period (History → Forecast)
        </text>
        
        {/* Data lines */}
        <path d={histPath} stroke="#0ea5e9" strokeWidth={2.5} fill="none" />
        <path d={fcPath} stroke="#f97316" strokeWidth={2.5} fill="none" strokeDasharray="6 6" />
        
        {/* Data points for history */}
        {history.map((d, i) => (
          <circle
            key={`point-h-${i}`}
            cx={scaleX(i, all.length)}
            cy={scaleY(d.aqi)}
            r={3}
            fill="#0ea5e9"
          />
        ))}
        
        {/* Data points for forecast */}
        {forecast.map((d, i) => (
          <circle
            key={`point-f-${i}`}
            cx={scaleX(history.length + i, all.length)}
            cy={scaleY(d.aqi)}
            r={3}
            fill="#f97316"
          />
        ))}
      </svg>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-sky-500 inline-block"></span>
          <span>History ({history.length} points)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-orange-500 inline-block"></span>
          <span>Forecast ({forecast.length} points)</span>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;


