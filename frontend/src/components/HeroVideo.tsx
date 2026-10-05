'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const heroImages = [
  "/images/hero_videos/heroimage1.png",
  "/images/hero_videos/heroimage4.png",
  "/images/hero_videos/heroimage2.png",
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
        <div className="hero-text-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, color: '#000000' }}>KIARA JEWELS</span>
          <h1 className="hero-headline" style={{ textTransform: 'uppercase', lineHeight: '1.1', fontSize: 'clamp(3rem, 6vw, 5rem)', margin: 0, fontWeight: 400, color: '#000000' }}>
            EVERYDAY,<br />ELEVATED.
          </h1>
          <p className="hero-subheadline" style={{ color: '#2A2A2A', maxWidth: '400px', margin: '0 0 24px 0', fontSize: '1rem', lineHeight: '1.6' }}>
            925 silver jewellery with premium CZ sparkle, made to order for the way you work, meet and celebrate.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '16px' }}>
            <Link href="/all" style={{ background: '#000000', color: '#FFFFFF', padding: '14px 32px', textDecoration: 'none', letterSpacing: '0.1em', transition: 'background 0.2s, color 0.2s', fontSize: '0.85rem', textTransform: 'uppercase', border: '1px solid #000000' }}>
              SHOP THE COLLECTION
            </Link>
            <Link href="/gifting" style={{ background: '#FFFFFF', color: '#000000', border: '1px solid #000000', padding: '14px 32px', textDecoration: 'none', letterSpacing: '0.1em', transition: 'background 0.2s, color 0.2s', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              EXPLORE GIFTING
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
