'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - set ADMIN_PASSWORD in env vars
    // Default password for local dev is 'nisha&danial'
    const adminPwd = 'nisha2026';
    if (password === adminPwd) {
      setAuthenticated(true);
      fetchResponses();
    } else {
      alert('TAKKAN TU PON TAK INGAT!!?');
    }
  };

  const fetchResponses = async () => {
    try {
      const res = await fetch('/api/rsvp');
      const json = await res.json();
      if (json.data) setResponses(json.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalAttending = responses.filter((r) => r.attendance === 'yes');
  const totalPax = totalAttending.reduce((sum, r) => sum + (r.pax || 1), 0);
  const totalDeclined = responses.filter((r) => r.attendance === 'no');

  if (!authenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>Admin Dashboard</h1>
          <p style={styles.loginSubtitle}>Sila masukkan kata laluan</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata laluan"
              style={styles.loginInput}
            />
            <button type="submit" style={styles.loginBtn}>Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 RSVP Dashboard</h1>
      <p style={styles.subtitle}>Nisha & Danial - 5 April 2026</p>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={{ ...styles.statCard, borderColor: '#2D6A4F' }}>
          <span style={styles.statNumber}>{totalAttending.length}</span>
          <span style={styles.statLabel}>Hadir</span>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#C1292E' }}>
          <span style={styles.statNumber}>{totalDeclined.length}</span>
          <span style={styles.statLabel}>Tidak Hadir</span>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#D4A853' }}>
          <span style={styles.statNumber}>{totalPax}</span>
          <span style={styles.statLabel}>Jumlah Pax</span>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#555' }}>
          <span style={styles.statNumber}>{responses.length}</span>
          <span style={styles.statLabel}>Jumlah RSVP</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Memuat...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>Kehadiran</th>
                <th style={styles.th}>Pax</th>
                <th style={styles.th}>Ucapan</th>
                <th style={styles.th}>Tarikh</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => (
                <tr key={r.id || i} style={i % 2 === 0 ? styles.trEven : {}}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{r.name}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background: r.attendance === 'yes' ? '#2D6A4F' : '#C1292E',
                      }}
                    >
                      {r.attendance === 'yes' ? '✓ Hadir' : '✗ Tidak'}
                    </span>
                  </td>
                  <td style={styles.td}>{r.pax || 1}</td>
                  <td style={{ ...styles.td, maxWidth: '200px' }}>
                    {r.wishes || '-'}
                  </td>
                  <td style={styles.td}>
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString('ms-MY')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {responses.length === 0 && (
            <p style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
              Belum ada RSVP lagi
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '24px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
    marginBottom: '30px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    borderLeft: '4px solid',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2C1810',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '4px',
  },
  tableWrapper: {
    overflowX: 'auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '14px 12px',
    background: '#8B1A2B',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333',
  },
  trEven: {
    background: '#fafafa',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5E6C8',
    fontFamily: "'Poppins', sans-serif",
  },
  loginCard: {
    background: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '380px',
    width: '90%',
  },
  loginTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#8B1A2B',
    marginBottom: '8px',
  },
  loginSubtitle: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '24px',
  },
  loginInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '16px',
    textAlign: 'center',
  },
  loginBtn: {
    width: '100%',
    padding: '12px',
    background: '#8B1A2B',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
