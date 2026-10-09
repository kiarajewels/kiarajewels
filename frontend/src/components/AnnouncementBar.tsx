'use client';
import React, { useState, useEffect } from 'react';

const messages = [
  "FREE SHIPPING ACROSS INDIA",
  "MADE TO ORDER",
  "GUARANTEED 925 STERLING SILVER"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar" style={{ 
      background: 'var(--pure-black)', 
      color: 'var(--white)', 
      textTransform: 'uppercase', 
      fontSize: '0.75rem', 
      letterSpacing: '0.15em',
      position: 'relative',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '40px',
      overflow: 'hidden'
    }}>
      {messages.map((msg, i) => (
        <span 
          key={i}
          style={{
            position: 'absolute',
            opacity: index === i ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {msg}
        </span>
      ))}
    </div>
  );
}
