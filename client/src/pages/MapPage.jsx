import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const MapPage = () => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const autocompleteInputRef = useRef(null)
  const userMarkerRef = useRef(null)
  const destMarkerRef = useRef(null)
  const directionsRendererRef = useRef(null)
  const watchIdRef = useRef(null)

  const [userLocation, setUserLocation] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [mapMoving, setMapMoving] = useState(false)

  const navigate = useNavigate()

  /* ---------------- INIT MAP ---------------- */
  useEffect(() => {
    const startLoad = async () => {
      if (window.google) {
        try {
          await window.google.maps.importLibrary("maps")
          await window.google.maps.importLibrary("marker")

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
              initMap(loc)
            },
            () => {
              initMap({ lat: 28.6139, lng: 77.209 }) // Delhi fallback
            }
          )
        } catch (error) {
          console.error("Maps load error:", error)
        }
      }
    }
    startLoad()
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [])

  const initMap = async (loc) => {
    setUserLocation(loc)
    const { Map } = await window.google.maps.importLibrary("maps")
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker")

    mapInstance.current = new Map(mapRef.current, {
      center: loc,
      zoom: 17,
      mapId: "3b8335eb9c9526963a629baf",
      disableDefaultUI: true,
      zoomControl: false,
    })

    userMarkerRef.current = new AdvancedMarkerElement({
      map: mapInstance.current,
      position: loc,
      title: "You",
    })

    mapInstance.current.addListener("dragstart", () => setMapMoving(true))

    // Setup the Legacy Autocomplete with required fields
    // Inside initMap...
    if (window.google.maps.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
        // requesting 'geometry' is what provides the lat/lng coordinates
        fields: ["geometry", "name", "formatted_address"],
        types: ["establishment", "geocode"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        // If billing is not fixed, geometry will often be undefined
        if (!place.geometry || !place.geometry.location) {
          alert("Search failed. Please ensure Billing is enabled in Google Console.");
          return;
        }

        const destination = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        // This triggers the blue route line
        drawRoute(destination);
      });
    }
  }

  /* ---------------- DRAW ROUTE ---------------- */
  const drawRoute = (destination) => {
    const directionsService = new window.google.maps.DirectionsService()
    if (directionsRendererRef.current) directionsRendererRef.current.setMap(null)

    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#2563EB", strokeWeight: 8 }
    })
    directionsRendererRef.current.setMap(mapInstance.current)

    directionsService.route({
      origin: userLocation,
      destination,
      travelMode: window.google.maps.TravelMode.WALKING,
    }, (result, status) => {
      if (status === "OK") {
        directionsRendererRef.current.setDirections(result)
        const leg = result.routes[0].legs[0]
        setRouteInfo({
          distance: leg.distance.text,
          duration: leg.duration.text,
          steps: leg.steps
        })

        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(userLocation)
        bounds.extend(destination)
        mapInstance.current.fitBounds(bounds)
      }
    })
  }

  /* ---------------- NAVIGATION ---------------- */
  const startNavigation = () => {
    setIsNavigating(true)
    setMapMoving(false)
    watchIdRef.current = navigator.geolocation.watchPosition((pos) => {
      const updatedLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      setUserLocation(updatedLoc)
      userMarkerRef.current.position = updatedLoc
      if (!mapMoving) {
        mapInstance.current.panTo(updatedLoc)
        mapInstance.current.setZoom(19)
      }
    }, (err) => console.error(err), { enableHighAccuracy: true })
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
      {/* Map Background */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Floating Search Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-gray-100">
          <input
            ref={autocompleteInputRef}
            type="text"
            placeholder="Search destination..."
            className="w-full bg-transparent border-none outline-none text-gray-800 font-semibold placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Recenter Button */}
      {mapMoving && (
        <button
          onClick={() => { mapInstance.current.panTo(userLocation); setMapMoving(false); }}
          className="absolute top-24 right-6 z-20 bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg font-bold text-sm"
        >
          Recenter 🎯
        </button>
      )}

      {/* Info Panel */}
      {routeInfo && !isNavigating && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Route Info</p>
                <h2 className="text-3xl font-black text-gray-900">{routeInfo.duration}</h2>
              </div>
              <p className="text-blue-600 font-black text-xl mb-1">{routeInfo.distance}</p>
            </div>
            <button
              onClick={startNavigation}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              START NAVIGATION
            </button>
          </div>
        </div>
      )}

      {/* Navigation HUD */}
      {isNavigating && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md">
          <div className="bg-gray-900 text-white rounded-[2rem] p-5 shadow-2xl flex items-center justify-between border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <p className="font-bold text-sm tracking-wide uppercase">Navigating</p>
            </div>
            <button
              onClick={() => setIsNavigating(false)}
              className="bg-red-500 px-6 py-2 rounded-xl font-black text-[10px] uppercase"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 z-30 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-md border border-gray-200"
      >
        🏠
      </button>
    </div>
  )
}

export default MapPage