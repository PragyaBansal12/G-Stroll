import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const MapPage = () => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const inputRef = useRef(null)
  const markerRef = useRef(null)

  const [destination, setDestination] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!window.google || mapInstance.current) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
        })

        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance.current,
          title: "You are here",
        })

        setupAutocomplete()
      },
      () => {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 },
          zoom: 13,
        })
        setupAutocomplete()
      }
    )
  }, [])

  const setupAutocomplete = () => {
    if (!window.google || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["geometry", "name"],
      }
    )

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) return

      const location = place.geometry.location
      const lat = location.lat()
      const lng = location.lng()

      setDestination({ lat, lng, name: place.name })

      mapInstance.current.panTo({ lat, lng })
      mapInstance.current.setZoom(15)

      if (markerRef.current) {
        markerRef.current.setMap(null)
      }

      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: place.name,
      })
    })
  }

  return (
    <div className="relative h-screen w-screen">
      
      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md bg-white rounded-lg shadow p-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter destination"
          className="w-full border px-3 py-2 rounded-md focus:outline-none"
        />
      </div>

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
