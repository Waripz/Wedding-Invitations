'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    // Start music from user click (browsers allow audio after user gesture)
    if (!window.__weddingAudio) {
      const audio = new Audio('/music/music-background.mp3');
      audio.loop = true;
      window.__weddingAudio = audio;
    }
    window.__weddingAudio.play().catch(() => {});
    router.push('/details');
  };

  return (
    <section className="page-hero" id="home">
      <div className="hero-titles">
        <h1 className="hero-title">Utusan Majlis</h1>
        <h2 className="hero-subtitle">RAJA SEHARI</h2>
      </div>

      {/* Envelope with card */}
      <div className="envelope-container" onClick={handleClick}>
        {/* Doily behind everything */}
        <img
          src="/images/plate_liner.png"
          alt=""
          className="plate-liner-hero"
          aria-hidden="true"
        />
        
        {/* Layer 1: Envelope Back (Full image) */}
        <img src="/images/envelope.png" className="envelope-back" alt="" />
        
        {/* Layer 2: Card Sliding Out */}
        <div className="card-mask">
          <img src="/images/Card.png" alt="Nisha & Danial" className="card-img-slide" />
        </div>

        {/* Layer 3: Envelope Front Pocket (Clipped copy) */}
        <img src="/images/envelope.png" className="envelope-front" alt="Envelope" />

        {/* Click here text on envelope pocket */}
        <div className="click-here-text">click here</div>

        {/* Left Flowers (Blue & Pink) */}
        <img
          src="/images/flower1.png"
          alt=""
          className="hero-flower-left"
          aria-hidden="true"
        />
        
        {/* Right Flowers & Butterfly */}
        <img
          src="/images/flower3.png"
          alt=""
          className="hero-flower-right-bottom"
          aria-hidden="true"
        />
        <img
          src="/images/butterfly.png"
          alt=""
          className="hero-butterfly"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
