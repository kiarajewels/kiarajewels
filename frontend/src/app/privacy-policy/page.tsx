import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Kiara Jewels',
  description: 'Learn how Kiara Jewels collects, uses, and protects your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#F7F7F5', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', fontSize: '2.5rem', marginBottom: '32px', textAlign: 'left' }}>Privacy Policy</h1>
        <div style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <p style={{ marginBottom: '1.25rem' }}>At Kiara Jewels, we respect your privacy and are committed to protecting your personal information.</p>
          <p style={{ marginBottom: '1.25rem' }}>This Privacy Policy explains how we collect, use, store, and protect information when you visit or make a purchase through our website.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Information We Collect</h3>
          <p style={{ marginBottom: '1.25rem' }}>When you browse our website or place an order, we may collect information including Name, Phone number, Email address, Shipping and billing address, Order details, and device/browser information.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>How We Use Your Information</h3>
          <p style={{ marginBottom: '1.25rem' }}>Your information may be used to process and fulfil orders, arrange shipping, process payments, provide customer support, and improve our services.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Cookies and Analytics</h3>
          <p style={{ marginBottom: '1.25rem' }}>We use cookies and tracking technologies (like Google Analytics and Meta Pixel) to analyze site traffic, personalize content, and serve targeted advertisements. These technologies collect data such as pages visited, items added to your cart, and purchase actions. By clicking "Accept" on our cookie banner, you consent to this tracking. You can clear or disable cookies in your browser settings at any time.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Payment Information</h3>
          <p style={{ marginBottom: '1.25rem' }}>Payments are processed through trusted third-party providers. We do not store sensitive payment credentials such as complete card details on our servers.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Data Security</h3>
          <p style={{ marginBottom: '1.25rem' }}>We take reasonable measures to protect your personal information against unauthorised access, misuse, alteration, or disclosure.</p>
          <h3 style={{ color: '#000000', fontFamily: 'Times New Roman, serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Contact Us</h3>
          <p style={{ marginBottom: '1.25rem' }}>For questions regarding this Privacy Policy or how your information is handled, please contact us at support@kiarajewels.com.</p>
        </div>
      </div>
    </div>
  );
}
