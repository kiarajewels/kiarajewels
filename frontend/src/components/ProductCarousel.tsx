'use client';
import React, { useRef } from 'react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ products, title }: { products: any[], title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <section style={{ margin: 0, padding: '80px 24px', overflow: 'hidden', background: '#000000', color: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0, fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={scrollLeft} style={{ background: '#161616', color: '#FFFFFF', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2A2A2A', transition: 'background 0.3s' }}>&larr;</button>
            <button onClick={scrollRight} style={{ background: '#161616', color: '#FFFFFF', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2A2A2A', transition: 'background 0.3s' }}>&rarr;</button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          style={{ 
            display: 'flex', 
            gap: '24px', 
            overflowX: 'auto', 
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none'  // IE 10+
          }}
          className="no-scrollbar"
        >
          {products.map(product => (
            <div key={product._id} className="carousel-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
