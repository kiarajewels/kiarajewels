import React from 'react';

export default function CancellationPolicy() {
  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#fafafa', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#27302E', fontSize: '2.5rem', marginBottom: '32px', textAlign: 'center' }}>Cancellation Policy</h1>
        <div style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <p style={{ marginBottom: '1.25rem' }}>At Kiara Jewels, we strive to ensure that your orders are processed efficiently.</p>
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Order Cancellation</h3>
          <p style={{ marginBottom: '1.25rem' }}>Orders can only be cancelled within 12 hours of placement. Once an order has entered the manufacturing or dispatch phase, cancellation requests will not be accepted.</p>
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>How to Cancel</h3>
          <p style={{ marginBottom: '1.25rem' }}>To request a cancellation, please email support@kiarajewels.com or use the contact form within 12 hours of your purchase, quoting your Order ID.</p>
        </div>
      </div>
    </div>
  );
}
