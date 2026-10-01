'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { trackEvent } from '@/components/Analytics';

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          // Escape input for safety before sending, though backend handles it too
          const safeQuery = encodeURIComponent(query.trim());
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?q=${safeQuery}`);
          setResults(res.data.slice(0, 5)); // Limit to 5 suggestions
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      trackEvent('search', { search_term: query.trim() });
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <button 
        className="navbar__icon-link" 
        aria-label="Search" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative', zIndex: 1001 }}
      >
        {isOpen ? <X size={22} strokeWidth={1.5} color="var(--ink)" /> : <Search size={22} strokeWidth={1.5} color="var(--ink)" />}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '120%',
          right: 0,
          width: '320px',
          backgroundColor: '#fff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          zIndex: 1000,
          border: '1px solid #e5e7eb'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            <input 
              type="text"
              autoFocus
              placeholder="Search for jewellery..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
            <button type="submit" style={{ padding: '0 16px', color: '#6b7280' }}>
              <Search size={20} />
            </button>
          </form>

          {loading && (
            <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
              <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
              No results found for "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {results.map((product) => (
                <Link 
                  key={product._id} 
                  href={`/product/${product._id}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src={product.media?.[0]?.url || '/placeholder.png'} 
                    alt={product.name} 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#111827' }}>{product.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Rs. {product.price}</span>
                  </div>
                </Link>
              ))}
              <button 
                onClick={handleSubmit}
                style={{
                  width: '100%',
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  color: '#000',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  borderTop: '1px solid #e5e7eb'
                }}
              >
                View all results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
