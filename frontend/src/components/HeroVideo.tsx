'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const videos = [
  '/images/hero_videos/model_with_ring.mp4',
  '/images/hero_videos/model_with_pendant.mp4',
  '/images/hero_videos/only_pendant.mp4'
];

export default function HeroVideo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isTransitioning = useRef(false);

  // Play a specific video index safely
  const playVideo = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`Autoplay for video ${index} deferred:`, err);
        });
      }
    }
  }, []);

  // Transition to next video seamlessly with cross-fade
  const transitionToNext = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const nextIndex = (activeIndex + 1) % videos.length;
    const nextVideo = videoRefs.current[nextIndex];

    if (nextVideo) {
      nextVideo.currentTime = 0;
      const playPromise = nextVideo.play();
      
      const switchLayers = () => {
        setPrevIndex(activeIndex);
        setActiveIndex(nextIndex);

        setTimeout(() => {
          isTransitioning.current = false;
          // Pause previous video after crossfade finishes to preserve CPU
          const prevVideo = videoRefs.current[activeIndex];
          if (prevVideo && activeIndex !== nextIndex) {
            prevVideo.pause();
          }
        }, 1000);
      };

      if (playPromise !== undefined) {
        playPromise.then(switchLayers).catch(() => {
          // If browser restricts play before interaction, still transition gracefully
          switchLayers();
        });
      } else {
        switchLayers();
      }
    } else {
      setPrevIndex(activeIndex);
      setActiveIndex(nextIndex);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 1000);
    }
  }, [activeIndex]);

  // Initial autoplay on mount
  useEffect(() => {
    playVideo(0);
  }, [playVideo]);

  return (
    <section className="hero-section">
      <div className="hero-video-container">
        {/* Luxury fallback image behind video layers so black background never shows */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/images/hero_videos/heroimage1.png"
            alt="Kiara Jewels Hero Background"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Subtle top gradient to ensure navbar is readable */}
        <div
          className="hero-video-nav-gradient"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '140px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 5,
            pointerEvents: 'none'
          }}
        />

        {/* Seamless multi-layer video stack */}
        {videos.map((src, index) => {
          const isActive = index === activeIndex;
          const isPrev = index === prevIndex;

          return (
            <video
              key={src}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={src}
              muted
              playsInline
              preload="auto"
              onTimeUpdate={(e) => {
                // Crossfade 0.5s before video ends to eliminate any black ending frames
                const target = e.currentTarget;
                if (isActive && target.duration && target.duration > 0 && target.currentTime >= target.duration - 0.5) {
                  transitionToNext();
                }
              }}
              onEnded={() => {
                if (isActive) {
                  transitionToNext();
                }
              }}
              className="hero-video-layer"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isActive ? 1 : isPrev ? 1 : 0,
                zIndex: isActive ? 3 : isPrev ? 2 : 1,
                transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none'
              }}
            />
          );
        })}

        {/* Bottom gradient */}
        <div className="hero-video-gradient" style={{ zIndex: 5 }} />
      </div>

      <div className="hero-content">
        <div className="hero-text-wrapper hero-right-aligned">
          <span
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#FFFFFF',
              marginBottom: '16px',
              display: 'block'
            }}
          >
            KIARA JEWELS
          </span>
          <h1
            className="hero-headline"
            style={{
              textTransform: 'uppercase',
              lineHeight: '1.1',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              margin: '0 0 16px 0',
              fontWeight: 400,
              color: '#FFFFFF'
            }}
          >
            EVERYDAY,<br />ELEVATED.
          </h1>
          <p
            className="hero-subheadline"
            style={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '400px',
              margin: '0 0 32px 0',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginLeft: 'auto'
            }}
          >
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
