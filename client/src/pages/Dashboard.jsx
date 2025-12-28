import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DestinationModal from "../components/DestinationModal";
import DashboardStats from "../components/DashboardStats";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const fetchProfile = async () => {
      // Safety: ensure user exists before calling Firestore
      if (!user?.uid) return;
      
      try {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Dashboard profile fetch error:", error);
      }
    };

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    fetchProfile();
  }, [user?.uid]);

  const displayName = user?.email ? user.email.split('@')[0] : "User";

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <span style={styles.logo}>Parthy</span>
          <button onClick={() => signOut(auth)} style={styles.logoutBtn}>Logout</button>
        </div>

        <h1 style={styles.greeting}>
          {greeting}, <span style={{ textTransform: 'capitalize' }}>{displayName}</span>! 👋
        </h1>
        <p style={styles.subText}>Where are we heading safely today?</p>

        <DashboardStats />

        <div style={styles.profileCard}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
             <h3 style={{margin: 0}}>Your Profile</h3>
             <button 
               onClick={() => navigate('/profile')} 
               style={styles.editBtn}
             >
               Edit
             </button>
          </div>
          <div style={styles.info}>
             <p style={{marginBottom: '8px'}}>♿ {profile?.mobilityType || 'Manual Wheelchair'}</p>
             <p>📉 Max Slope: {profile?.maxSlope || '5'}°</p>
          </div>
        </div>

        <button style={styles.mainCta} onClick={() => setIsModalOpen(true)}>
          🚀 Plan Accessible Route
        </button>

        {isModalOpen && (
          <DestinationModal 
            onClose={() => setIsModalOpen(false)} 
            mobilityType={profile?.mobilityType || "Manual Wheelchair"} 
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { 
    width: '100vw', 
    minHeight: '100vh', 
    backgroundColor: '#fcfcfc', 
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden'
  },
  contentWrapper: {
    padding: '25px', 
    maxWidth: '600px', 
    width: '100%',
    margin: '0 auto', 
    flex: 1
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logo: { fontWeight: '900', fontSize: '24px', color: '#4285F4' },
  greeting: { fontSize: '32px', marginBottom: '5px', fontWeight: '800', color: '#1a1a1a' },
  subText: { color: '#666', marginBottom: '25px' },
  profileCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #f0f0f0' },
  editBtn: { background: '#E8F0FE', color: '#4285F4', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  info: { marginTop: '15px', fontSize: '16px', color: '#444' },
  mainCta: { width: '100%', padding: '20px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '15px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(66, 133, 244, 0.3)' },
  logoutBtn: { border: 'none', background: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }
};

export default Dashboard;