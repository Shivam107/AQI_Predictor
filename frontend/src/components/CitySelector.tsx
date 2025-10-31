import React from 'react';
import { MapPin } from 'lucide-react';
import { useCity } from '../contexts/CityContext';

const CitySelector: React.FC = () => {
  const { selectedCity, setSelectedCity, availableCities } = useCity();

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
        <MapPin className="w-5 h-5 text-blue-600" />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="appearance-none bg-transparent border-none outline-none cursor-pointer font-medium text-gray-700 pr-8"
          style={{ backgroundImage: 'none' }}
        >
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <svg
          className="w-4 h-4 text-gray-500 pointer-events-none absolute right-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default CitySelector;

