import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    mobilityType: 'Manual Wheelchair',
    maxSlope: '5',
    voiceNav: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true); 

    try {
      // Correct Firestore reference using the imported 'db'
      const userProfileRef = doc(db, "profiles", user.uid);
      await setDoc(userProfileRef, profile);
      
      alert("Profile Updated Successfully!");
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false); // Resets "Saving..." text even if it fails
    }
  };

  if (loading) return <div style={styles.center}>Loading Profile...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>⬅ Back</button>
        <h2 style={{margin: '20px 0 10px 0'}}>Accessibility Profile</h2>
        <p style={{color: '#666', marginBottom: '30px'}}>Customize your route preferences.</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Mobility Aid</label>
          <select 
            value={profile.mobilityType} 
            onChange={(e) => setProfile({...profile, mobilityType: e.target.value})}
            style={styles.select}
          >
            <option>Manual Wheelchair</option>
            <option>Electric Wheelchair</option>
            <option>Crutches/Walker</option>
            <option>Senior/Walking</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Max Safe Slope ({profile.maxSlope}°)</label>
          <input 
            type="range" min="1" max="15" 
            value={profile.maxSlope}
            onChange={(e) => setProfile({...profile, maxSlope: e.target.value})}
            style={styles.range}
          />
        </div>

        <button 
          onClick={handleSave} 
          disabled={saving} 
          style={{...styles.saveBtn, backgroundColor: saving ? '#ccc' : '#4285F4'}}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100vw', minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' },
  content: { padding: '25px', maxWidth: '600px', margin: '0 auto', width: '100%' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  backBtn: { background: 'none', border: 'none', color: '#4285F4', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', padding: 0 },
  inputGroup: { marginBottom: '25px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' },
  select: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' },
  range: { width: '100%', accentColor: '#4285F4' },
  saveBtn: { width: '100%', padding: '16px', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }
};

export default ProfilePage;