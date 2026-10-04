import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroVideo() {
  return (
    <section className="hero-section">
      <div className="hero-video-container">
        <Image
          src="/images/hero_videos/heroimage3.png"
          alt="Kiara Jewels Hero Feature"
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
      </div>

      <div className="hero-content">
        <div className="hero-text-wrapper">
          <h1 className="hero-headline">
            Everyday, elevated.
          </h1>
          <p className="hero-subheadline">
            925 silver jewellery with premium CZ sparkle, made to order for the way you work, meet and celebrate.
          </p>
          <div className="hero-buttons">
            <Link href="/all" style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '12px 28px', textDecoration: 'none', letterSpacing: '0.05em', transition: 'background 0.2s', fontSize: '14px' }}>
              Shop the collection
            </Link>
            <Link href="/gifting" style={{ background: 'transparent', color: '#000000ff', border: '1px solid #000000ff', padding: '12px 28px', textDecoration: 'none', letterSpacing: '0.05em', transition: 'background 0.2s', fontSize: '14px', backdropFilter: 'blur(4px)' }}>
              Explore gifting
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
