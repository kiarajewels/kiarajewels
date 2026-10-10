'use client';
import React, { useRef, useEffect, useState } from 'react';

const originalClaims = [
  { top: '925', bottom: 'STERLING SILVER' },
  { top: 'ANTI-TARNISH', bottom: 'FINISH' },
  { top: 'PREMIUM', bottom: 'CZ Jewelry' },
  { top: 'FREE', bottom: 'SHIPPING' },
  { top: '3-DAY', bottom: 'RETURNS' }
];

// Duplicate claims to ensure there's enough content to scroll/loop smoothly
const claims = [...originalClaims, ...originalClaims, ...originalClaims];

export default function TrustStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const [cursor, setCursor] = useState('grab');

  // Auto-scroll logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    // speed in pixels per millisecond
    const speed = 0.05; 

    const scroll = (time: number) => {
      if (!isDragging.current && scrollRef.current) {
        const delta = time - lastTime;
        const container = scrollRef.current;
        
        // Only auto-scroll if content is wider than container
        if (container.scrollWidth > container.clientWidth) {
          container.scrollLeft += speed * delta;
          
          // If we reach the middle (since we duplicated 3 times), seamlessly jump back to start
          // A single block of original claims is scrollWidth / 3.
          const singleBlockWidth = container.scrollWidth / 3;
          if (container.scrollLeft >= singleBlockWidth * 2) {
            container.scrollLeft = singleBlockWidth;
          } else if (container.scrollLeft <= 0) {
            container.scrollLeft = singleBlockWidth;
          }
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Mouse drag logic for desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setCursor('grabbing');
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftStart.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    setCursor('grab');
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setCursor('grab');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
    }
  };

  return (
    <section style={{ background: '#FFFFFF', padding: '40px 0', borderBottom: '1px solid #E5E5E5', overflow: 'hidden' }}>
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          WebkitOverflowScrolling: 'touch',
          padding: '0 24px',
          gap: '64px',
          cursor: cursor
        }} 
        className="hide-scrollbar"
      >
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            user-select: none;
          }
        `}</style>
        {claims.map((item, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center', 
              color: '#000000', 
              flex: '0 0 auto', 
              minWidth: '150px',
            }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}>{item.top}</span>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.7, textTransform: 'uppercase', marginTop: '4px' }}>{item.bottom}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
