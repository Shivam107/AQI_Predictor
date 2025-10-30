import React from 'react';

interface MapViewProps {
  gps: { lat: number; lng: number } | null;
}

// Lightweight static map placeholder without external libs
const MapView: React.FC<MapViewProps> = ({ gps }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-gray-900">Device Location</div>
        <div className="text-sm text-gray-600">{gps ? `${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}` : 'No GPS fix'}</div>
      </div>
      <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
        {gps ? 'Map Placeholder' : 'Awaiting GPS'}
      </div>
    </div>
  );
};

export default MapView;


