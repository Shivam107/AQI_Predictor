import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = (watch: boolean = false) => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unable to retrieve your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }

      setLocation({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: errorMessage,
        loading: false,
      });
    };

    if (watch) {
      // Continuously watch position
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      // Get position once
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    }
  }, [watch]);

  return location;
};

