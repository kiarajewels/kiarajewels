'use client';
import React from 'react';
import Link from 'next/link';

const videos = [
  '/images/hero_videos/model_with_ring.mp4',
  '/images/hero_videos/model_with_pendant.mp4',
  '/images/hero_videos/only_pendant.mp4'
];

export default function HeroVideo() {
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <section className="hero-section">
      <div className="hero-video-container">
        {/* Subtle top gradient to ensure transparent navbar is readable */}
        <div className="hero-video-nav-gradient" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}></div>

        <video
          key={videos[currentVideoIndex]} // Forces React to remount video so it autoPlays the new src
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="hero-video-layer active"
          src={videos[currentVideoIndex]}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Bottom gradient if needed, keeping from original */}
        <div className="hero-video-gradient"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text-wrapper hero-right-aligned">
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, color: '#FFFFFF', marginBottom: '16px', display: 'block' }}>KIARA JEWELS</span>
          <h1 className="hero-headline" style={{ textTransform: 'uppercase', lineHeight: '1.1', fontSize: 'clamp(3rem, 6vw, 5rem)', margin: '0 0 16px 0', fontWeight: 400, color: '#FFFFFF' }}>
            EVERYDAY,<br />ELEVATED.
          </h1>
          <p className="hero-subheadline" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '400px', margin: '0 0 32px 0', fontSize: '1rem', lineHeight: '1.6', marginLeft: 'auto' }}>
            925 silver jewellery with premium CZ sparkle, made to order for the way you work, meet and celebrate.
          </p>
          <div className="hero-buttons">
            <Link href="/all" className="hero-cta-btn-primary">
              SHOP THE COLLECTION
            </Link>
            <Link href="/gifting" className="hero-cta-btn-secondary">
              EXPLORE GIFTING
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
