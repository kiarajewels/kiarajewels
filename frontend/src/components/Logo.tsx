import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = '', width = 120, height = 54 }: LogoProps) {
  return (
    <svg 
      className={className}
      width={width} 
      height={height} 
      viewBox="0 0 120 54" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Small rose-gold outlined diamond shape centred above */}
      <path d="M60 2 L64 7 L60 12 L56 7 Z" stroke="var(--dark-grey)" strokeWidth="1" fill="none" />
      
      {/* Wordmark KIARA */}
      <text 
        x="60" 
        y="32" 
        fontFamily="var(--font-cormorant), serif" 
        fontSize="22" 
        fontWeight="500" 
        letterSpacing="0.15em"
        fill="currentColor"
        textAnchor="middle"
      >
        KIARA
      </text>

      {/* Thin rose line */}
      <line x1="40" y1="40" x2="80" y2="40" stroke="var(--dark-grey)" strokeWidth="0.5" />

      {/* JEWELS beneath */}
      <text 
        x="60" 
        y="50" 
        fontFamily="'Inter', sans-serif" 
        fontSize="8" 
        fontWeight="400" 
        letterSpacing="0.3em"
        fill="currentColor"
        textAnchor="middle"
      >
        JEWELS
      </text>
    </svg>
  );
}
