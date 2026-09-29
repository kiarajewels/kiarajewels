'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CompleteProfilePage() {
  const { data: session, update } = useSession();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/users/${session?.user?.email}/phone`, {
        phoneNumber
      });
      // Force session refresh so Navbar sees the new phone number
      await update(); 
      router.push('/');
    } catch (error) {
      console.error(error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBFAF7' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#000000' }}>contact_phone</span>
          <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#27302E', marginTop: '16px', marginBottom: '8px' }}>Almost there!</h1>
          <p style={{ color: '#4b5563', lineHeight: '1.5' }}>
            Hi {session?.user?.name?.split(' ')[0]}! Google doesn't share your phone number with us for privacy reasons. We need it to send delivery updates for your orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Phone Number</label>
            <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', marginBottom: '24px' }}>
              <span style={{ padding: '12px 16px', backgroundColor: '#f9fafb', color: '#6b7280', borderRight: '1px solid #d1d5db', fontWeight: '500' }}>+91</span>
              <input 
                type="tel" 
                id="phone"
                value={phoneNumber}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  setPhoneNumber(val.slice(0, 10));
                }}
                placeholder="Enter 10-digit number"
                style={{ flex: 1, padding: '12px 16px', border: 'none', outline: 'none', fontSize: '1rem' }}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '16px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'background 0.2s'
            }}
            onMouseOver={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#8ebcbc'; }}
            onMouseOut={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#000000'; }}
          >
            {loading ? 'Saving...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
