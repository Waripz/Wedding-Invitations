'use client';

import { useState, useEffect } from 'react';

export default function RSVPPage() {
  const [formData, setFormData] = useState({
    name: '',
    attendance: '',
    pax: '',
    wishes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    fetchWishes();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [wishes]);

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      const json = await res.json();
      if (json.data) setWishes(json.data);
    } catch (err) {
      console.error('Failed to fetch wishes:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.attendance) {
      showToast('Sila isi nama dan kehadiran anda', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (res.ok) {
        showToast('Thank You For Your Response 💕', 'success');
        setFormData({ name: '', attendance: '', pax: '', wishes: '' });
        setTimeout(fetchWishes, 1000);
      } else {
        showToast(json.error || 'Failed to send. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Network Problem. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'baru sahaja';
    if (diffMins < 60) return `${diffMins} minit lalu`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam lalu`;
    return `${Math.floor(diffMins / 1440)} hari lalu`;
  };

  return (
    <>
      <section className="page-rsvp" id="rsvp">
        <h2 className="rsvp-header">Can you join us!</h2>

        <div className="rsvp-form-container">
          <div className="rsvp-form-bg">
            {/* Decorative elements */}
            <img src="/images/Ribben.png" alt="" className="rsvp-ribbon" aria-hidden="true" />
            <img src="/images/Bird.png" alt="" className="rsvp-bird" aria-hidden="true" />

            <h3 className="rsvp-form-title">You&apos;re Invited</h3>

            <form onSubmit={handleSubmit} id="rsvp-form">
              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-name">Name</label>
                <input
                  id="rsvp-name"
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama anda"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">are you coming? / adakah awak hadir?</label>
                <div className="attendance-buttons">
                  <button
                    type="button"
                    className={`attendance-btn ${formData.attendance === 'yes' ? 'active-yes' : ''}`}
                    onClick={() => setFormData({ ...formData, attendance: 'yes' })}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`attendance-btn ${formData.attendance === 'no' ? 'active-no' : ''}`}
                    onClick={() => setFormData({ ...formData, attendance: 'no' })}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-pax">Number of pax / Bilangan pax</label>
                <input
                  id="rsvp-pax"
                  type="number"
                  className="form-input"
                  min="1"
                  max="20"
                  value={formData.pax}
                  onChange={(e) => setFormData({ ...formData, pax: e.target.value })}
                  placeholder="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-wishes">Ucapan / Wishes</label>
                <textarea
                  id="rsvp-wishes"
                  className="form-textarea"
                  value={formData.wishes}
                  onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
                  placeholder="Tulis ucapan anda di sini..."
                  rows="3"
                />
              </div>

              <button type="submit" className="rsvp-submit-btn" disabled={submitting}>
                {submitting ? 'hantar...' : 'RSVP'}
              </button>
            </form>
          </div>
        </div>

        {/* Wishes Wall */}
        {wishes.length > 0 && (
          <div className="wishes-section">
            <h3 className="wishes-title">Ucapan Tetamu</h3>
            <div className="wishes-scroll-container reveal">
              <div className="wishes-scroll-track">
                {wishes.map((wish, index) => (
                  <div key={index} className="wish-card">
                    <p className="wish-name">{wish.name}</p>
                    <p className="wish-message">{wish.wishes}</p>
                    <p className="wish-time">{formatTime(wish.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-names">Nisha & Danial</p>
        <p className="footer-text">5 April 2026 • Conezion IOI Resort City, Putrajaya</p>
        <img src="/images/Flowericon.png" alt="" className="footer-flower" aria-hidden="true" />
      </footer>

      {/* Toast */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </>
  );
}
