'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const heroImages = [
  "/images/hero_videos/heroimage1.png",
  "/images/hero_videos/heroimage4.png",
  "/images/hero_videos/heroimage6.png",
  "/images/hero_videos/heroimage4.png"
];

export default function HeroVideo() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); // 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-video-container">
        {heroImages.map((src, index) => (
          <Image
            key={`${src}-${index}`}
            src={src}
            alt="Kiara Jewels Hero Feature"
            fill
            priority={index === 0}
            style={{ 
              objectFit: 'cover',
              opacity: index === currentImageIndex ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out'
            }}
            sizes="100vw"
          />
        ))}
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
