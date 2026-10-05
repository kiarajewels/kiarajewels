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
    <section style={{ padding: '80px 24px', background: '#000000', color: '#FFFFFF', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', margin: '0 0 16px', fontWeight: 400, fontFamily: 'var(--font-cormorant), serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>JOIN THE KIARA COMMUNITY</h2>
        <p style={{ fontSize: '0.9rem', margin: '0 0 32px', color: '#D9D9D9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Early access to new collections and exclusive updates.</p>
        
        {status === 'success' ? (
          <div style={{ padding: '16px', border: '1px solid #FFFFFF', color: '#FFFFFF', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Thank you for joining.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0', maxWidth: '400px', margin: '0 auto', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: '100%', border: '1px solid #FFFFFF' }}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS" 
                required
                style={{ flex: 1, padding: '14px 16px', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'inherit', color: '#FFFFFF', fontSize: '0.85rem', letterSpacing: '0.1em' }}
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                style={{ background: '#FFFFFF', color: '#000000', padding: '0 24px', letterSpacing: '0.1em', border: 'none', fontSize: '0.85rem', fontWeight: 500 }}
              >
                {status === 'loading' ? 'WAIT' : 'SUBSCRIBE'}
              </button>
            </div>
          </form>
        )}
        {status === 'error' && <p style={{ color: '#ff3333', marginTop: '16px', fontSize: '0.85rem', letterSpacing: '0.05em' }}>SOMETHING WENT WRONG. PLEASE TRY AGAIN.</p>}
      </div>
    </section>
  );
}
