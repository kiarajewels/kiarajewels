import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroVideo() {
  return (
    <section className="hero-section" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <div className="hero-video-container" style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/images/hero_videos/heroimage1.png"
          alt="Kiara Jewels Hero Feature"
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div className="hero-video-gradient" style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.35)' }}></div>
      </div>

      <div className="hero-content" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', zIndex: 10 }}>
        <div className="hero-text-wrapper" style={{ textAlign: 'center', color: 'var(--white)', maxWidth: '600px', marginTop: '10vh' }}>
          <h1 className="hero-headline" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 500, margin: '0 0 16px', letterSpacing: '0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Everyday, elevated.
          </h1>
          <p className="hero-subheadline" style={{ fontFamily: 'var(--font-jost), sans-serif', fontSize: '1.1rem', margin: '0 0 32px', lineHeight: 1.5, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            925 silver jewellery with premium CZ sparkle, made to order for the way you work, meet and celebrate.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/rings" style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '12px 28px', textDecoration: 'none', letterSpacing: '0.05em', transition: 'background 0.2s', fontSize: '14px' }}>
              Shop the collection
            </Link>
            <Link href="/gifting" style={{ background: 'transparent', color: 'var(--white)', border: '1px solid var(--white)', padding: '12px 28px', textDecoration: 'none', letterSpacing: '0.05em', transition: 'background 0.2s', fontSize: '14px', backdropFilter: 'blur(4px)' }}>
              Explore gifting
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
