import React from 'react';

export default function ReturnPolicy() {
  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#F7F7F5', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', fontSize: '2.5rem', marginBottom: '32px', textAlign: 'left' }}>Return & Refund Policy</h1>
        <div style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <p style={{ marginBottom: '1.25rem' }}>At Kiara Jewels, every piece undergoes careful quality checks before being dispatched. However, if you need to return an eligible product, please review the following policy carefully.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3-Day Return Window</h3>
          <p style={{ marginBottom: '1.25rem' }}>Unused and unworn jewellery may be returned within 3 days of delivery, subject to the conditions mentioned below.</p>
          <p style={{ marginBottom: '1.25rem' }}>To be eligible for a return, the product must be:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Unused and unworn</li>
            <li style={{ marginBottom: '0.5rem' }}>In its original condition</li>
            <li style={{ marginBottom: '0.5rem' }}>Free from damage or alteration</li>
            <li style={{ marginBottom: '0.5rem' }}>Returned with its original packaging and components</li>
          </ul>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Quality Inspection</h3>
          <p style={{ marginBottom: '1.25rem' }}>Every returned product undergoes a thorough quality inspection after reaching our facility.</p>
          <p style={{ marginBottom: '1.25rem' }}>A return may be rejected if the product is found to be:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Damaged after delivery</li>
            <li style={{ marginBottom: '0.5rem' }}>Worn or excessively used</li>
            <li style={{ marginBottom: '0.5rem' }}>Altered, repaired, or tampered with</li>
            <li style={{ marginBottom: '0.5rem' }}>Missing original components or packaging</li>
            <li style={{ marginBottom: '0.5rem' }}>Replaced or duplicated with another item</li>
          </ul>
          <p style={{ marginBottom: '1.25rem' }}>Kiara Jewels reserves the right to reject a return if the returned product does not match the condition in which it was originally delivered.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>How to Request a Return</h3>
          <p style={{ marginBottom: '1.25rem' }}>To initiate a return, customers must submit a return request within 3 days of receiving the order through our website or by contacting our customer support team at support@kiarajewels.com.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Refund Process</h3>
          <p style={{ marginBottom: '1.25rem' }}>Once the returned item reaches our facility, the product will undergo a quality inspection. If approved, the eligible refund will be processed to the original source account/payment method within 7 days.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>No Exchange Policy</h3>
          <p style={{ marginBottom: '1.25rem' }}>Currently, Kiara Jewels does not offer exchanges.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Custom & Made-to-Order Jewellery</h3>
          <p style={{ marginBottom: '1.25rem' }}>Customised, engraved, personalised, or specially made-to-order jewellery may not be eligible for return unless the product is received damaged or defective.</p>
        </div>
      </div>
    </div>
  );
}
