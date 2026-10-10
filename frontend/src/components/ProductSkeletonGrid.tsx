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
          <div className="skeleton-pulse" style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#e5e7eb' }} />
          <div className="skeleton-pulse" style={{ width: '80%', height: '16px', backgroundColor: '#e5e7eb', marginTop: '8px' }} />
          <div className="skeleton-pulse" style={{ width: '40%', height: '16px', backgroundColor: '#e5e7eb' }} />
        </div>
      ))}
    </div>
  );
}
