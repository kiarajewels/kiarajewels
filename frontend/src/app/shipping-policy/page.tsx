import React from 'react';

export default function ShippingAndReturnsPolicy() {
  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#FBFAF7', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#27302E', fontSize: '2.5rem', marginBottom: '32px', textAlign: 'center' }}>Shipping & Returns</h1>
        <div style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1.05rem' }}>
          
          <h2 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '2rem', marginTop: '1rem', marginBottom: '1rem' }}>Shipping Policy</h2>
          <p style={{ marginBottom: '1.25rem' }}>Shipping is free across India. Tracking is shared once dispatched.</p>
          
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Order Processing & Delivery</h3>
          <p style={{ marginBottom: '1.25rem' }}>Most of our jewellery is made to order. Please allow approximately:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>About 4 days to make.</li>
            <li style={{ marginBottom: '0.5rem' }}>About 3 days for delivery (varies by pincode).</li>
          </ul>
          <p style={{ marginBottom: '1.25rem' }}>The estimated total delivery timeline is about 7 days from the date of placing your order.</p>

          <hr style={{ margin: '40px 0', borderColor: '#e5e7eb' }} />

          <h2 id="returns" style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '2rem', marginTop: '1rem', marginBottom: '1rem' }}>Return Policy</h2>
          
          <p style={{ marginBottom: '1.25rem' }}>You can request a return within 3 days of delivery. <strong>No exchanges.</strong></p>
          
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>How to Request</h3>
          <p style={{ marginBottom: '1.25rem' }}>Please request a return via WhatsApp or email using our existing contact details.</p>

          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Inspection & Refunds</h3>
          <p style={{ marginBottom: '1.25rem' }}>We inspect every returned item within 24 hours of receiving it. If it is in good condition, the refund is issued.</p>
          <p style={{ marginBottom: '1.25rem' }}>A return will not be accepted if the item arrives damaged, excessively worn, a duplicate, or a different item from the one we shipped. In these cases we will contact you personally to talk it through.</p>

          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Important Details</h3>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>[CONFIRM]</strong> Who pays the return shipping.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>[CONFIRM]</strong> Refund timeline and method (suggest: to the original payment method).</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>[CONFIRM]</strong> Custom-designed pieces are non-returnable unless defective.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>[CONFIRM]</strong> Whether an unboxing video is required for damage claims.</li>
          </ul>

        </div>
      </div>
    </div>
  );
}
