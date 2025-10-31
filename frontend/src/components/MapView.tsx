import React, { useState } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface MapViewProps {
  gps: { lat: number; lng: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ gps }) => {
  const [mapError, setMapError] = useState(false);
  const lat = gps?.lat ?? 23.0225;
  const lng = gps?.lng ?? 72.5714;

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const getDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Device Location</h3>
        </div>
        <button
          onClick={openInGoogleMaps}
          className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
          title="Open in Google Maps"
        >
          <ExternalLink size={18} />
        </button>
      </div>
      
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        {!mapError ? (
          <>
            <iframe
              title="sensor-location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
              className="rounded-lg"
              onError={() => setMapError(true)}
            ></iframe>
            {/* Overlay with location marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div className="relative">
                <div className="w-6 h-6 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-6 h-6 bg-red-600 rounded-full relative flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-4">
              <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                {gps ? `Location: ${lat.toFixed(5)}, ${lng.toFixed(5)}` : 'Awaiting GPS'}
              </p>
              <button
                onClick={openInGoogleMaps}
                className="text-sm text-emerald-600 hover:text-emerald-700 underline"
              >
                View on Google Maps
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Latitude:</span>
          <span className="font-mono font-medium text-gray-900">{lat.toFixed(6)}°</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Longitude:</span>
          <span className="font-mono font-medium text-gray-900">{lng.toFixed(6)}°</span>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <button
            onClick={getDirections}
            className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-sm"
          >
            <Navigation size={16} />
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;


