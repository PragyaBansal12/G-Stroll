import { useState, useEffect } from 'react';

export const useLocationTracking = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    // This starts the "Live" watching
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true, // Crucial for precise navigation
        distanceFilter: 10,        // Only update if they move 10 meters
      }
    );

    // Cleanup: Stops GPS when component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};