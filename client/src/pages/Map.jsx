import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const MapPage = () => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  const inputRef = useRef(null)
  const userMarkerRef = useRef(null)
  const destMarkerRef = useRef(null)
  const directionsRendererRef = useRef(null)
  const watchIdRef = useRef(null)

  const [userLocation, setUserLocation] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)

  const navigate = useNavigate()

  /* ---------------- INIT MAP ---------------- */
  useEffect(() => {
    if (!window.google || mapInstance.current) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }

        setUserLocation(loc)

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: loc,
          zoom: 15,
        })

        userMarkerRef.current = new window.google.maps.Marker({
          position: loc,
          map: mapInstance.current,
          title: "You are here",
        })

        setupAutocomplete()
      },
      () => {
        // fallback location (Delhi)
        const fallback = { lat: 28.6139, lng: 77.209 }
        setUserLocation(fallback)

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: fallback,
          zoom: 13,
        })

        userMarkerRef.current = new window.google.maps.Marker({
          position: fallback,
          map: mapInstance.current,
          title: "You are here",
        })

        setupAutocomplete()
      }
    )
  }, [])

  /* ---------------- AUTOCOMPLETE ---------------- */
  const setupAutocomplete = () => {
    if (!inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { fields: ["geometry", "name"] }
    )

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) return

      const destination = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }

      if (destMarkerRef.current) {
        destMarkerRef.current.setMap(null)
      }

      destMarkerRef.current = new window.google.maps.Marker({
        position: destination,
        map: mapInstance.current,
        title: place.name,
      })

      drawRoute(destination)
    })
  }

  /* ---------------- DRAW ROUTE ---------------- */
  const drawRoute = (destination) => {
    if (!userLocation) return

    const directionsService = new window.google.maps.DirectionsService()

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null)
    }

    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#2563EB",
        strokeWeight: 5,
      },
    })

    directionsRendererRef.current.setMap(mapInstance.current)

    directionsService.route(
      {
        origin: userLocation,
        destination,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result)

          const leg = result.routes[0].legs[0]
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
          })
        }
      }
    )
  }

  /* ---------------- START NAVIGATION ---------------- */
  const startNavigation = () => {
    if (!userMarkerRef.current) return

    setIsNavigating(true)

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const updatedLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }

        userMarkerRef.current.setPosition(updatedLoc)
        mapInstance.current.panTo(updatedLoc)
      },
      (err) => console.error("GPS error:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    )
  }

  /* ---------------- STOP NAVIGATION ---------------- */
  const stopNavigation = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsNavigating(false)
  }

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  /* ---------------- UI ---------------- */
  return (
    <div className="relative h-screen w-screen">

      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md bg-white rounded-lg shadow p-2">
        <input
          ref={inputRef}
          placeholder="Enter destination"
          className="w-full border px-3 py-2 rounded-md focus:outline-none"
        />
      </div>

      {/* Route Info */}
      {routeInfo && !isNavigating && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg shadow">
          <p className="text-sm font-medium">
            Distance: {routeInfo.distance}
          </p>
          <p className="text-sm text-gray-600">
            Time: {routeInfo.duration}
          </p>
          <button
            onClick={startNavigation}
            className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
          >
            Start Navigation
          </button>
        </div>
      )}

      {/* Navigation Active */}
      {isNavigating && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 bg-green-600 text-white px-4 py-2 rounded-lg shadow">
          Navigation Started
          <button
            onClick={stopNavigation}
            className="ml-4 bg-white text-green-700 px-2 py-1 rounded"
          >
            Stop
          </button>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="h-screen w-full" />

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute bottom-4 left-4 z-10 bg-white px-4 py-2 rounded shadow"
      >
        ← Back
      </button>
    </div>
  )
}

export default MapPage
