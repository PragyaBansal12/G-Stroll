import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

const DestinationModal = ({ onClose, mobilityType }) => {
  const [dest, setDest] = useState("")
  const [startAddress, setStartAddress] = useState("Detecting location...")
  const [userCoords, setUserCoords] = useState(null)
  const [statusText, setStatusText] = useState("Detecting...")
  
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // 1. Google Autocomplete for the "Where to?" box
  useEffect(() => {
    if (window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ["formatted_address", "geometry", "name"],
      })

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        setDest(place.formatted_address || place.name)
      })
    }
  }, [])

  // 2. Detection & Reverse Geocoding (Turning Coords into Address Name)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserCoords({ lat: latitude, lng: longitude })
          
          // Use Google Geocoder to get the name of your current location
          if (window.google) {
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
              if (status === "OK" && results[0]) {
                setStartAddress(results[0].formatted_address) // Set real address name
                setStatusText("📍 Location Found")
              } else {
                setStartAddress("Current Location (GPS)")
                setStatusText("📍 Coords Found")
              }
            })
          }
        },
        (error) => {
          setStatusText("❌ GPS Disabled")
          setStartAddress("Location Access Denied")
        }
      )
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!dest) return alert("Please select a destination")
    
    // Pass both Start (Coords) and Destination (Name) to the Map page
    navigate(`/map?destination=${encodeURIComponent(dest)}&startLat=${userCoords?.lat}&startLng=${userCoords?.lng}`)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.squareCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>Plan Your Trip</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSearch} style={styles.form}>
          {/* Starting Point Section */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Starting Point</label>
            <div style={styles.locationBadge}>
              <span style={{ marginRight: '8px' }}>📍</span>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {startAddress}
              </div>
            </div>
            {/* Confirmation status right under the box */}
            <div style={{ ...styles.statusInfo, color: statusText.includes('❌') ? '#d93025' : '#1e8e3e' }}>
              {statusText}
            </div>
          </div>

          {/* Destination Section */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Where to?</label>
            <input 
              ref={inputRef}
              style={styles.input} 
              placeholder="Search destination (e.g. New York)" 
              autoFocus
              required
              value={dest}
              onChange={(e) => setDest(e.target.value)}
            />
          </div>

          {/* Mode Section */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Travel Mode</label>
            <div style={styles.lockedMode}>♿ {mobilityType}</div>
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.submitBtn}>Find Accessible Route</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' },
  squareCard: { backgroundColor: 'white', width: '400px', height: '450px', padding: '30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  title: { margin: 0, fontSize: '22px', fontWeight: '700' },
  closeBtn: { border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' },
  form: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  inputGroup: { marginBottom: '8px' },
  label: { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#70757a', marginBottom: '4px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #4285F4', fontSize: '14px', outline: 'none' },
  locationBadge: { padding: '12px', backgroundColor: '#f8f9fa', border: '1px solid #dadce0', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center' },
  statusInfo: { fontSize: '10px', fontWeight: '600', marginTop: '4px', marginLeft: '4px' },
  lockedMode: { padding: '10px', backgroundColor: '#e8f0fe', borderRadius: '10px', color: '#1967d2', fontSize: '13px', fontWeight: '600', textAlign: 'center' },
  buttonRow: { marginTop: '10px' },
  submitBtn: { width: '100%', padding: '16px', border: 'none', borderRadius: '12px', cursor: 'pointer', background: '#34A853', color: 'white', fontWeight: 'bold', fontSize: '16px' }
}

export default DestinationModal