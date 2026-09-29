'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const MEDIA = [
  { src: '/images/hero_videos/heroimage1.png', type: 'image'},
  { src: '/images/hero_videos/heroimage2.png', type: 'image'},
  { src: '/images/hero_videos/heroimage3.png', type: 'image'},
  { src: '/images/hero_videos/heroimage4.png', type: 'image'}
];

export default function HeroVideo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const currentMedia = MEDIA[activeIndex];
    
    if (currentMedia.type === 'video') {
      const currentVideo = videoRefs.current[activeIndex];
      if (currentVideo) {
        currentVideo.currentTime = 0;
        currentVideo.play().catch((err) => console.log('Autoplay prevented:', err));
      }
    } else if (currentMedia.type === 'image') {
      // Display images for 4 seconds before transitioning
      const timer = setTimeout(() => {
        handleMediaEnd();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  const handleMediaEnd = () => {
    setActiveIndex((prev) => (prev + 1) % MEDIA.length);
  };

  return (
    <section className="hero-section">
      <div className="hero-video-container">
        {/* Media Layers */}
      {MEDIA.map((item, index) => {
        if (item.type === 'video') {
          return (
            <video
              key={item.src}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={item.src}
              muted
              playsInline
              preload={index === 0 ? 'auto' : 'metadata'}
              onEnded={index === activeIndex ? handleMediaEnd : undefined}
              className={`hero-video-layer ${index === activeIndex ? 'active' : ''}`}
            />
          );
        } else {
          return (
            <img
              key={item.src}
              src={item.src}
              alt="Kiara Jewels Hero Feature"
              className={`hero-video-layer ${index === activeIndex ? 'active' : ''}`}
            />
          );
        }
      })}

      {/* Subtle Gradient Overlay to ensure text readability without darkening the whole video */}
      <div className="hero-video-gradient"></div>
      </div>

      {/* Content Overlay */}
      <div className="hero-content">
        <div className="hero-text-wrapper">
          <h1 className="hero-headline">EVERYDAY, ELEVATED.</h1>
          <p className="hero-subheadline">
            Premium jewellery designed for the moments that become memories.
          </p>
          <Link href="/#categories" className="hero-cta-btn">
            SHOP COLLECTION
          </Link>
          <div className="hero-trust-line">
            925 STERLING SILVER · TARNISH RESISTANT
          </div>
        </div>
      </div>
    </section>
  );
}
