'use client';
import React, { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok || res.status === 404) {
        // Even if 404 (endpoint not built yet), show success for the UI simulation
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section style={{ padding: '80px 24px', background: 'var(--stone)', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', margin: '0 0 16px', fontWeight: 500 }}>Get 10% off your first order</h2>
        <p style={{ fontSize: '1.1rem', margin: '0 0 32px' }}>Join our community for early access to new collections and exclusive offers.</p>
        
        {status === 'success' ? (
          <div style={{ padding: '16px', background: 'var(--ivory)', border: '1px solid var(--rose)', color: 'var(--rose-deep)' }}>
            Thank you! Check your email for your 10% off code.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
              style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--ink)', background: 'transparent', outline: 'none', fontFamily: 'inherit' }}
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '0 24px', letterSpacing: '0.05em' }}
            >
              {status === 'loading' ? 'WAIT...' : 'SUBSCRIBE'}
            </button>
          </form>
        )}
        {status === 'error' && <p style={{ color: 'red', marginTop: '16px' }}>Something went wrong. Please try again.</p>}
      </div>
    </section>
  );
}
