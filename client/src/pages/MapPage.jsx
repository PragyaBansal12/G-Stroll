import React, { useState, useCallback } from 'react';
import { 
  GoogleMap, 
  useJsApiLoader, 
  DirectionsService, 
  DirectionsRenderer, 
  Marker, 
  Autocomplete,
  Polyline 
} from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocationTracking } from '../hooks/useLocationTracking';

const containerStyle = { width: '100vw', height: '100vh' };
const libraries = ['places'];

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  
  const queryParams = new URLSearchParams(location.search);
  const [currentDestination, setCurrentDestination] = useState(queryParams.get('destination'));
  const [destCoords, setDestCoords] = useState(null);

  // FEATURE 2: Live GPS Tracking Hook
  const { location: userLocation } = useLocationTracking();
  const startLat = parseFloat(queryParams.get('startLat'));
  const startLng = parseFloat(queryParams.get('startLng'));
  
  // Dynamic Origin: Prefers real-time GPS, falls back to URL data
  const origin = userLocation || { lat: startLat || 22.7196, lng: startLng || 75.8577 };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "", 
    libraries: libraries
  });

  // FEATURE 3: Search Logic
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setResponse(null); // Reset for new route calculation
        setCurrentDestination(place.formatted_address || place.name);
        setDestCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setTimeout(() => onPlaceChanged(), 100);
    }
  };

  // FEATURE 4: Directions Callback
  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === 'OK') {
      setResponse(res);
    } else {
      console.warn("Directions API failed or denied. Fallback to manual line.");
    }
  }, []);

  if (!isLoaded) return <div style={styles.loading}>Initializing Maps...</div>;

  return (
    <div style={{ position: 'relative' }}>
      {/* UI Overlays */}
      <button onClick={() => navigate(-1)} style={styles.backBtn}>⬅ Back</button>

      <div style={styles.searchContainer}>
        <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
          <input 
            type="text" 
            placeholder="Search destination..." 
            style={styles.searchInput} 
            onKeyDown={handleKeyDown}
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={origin}
        zoom={15}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {/* User Marker */}
        <Marker 
          position={origin} 
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
          }}
        />

        {/* FEATURE 4: Directions Logic */}
        {currentDestination && !response && (
          <DirectionsService
            options={{
              origin: origin,
              destination: currentDestination,
              travelMode: 'WALKING'
            }}
            callback={directionsCallback}
          />
        )}

        {/* Real Blue Line */}
        {response && (
          <DirectionsRenderer
            directions={response}
            options={{ polylineOptions: { strokeColor: "#4285F4", strokeWeight: 6 } }}
          />
        )}

        {/* FALLBACK BLUE LINE: Shows if Directions API is blocked */}
        {!response && destCoords && (
          <>
            <Polyline
              path={[origin, destCoords]}
              options={{ strokeColor: "#4285F4", strokeWeight: 6, strokeOpacity: 0.6, geodesic: true }}
            />
            <Marker position={destCoords} label="B" />
          </>
        )}
      </GoogleMap>

      {/* Info Card */}
      {(response || destCoords) && (
        <div style={styles.routeCard}>
          <h4 style={{margin: '0 0 5px 0'}}>Navigation Active</h4>
          <p style={{margin: '0 0 10px 0', fontSize: '13px', color: '#555'}}>{currentDestination}</p>
          <div style={styles.statsRow}>
             <span>📏 {response ? response.routes[0].legs[0].distance.text : "Direct Path"}</span>
             <span style={{color: response ? '#1e8e3e' : '#f4b400'}}>
               {response ? "● Accessible Route" : "● Fallback Mode"}
             </span>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  backBtn: { position: 'absolute', top: '20px', left: '20px', zIndex: 10, padding: '10px 15px', borderRadius: '12px', border: 'none', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 'bold' },
  searchContainer: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '70%', maxWidth: '400px' },
  searchInput: { width: '100%', padding: '15px 20px', borderRadius: '30px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontSize: '16px', outline: 'none' },
  routeCard: { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '350px', background: 'white', padding: '20px', borderRadius: '20px', zIndex: 10, boxShadow: '0 4px 25px rgba(0,0,0,0.3)' },
  statsRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', fontWeight: 'bold', color: '#666' }
};

export default MapPage;