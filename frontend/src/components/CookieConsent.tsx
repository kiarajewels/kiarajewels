'use client';
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setShow(false);
    // Dispatch custom event so Analytics component can pick it up and inject tags
    window.dispatchEvent(new Event('cookie_consent_granted'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      padding: '24px',
      borderRadius: '8px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
    }}>
      <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: '1.5' }}>
        We use cookies and similar technologies to measure our site's performance, personalize your experience, and assist in our marketing efforts. 
        By clicking "Accept All", you consent to our use of these technologies. You can read more in our <a href="/privacy-policy" style={{ color: '#000', textDecoration: 'underline' }}>Privacy Policy</a>.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={handleAccept}
          style={{ backgroundColor: '#000', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Accept All
        </button>
        <button 
          onClick={handleDecline}
          style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Decline Optional
        </button>
      </div>
    </div>
  );
}
