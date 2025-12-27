import { useAuth } from "../context/AuthContext"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import DestinationModal from "./DestinationModal"

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [greeting, setGreeting] = useState("")

  // 1. Dynamic Greeting Logic
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const displayName = user?.email.split('@')[0] // Fallback if name isn't in DB

  return (
    <div style={styles.dashboardContainer}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.logo}>Parthy</span>
        <button onClick={() => signOut(auth)} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* 2. Greeting Section */}
      <section style={styles.welcomeSection}>
        <h1 style={styles.greetingText}>
          {greeting}, <span style={{ textTransform: 'capitalize' }}>{displayName}</span> 👋
        </h1>
        <p style={styles.subText}>Ready to find an accessible route today?</p>
      </section>

      {/* 3. Accessibility Profile Card */}
      <div style={styles.profileCard}>
        <h3 style={styles.cardTitle}>Your Profile</h3>
        <div style={styles.infoRow}>
          <span>♿ Mobility Type:</span> <strong>Manual Wheelchair</strong>
        </div>
        <div style={styles.infoRow}>
          <span>📉 Max Slope:</span> <strong>5° (Easy)</strong>
        </div>
        <div style={styles.infoRow}>
          <span>🔊 Voice Navigation:</span> <strong>ON</strong>
        </div>
        <button style={styles.editBtn}>Edit Profile</button>
      </div>

      {/* 4. Primary CTA Button (BIG) */}
      <button 
        style={styles.mainCta} 
        onClick={() => setIsModalOpen(true)}
      >
        Plan Accessible Route
      </button>

      {/* 5. Destination Modal */}
      {isModalOpen && (
        <DestinationModal 
          onClose={() => setIsModalOpen(false)} 
          mobilityType="Manual Wheelchair" 
        />
      )}
    </div>
  )
}

const styles = {
  dashboardContainer: { padding: '25px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Inter, system-ui' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  logo: { fontWeight: 'bold', fontSize: '22px', color: '#4285F4' },
  greetingText: { fontSize: '28px', marginBottom: '8px', color: '#202124' },
  subText: { color: '#5f6368', fontSize: '16px' },
  profileCard: { 
    backgroundColor: '#f8f9fa', 
    padding: '20px', 
    borderRadius: '16px', 
    border: '1px solid #e0e0e0',
    marginBottom: '25px',
    marginTop: '25px'
  },
  cardTitle: { marginTop: 0, fontSize: '18px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },
  editBtn: { background: 'none', border: 'none', color: '#4285F4', fontWeight: '600', cursor: 'pointer', padding: 0, marginTop: '10px' },
  mainCta: { 
    width: '100%', 
    padding: '18px', 
    backgroundColor: '#4285F4', 
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    fontSize: '18px', 
    fontWeight: 'bold', 
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
  },
  logoutBtn: { border: 'none', background: '#f1f3f4', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }
}

export default Dashboard