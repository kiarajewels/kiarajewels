import React from 'react';

export default function OfferSection() {
  return (
    <section style={{ padding: '80px 24px', backgroundColor: '#FAF9F6', textAlign: 'center' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '2.5rem', color: '#27302E', marginBottom: '8px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Exclusive Savings
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: '60px', fontStyle: 'italic' }}>
          "More reasons to find something beautiful."
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          {/* Group 1 */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '50px 30px', 
            borderRadius: '12px', 
            border: '1px solid #E5E7EB',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1rem', letterSpacing: '3px', color: '#27302E', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600' }}>First Order</h3>
            <div style={{ fontSize: '3rem', fontFamily: 'Times New Roman, serif', color: '#3A1C1D', marginBottom: '16px', lineHeight: '1' }}>
              10% OFF
            </div>
            <p style={{ fontSize: '0.95rem', color: '#6B7280', margin: 0 }}>
              No minimum purchase required.
            </p>
          </div>

          {/* Group 2 */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '40px 30px', 
            borderRadius: '12px', 
            border: '1px solid #E5E7EB',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1rem', letterSpacing: '3px', color: '#27302E', textTransform: 'uppercase', marginBottom: '24px', fontWeight: '600' }}>Shop More, Save More</h3>
            
            <div style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
              <span style={{ fontSize: '1.1rem', color: '#27302E', fontWeight: '500' }}>₹3,000+</span>
              <span style={{ fontSize: '1.1rem', color: '#4B5563' }}>→</span>
              <span style={{ fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', color: '#3A1C1D', fontWeight: 'bold' }}>5% OFF</span>
            </div>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.1rem', color: '#27302E', fontWeight: '500' }}>₹6,000+</span>
              <span style={{ fontSize: '1.1rem', color: '#4B5563' }}>→</span>
              <span style={{ fontSize: '1.2rem', fontFamily: 'Times New Roman, serif', color: '#3A1C1D', fontWeight: 'bold' }}>10% OFF</span>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0, fontStyle: 'italic' }}>
              Available on subsequent orders.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
