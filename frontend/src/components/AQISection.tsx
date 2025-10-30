import React from 'react';

interface AQISectionProps {
  currentAqi: number | null;
  predictedAqiNextHours: Array<{ t: string; aqi: number }>;
}

const bucket = (aqi: number) => {
  if (aqi <= 50) return { label: 'Good', color: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (aqi <= 100) return { label: 'Satisfactory', color: 'text-lime-700', bg: 'bg-lime-50' };
  if (aqi <= 200) return { label: 'Moderate', color: 'text-amber-700', bg: 'bg-amber-50' };
  if (aqi <= 300) return { label: 'Poor', color: 'text-orange-700', bg: 'bg-orange-50' };
  if (aqi <= 400) return { label: 'Very Poor', color: 'text-red-700', bg: 'bg-red-50' };
  return { label: 'Severe', color: 'text-purple-800', bg: 'bg-purple-50' };
};

const AQISection: React.FC<AQISectionProps> = ({ currentAqi, predictedAqiNextHours }) => {
  const badge = currentAqi != null ? bucket(currentAqi) : null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Current AQI</div>
          <div className="mt-1 text-4xl font-bold text-gray-900">
            {currentAqi != null ? Math.round(currentAqi) : '—'}
          </div>
          {badge && (
            <div className={`inline-block mt-2 px-2 py-1 rounded ${badge.bg} ${badge.color} text-sm`}>{
              badge.label
            }</div>
          )}
        </div>
        <div className="flex-1 ml-8">
          <div className="text-sm text-gray-500 mb-2">Next 6 hours prediction</div>
          <div className="grid grid-cols-6 gap-2">
            {predictedAqiNextHours.slice(0, 6).map((p) => {
              const b = bucket(p.aqi);
              return (
                <div key={p.t} className={`rounded p-2 text-center ${b.bg}`}>
                  <div className="text-xs text-gray-500">{p.t}</div>
                  <div className={`text-lg font-semibold ${b.color}`}>{Math.round(p.aqi)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQISection;


