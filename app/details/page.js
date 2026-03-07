'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DetailsPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const fullInvitationText = 'Dengan izin Allah SWT, dua hati disatukan,\nkami menjemput,\nDato\'/Datin/Tuan/Puan/Encik/Cik\ndan sekeluarga ke majlis perkahwinan puteri kami\nyang tercinta';

  const weddingDate = new Date('2026-04-05T11:00:00+08:00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = weddingDate - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

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
  }, []);

  // Auto-play music when page loads (user already interacted via envelope)
  useEffect(() => {
    const audio = document.getElementById('bg-music');
    if (audio) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Browser blocked autoplay, user will click play manually
      });
    }
  }, []);

  // Typewriter effect for invitation text
  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < fullInvitationText.length) {
        setTypedText(fullInvitationText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        // Blink cursor a few times then hide it
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, 30);
    return () => clearInterval(typingInterval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="page-details" id="details">
      {/* 1. Main Doily Frame */}
      <div className="details-inner-frame reveal">
        {/* Vertical Bismillah */}
        <div className="bismillah-container">
          <img
            src="/images/bismillah.png"
            alt="Bismillahirrahmanirrahim"
            className="bismillah-img"
          />
        </div>

        {/* Invitation text with typewriter effect */}
        <p className="invitation-text typewriter">
          {typedText.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
          {showCursor && <span className="typewriter-cursor">|</span>}
        </p>

        {/* Couple Section */}
        <div className="couple-section">
          {/* Bride */}
          <div className="person-card bride-layout">
            <div className="person-photo-wrapper">
              <img
                src="/images/bride-woman.png"
                alt="Wan Nisha Aqilah"
                className="person-photo"
              />
            </div>
            <div className="person-info">
              <h3 className="person-name">Wan Nisha Aqilah</h3>
              <p className="person-role">PUTERI KEPADA :</p>
              <p className="person-parents">
                Wan Azizam
                <br />
                Noor Hasmah
              </p>
            </div>
          </div>

          <div className="loves-wrapper">
            <img src="/images/Loves.png" alt="Love" className="loves-icon" />
          </div>

          {/* Groom */}
          <div className="person-card groom-layout">
            <div className="person-info">
              <h3 className="person-name">Muhammad Danial Faris</h3>
              <p className="person-role">PUTERA KEPADA :</p>
              <p className="person-parents">
                Nasri
                <br />
                Norhayati
              </p>
            </div>
            <div className="person-photo-wrapper">
              <img
                src="/images/bride-man.png"
                alt="Muhammad Danial Faris"
                className="person-photo"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Music Player */}
      <div className="music-player reveal">
        <div className="music-player-inner">
          <img src="/images/music-thumbnail.png" alt="Album Art" className="music-album-art" />
          <div className="music-info">
            <p className="music-title">Lagu Pernikahan Kita</p>
            <p className="music-artist">Tiara Andini & Arsy Widianto</p>
          </div>
          <button
            className={`music-play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={() => {
              const audio = document.getElementById('bg-music');
              if (audio.paused) {
                audio.play();
                setIsPlaying(true);
              } else {
                audio.pause();
                setIsPlaying(false);
              }
            }}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
        </div>
        <audio id="bg-music" src="/music/music-background.mp3" loop />
      </div>

      {/* 3. Countdown */}
      <div className="countdown-inline reveal">
        <div className="countdown-numbers">
          <span className="cd-num">{pad(countdown.days)}</span>
          <span className="cd-colon">:</span>
          <span className="cd-num">{pad(countdown.hours)}</span>
          <span className="cd-colon">:</span>
          <span className="cd-num">{pad(countdown.minutes)}</span>
          <span className="cd-colon">:</span>
          <span className="cd-num">{pad(countdown.seconds)}</span>
        </div>
        <div className="countdown-labels">
          <span className="cd-label">HARI</span>
          <span className="cd-label">JAM</span>
          <span className="cd-label">MINIT</span>
          <span className="cd-label">SAAT</span>
        </div>
      </div>

      {/* 4. Save The Date Section */}
      <div className="save-date-section reveal">
        <h2 className="save-date-title">Save The Date</h2>
        <p className="save-date-text">
          <span className="save-date-day">AHAD | 5 APRIL 2026</span>
          <br />
          <span className="save-date-time">11.00 PAGI HINGGA 4.00 PETANG</span>
        </p>
        <img src="/images/Pattern1.png" alt="divider" className="vintage-divider" />
        <h2 className="butiran-title">Butiran<br />Majlis</h2>
      </div>

      {/* 5. Locations & Contact (Row Layout) */}
      <div className="info-grid reveal">
        
        {/* Left Column: Lokasi & Hubungi */}
        <div className="info-col-left">
          {/* Lokasi Card */}
          <div className="lokasi-card">
            <img src="/images/Flower4.png" alt="" className="lokasi-flower-tl" />
            <h3 className="card-heading-script">Lokasi</h3>
            <p className="lokasi-address">
              F-02-01 Conezion IOI RESORT CITY,<br />
              62502 Putrajaya, Wilayah Persekutuan<br />
              Putrajaya
            </p>
            <a href="https://www.google.com/maps/dir/2.9008949,101.8340691/DeRoses+Events,+F-02-01+Conezion+IOI+RESORT+CITY,+62502+Putrajaya,+Wilayah+Persekutuan+Putrajaya/@2.9390522,101.698667,26497m/data=!3m2!1e3!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x31cdcb3b84cf584f:0x2fcd9aec8a7ddb98!2m2!1d101.7208485!2d2.9654707?entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="tekan-sini-link">
              TEKAN SINI
            </a>
          </div>

          {/* Hubungi Card */}
          <div className="hubungi-card">
            <h3 className="card-heading-script" style={{ color: '#3A4C5F', fontSize: 'clamp(2.5rem, 7vw, 3rem)' }}>Hubungi</h3>
            <div className="contact-person">
              <p className="contact-name">AQIL</p>
              <p className="contact-role">ABANG PENGANTIN</p>
              <a href="https://wa.me/601128133792" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
                <img src="/images/whatsapp-icon.svg" alt="WhatsApp" width="24" height="24" />
              </a>
            </div>
            
            <div className="contact-person" style={{ marginTop: '15px' }}>
              <p className="contact-name">SUHAILA</p>
              <p className="contact-role">KAKAK PENGANTIN</p>
              <a href="https://wa.me/60172794764" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
                <img src="/images/whatsapp-icon.svg" alt="WhatsApp" width="24" height="24" />
              </a>
            </div>

            <img src="/images/flower2.png" alt="" className="hubungi-flower-br" />
          </div>
        </div>

        {/* Right Column: Pink Flower Badge & RSVP */}
        <div className="info-col-right">
          <div className="pink-flower-badge">
            <img src="/images/Flowericon.png" alt="Flower icon" />
          </div>

          <div className="rsvp-card">
            <h3 className="card-heading-script rsvp-title">Rsvp</h3>
            <p className="rsvp-text">Sila isi maklumat kehadiran anda</p>
            <button onClick={() => router.push('/rsvp')} className="tekan-sini-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-serif)' }}>
              TEKAN SINI
            </button>
            <img src="/images/butterfly.png" alt="" className="rsvp-butterfly" />
          </div>
        </div>

      </div>

      {/* 6. Closing Doa Section */}
      <div className="closing-doa-section reveal">
        <img src="/images/Pattern1.png" alt="divider" className="vintage-divider" style={{ width: '350px', marginBottom: '40px' }} />
        
        <div className="doa-card">
          <img src="/images/bismillah2.png" alt="Bismillah" className="doa-bismillah" />
          <p className="doa-text">
            Ya Allah,<br />
            Berkatilah majlis yang diadakan ini. Limpahkan baraqah<br />
            dan rahmat kepada kedua mempelai ini. Semoga ikatan ini<br />
            menjadi perjalanan cinta yang diredai dan diberkati Allah<br />
            SWT.
          </p>
          <p className="doa-amin">Aamiin Ya Rabbal Alamin</p>
        </div>
      </div>

    </section>
  );
}
