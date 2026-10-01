'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function CustomOrderPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--stone)', padding: '120px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 24px', fontWeight: 500, letterSpacing: '0.02em', color: 'var(--ink)' }}>
            Bring your dream jewellery to life
          </h1>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'rgba(0,0,0,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            Can't find exactly what you're looking for? Let our artisans craft a bespoke 925 sterling silver piece uniquely for you. No minimum order quantity.
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--ivory)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', textAlign: 'center', margin: '0 0 64px', fontWeight: 500 }}>How it works</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            {[
              { step: '01', title: 'Share a reference', desc: 'Upload a reference photo, sketch, or detailed description.' },
              { step: '02', title: 'Get a quote', desc: 'We discuss design details, materials, and provide a final quote.' },
              { step: '03', title: 'Pay 50% advance', desc: 'Once approved, a 50% advance starts the crafting process.' },
              { step: '04', title: 'Shipped in 7-10 days', desc: 'Your bespoke piece is handmade and securely shipped to your door.' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '32px 24px', border: '1px solid var(--stone)', backgroundColor: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--rose-deep)', marginBottom: '16px' }}>{item.step}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 500 }}>{item.title}</h3>
                <p style={{ color: 'rgba(0,0,0,0.6)', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--stone)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'var(--ivory)', padding: '48px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '32px', textAlign: 'center', fontWeight: 500 }}>Request a Custom Order</h2>
          
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={48} color="var(--rose-deep)" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 500 }}>Request Received!</h3>
              <p style={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.6 }}>
                Thank you for your request. Our design team will review your details and reach out via WhatsApp or email within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Name *</label>
                  <input type="text" required style={{ width: '100%', padding: '12px', border: '1px solid var(--stone)', background: 'white', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Phone (WhatsApp) *</label>
                  <input type="tel" required style={{ width: '100%', padding: '12px', border: '1px solid var(--stone)', background: 'white', outline: 'none', fontFamily: 'inherit' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
                <input type="email" style={{ width: '100%', padding: '12px', border: '1px solid var(--stone)', background: 'white', outline: 'none', fontFamily: 'inherit' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Description *</label>
                <textarea required rows={5} placeholder="Describe the piece you want us to create. Include sizes, style, or specific details." style={{ width: '100%', padding: '12px', border: '1px solid var(--stone)', background: 'white', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Reference Image (Optional)</label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', border: '2px dashed var(--stone)', background: 'white', cursor: 'pointer', color: 'rgba(0,0,0,0.5)' }}>
                  <UploadCloud size={32} style={{ marginBottom: '16px' }} />
                  <span>Click to upload photo or sketch</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} />
                </label>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                style={{ 
                  marginTop: '16px',
                  background: 'var(--ink)', 
                  color: 'var(--ivory)', 
                  padding: '16px', 
                  fontSize: '1rem', 
                  letterSpacing: '0.05em', 
                  border: 'none', 
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer' 
                }}
              >
                {status === 'loading' ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
