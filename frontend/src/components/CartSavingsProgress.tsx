import React from 'react';
import { useCart } from '@/context/CartContext';

export default function CartSavingsProgress() {
  const { subtotal, isFirstOrder } = useCart();

  if (isFirstOrder) {
    return (
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '8px' }}>
          ✨ Welcome to Kiara Jewels
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#4b5563', margin: 0 }}>
          Enjoy <span style={{ fontWeight: 'bold', color: '#3A1C1D' }}>10% OFF</span> your first order — no minimum purchase required.
        </p>
      </div>
    );
  }

  const getRemainingMessage = () => {
    if (subtotal < 3000) {
      return `Add ₹${(3000 - subtotal).toLocaleString('en-IN')} more to unlock 5% OFF`;
    } else if (subtotal < 6000) {
      return `Add ₹${(6000 - subtotal).toLocaleString('en-IN')} more to unlock 10% OFF`;
    } else {
      return "You're enjoying our highest available spend-based discount.";
    }
  };

  const getStatusMessage = () => {
    if (subtotal >= 6000) return "10% OFF unlocked";
    if (subtotal >= 3000) return "5% OFF unlocked";
    return "SHOP MORE, SAVE MORE";
  };

  const progressPercentage = Math.min((subtotal / 6000) * 100, 100);

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold', color: '#000000', marginBottom: '4px' }}>
            {getStatusMessage()}
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#4b5563', margin: 0 }}>
            {getRemainingMessage()}
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', paddingTop: '8px', paddingBottom: '24px' }}>
        {/* Progress bar background */}
        <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
          {/* Progress bar fill */}
          <div style={{ 
            height: '100%', 
            width: `${progressPercentage}%`, 
            backgroundColor: '#3A1C1D',
            transition: 'width 0.5s ease'
          }}></div>
        </div>

        {/* Checkpoint: 3000 */}
        <div style={{ position: 'absolute', left: '50%', top: '0', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '12px', height: '12px', borderRadius: '50%', 
            backgroundColor: subtotal >= 3000 ? '#3A1C1D' : '#d1d5db',
            border: '2px solid #ffffff',
            marginTop: '6px'
          }}></div>
          <div style={{ position: 'absolute', top: '24px', whiteSpace: 'nowrap', textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>₹3,000</span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: subtotal >= 3000 ? '#10b981' : '#9ca3af', fontWeight: 'bold' }}>5% OFF</span>
          </div>
        </div>

        {/* Checkpoint: 6000 */}
        <div style={{ position: 'absolute', right: '0', top: '0', transform: 'translateX(50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '12px' }}>
          <div style={{ 
            width: '12px', height: '12px', borderRadius: '50%', 
            backgroundColor: subtotal >= 6000 ? '#3A1C1D' : '#d1d5db',
            border: '2px solid #ffffff',
            marginTop: '6px',
            marginLeft: '-12px'
          }}></div>
          <div style={{ position: 'absolute', top: '24px', whiteSpace: 'nowrap', textAlign: 'center', right: '0' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>₹6,000</span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: subtotal >= 6000 ? '#10b981' : '#9ca3af', fontWeight: 'bold' }}>10% OFF</span>
          </div>
        </div>

      </div>
    </div>
  );
}
