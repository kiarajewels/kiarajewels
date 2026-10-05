import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ProductOfferBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Exclusive Savings
        </h4>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.2rem', color: '#3A1C1D' }}>✧</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#000000' }}>10% OFF your first order</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', paddingLeft: '26px' }}>No minimum purchase</span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.2rem', color: '#3A1C1D' }}>✧</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#000000' }}>₹3,000+ → 5% OFF</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.2rem', color: '#3A1C1D' }}>✧</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#000000' }}>₹6,000+ → 10% OFF</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', paddingLeft: '26px' }}>On subsequent orders</span>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '0.85rem',
            color: '#4b5563',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          View Offer Details
        </button>
      </div>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '32px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000000', marginBottom: '24px', textAlign: 'center', fontFamily: 'Times New Roman, serif' }}>
              Offer Details
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>First Order</h4>
              <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>
                Get 10% OFF your first order with no minimum purchase.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Subsequent Orders</h4>
              <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.5', margin: 0, marginBottom: '8px' }}>
                Spend ₹3,000 or more and receive 5% OFF.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>
                Spend ₹6,000 or more and receive 10% OFF.
              </p>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
