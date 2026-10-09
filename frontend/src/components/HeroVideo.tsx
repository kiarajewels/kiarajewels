'use client';
import React from 'react';
import Link from 'next/link';

export default function HeroVideo() {
  return (
    <section className="hero-section" style={{ position: 'relative', width: '100%', height: 'calc(100vh - 40px)', overflow: 'hidden', marginTop: '-90px' }}>
      <div className="hero-video-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <video 
          src="/images/hero_videos/model_with_ring.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
      </div>

      <div className="hero-content" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px', paddingBottom: '10vh' }}>
        <div className="hero-text-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h1 className="hero-headline" style={{ textTransform: 'uppercase', lineHeight: '0.85', fontSize: 'clamp(4rem, 15vw, 12rem)', margin: 0, fontWeight: 700, color: '#DCFF7A', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            MEJURI
          </h1>
          <div className="hero-buttons" style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Link href="/all" style={{ background: '#FFFFFF', color: '#000000', padding: '14px 32px', textDecoration: 'none', letterSpacing: '0.05em', transition: 'background 0.2s, color 0.2s', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600' }}>
              SHOP NEW IN
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
