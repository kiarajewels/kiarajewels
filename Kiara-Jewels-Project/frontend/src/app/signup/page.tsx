'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users/send-otp', { email });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    const res = await signIn('credentials', {
      redirect: false,
      email,
      otp,
    });

    setLoading(false);

    if (res?.error) {
      setError('Invalid or expired OTP. Please try again.');
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '85vh', backgroundColor: '#FBFAF7', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#ffffff', padding: '48px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', fontSize: '2.5rem', marginBottom: '12px' }}>Join Us</h1>
          <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>
            {otpSent ? 'Enter the code sent to your email' : 'Create an account to continue'}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>{error}</p>}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#000000', marginBottom: '8px' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', backgroundColor: '#27302E', color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '1rem', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', marginTop: '8px', opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#374151')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#27302E')}
            >
              {loading ? 'Sending...' : 'Continue with Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>{error}</p>}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#000000', marginBottom: '8px' }}>One-Time Password (OTP)</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1.2rem', letterSpacing: '4px', textAlign: 'center', boxSizing: 'border-box', outline: 'none' }}
                required
                maxLength={6}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', backgroundColor: '#27302E', color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '1rem', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', marginTop: '8px', opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#374151')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#27302E')}
            >
              {loading ? 'Verifying...' : 'Verify & Signup'}
            </button>
            <button 
              type="button"
              onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', width: 'fit-content', alignSelf: 'center' }}
            >
              Use a different email
            </button>
          </form>
        )}

        <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          <span style={{ padding: '0 16px', color: '#9ca3af', fontSize: '0.875rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
        </div>

        <button 
          onClick={() => signIn('google', { callbackUrl: '/' })}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            width: '100%', padding: '14px', backgroundColor: '#fff', color: '#374151',
            border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', fontWeight: '500',
            cursor: 'pointer', transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
