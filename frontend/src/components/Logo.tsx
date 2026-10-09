import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <span 
      className={`logo-text ${className}`}
      style={{ 
        fontFamily: 'Inter, sans-serif', 
        fontSize: '24px', 
        fontWeight: 700, 
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        display: 'inline-block',
        lineHeight: 1
      }}
    >
      KIARA
    </span>
  );
}
