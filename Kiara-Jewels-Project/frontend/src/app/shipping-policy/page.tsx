import React from 'react';

export default function ShippingPolicy() {
  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#fafafa', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#27302E', fontSize: '2.5rem', marginBottom: '32px', textAlign: 'center' }}>Shipping Policy</h1>
        <div style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <p style={{ marginBottom: '1.25rem' }}>At Kiara Jewels, every piece is prepared with attention to detail before it begins its journey to you.</p>
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Shipping Across India</h3>
          <p style={{ marginBottom: '1.25rem' }}>We currently offer shipping across India. Shipping is free on all orders.</p>
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Order Processing & Delivery</h3>
          <p style={{ marginBottom: '1.25rem' }}>Most of our jewellery is prepared specifically for your order. Please allow approximately:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Up to 4 days for product preparation/manufacturing</li>
            <li style={{ marginBottom: '0.5rem' }}>Approximately 3 days for delivery after dispatch</li>
          </ul>
          <p style={{ marginBottom: '1.25rem' }}>The estimated total delivery timeline is approximately 7 days from the date of placing your order.</p>
          <p style={{ marginBottom: '1.25rem' }}>Please note that delivery timelines may vary depending on your location, courier operations, weather conditions, public holidays, or other circumstances beyond our control.</p>
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Order Tracking</h3>
          <p style={{ marginBottom: '1.25rem' }}>Once your order has been dispatched, tracking details will be shared with you through the available contact details provided while placing the order.</p>
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Delivery Address</h3>
          <p style={{ marginBottom: '1.25rem' }}>Customers are responsible for providing an accurate and complete delivery address and contact details while placing an order. Kiara Jewels cannot be held responsible for delays or delivery issues caused by incorrect or incomplete information provided by the customer.</p>
          <h3 style={{ color: '#27302E', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Delays</h3>
          <p style={{ marginBottom: '1.25rem' }}>While we aim to deliver every order within the estimated timeframe, unforeseen circumstances may occasionally cause delays. We appreciate your patience and understanding in such situations.</p>
        </div>
      </div>
    </div>
  );
}
