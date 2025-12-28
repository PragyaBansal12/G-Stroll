const DashboardStats = () => {
  return (
    <div style={styles.container}>
      <div style={styles.statBox}>
        <span style={styles.icon}>📍</span>
        <span style={styles.val}>12</span>
        <span style={styles.label}>Trips</span>
      </div>
      <div style={styles.statBox}>
        <span style={styles.icon}>🛣️</span>
        <span style={styles.val}>4.2</span>
        <span style={styles.label}>km Walked</span>
      </div>
      <div style={styles.statBox}>
        <span style={styles.icon}>✅</span>
        <span style={styles.val}>High</span>
        <span style={styles.label}>Safety</span>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', gap: '15px', marginBottom: '25px' },
  statBox: { flex: 1, backgroundColor: 'white', padding: '15px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  icon: { fontSize: '20px', marginBottom: '5px' },
  val: { fontWeight: 'bold', fontSize: '18px' },
  label: { fontSize: '10px', color: '#888', textTransform: 'uppercase' }
};

export default DashboardStats;