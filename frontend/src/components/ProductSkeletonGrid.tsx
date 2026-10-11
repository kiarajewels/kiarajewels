import React from 'react';

export default function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="best-seller__grid">
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .skeleton-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div 
            className="skeleton-pulse" 
            style={{ 
              width: '100%', 
              aspectRatio: '3/4', 
              backgroundColor: '#f3f4f6', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              userSelect: 'none'
            }}
          >
            <span 
              style={{ 
                fontFamily: 'var(--font-cormorant), serif', 
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', 
                fontWeight: 500, 
                letterSpacing: '0.25em', 
                paddingLeft: '0.25em', 
                color: '#9ca3af', 
                textTransform: 'uppercase' 
              }}
            >
              KIARA
            </span>
          </div>
          <div className="skeleton-pulse" style={{ width: '80%', height: '16px', backgroundColor: '#e5e7eb', marginTop: '8px' }} />
          <div className="skeleton-pulse" style={{ width: '40%', height: '16px', backgroundColor: '#e5e7eb' }} />
        </div>
      ))}
    </div>
  );
}
