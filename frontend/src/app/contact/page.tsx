'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/contact`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', orderNumber: '', subject: 'General Inquiry', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Failed to send message. Please try again later.');
    }
  };

  return (
    <main style={{ minHeight: '80vh', backgroundColor: '#F7F7F5' }}>
      {/* Header */}
      <section style={{ backgroundColor: '#000000', color: '#777777', padding: '60px 24px', textAlign: 'left' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Times New Roman, serif', fontSize: '3rem', margin: '0 0 16px 0', fontWeight: 'normal' }}>Contact Us</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0', color: '#f3f4f6' }}>
            We would love to hear from you. Whether you have a question about our jewelry, an existing order, or a custom request, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', display: 'flex', flexWrap: 'wrap', gap: '60px' }}>
        
        {/* Left Side: Contact Information */}
        <div style={{ flex: '1 1 350px' }}>
          <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '2rem', color: '#000000', marginBottom: '32px' }}>Get In Touch</h2>
          
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#000000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Support</h3>
            <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.6' }}>
              <a href="mailto:kiarajewels.co@gmail.com" style={{ color: '#4b5563', textDecoration: 'none' }}>kiarajewels.co@gmail.com</a>
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#000000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone / WhatsApp</h3>
            <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.6' }}>
              <a href="tel:+919510676409" style={{ color: '#4b5563', textDecoration: 'none' }}>+91 9510676409</a>
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#000000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Business Hours</h3>
            <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Everyday<br/>
              10:00 AM – 7:00 PM IST
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#000000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Visit Us</h3>
            <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Shop no. 132 Ghanchi Ni Pol,<br/>
              Manek Chawk, Ahmedabad - 380001<br/>
              Gujarat, India
            </p>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div style={{ flex: '2 1 500px' }}>
          <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.8rem', color: '#000000', marginBottom: '24px' }}>Send a Message</h2>
          
          {status === 'success' ? (
            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ color: '#065f46', marginBottom: '12px', fontSize: '1.25rem' }}>Message Sent Successfully!</h3>
              <p style={{ color: '#047857' }}>Thank you for reaching out. We will get back to you within our business hours.</p>
              <button 
                onClick={() => setStatus('idle')}
                style={{ marginTop: '20px', padding: '8px 24px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {status === 'error' && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #ef4444', padding: '12px', borderRadius: '6px', color: '#b91c1c' }}>
                  {errorMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>Phone Number (Optional)</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>Order Number (Optional)</label>
                  <input type="text" name="orderNumber" value={formData.orderNumber} onChange={handleChange} style={inputStyle} placeholder="#KJ-" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>Subject *</label>
                <select name="subject" value={formData.subject} onChange={handleChange} required style={{...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }}>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Status / Issue">Order Status / Issue</option>
                  <option value="Returns & Exchanges">Returns & Exchanges</option>
                  <option value="Custom Jewelry Request">Custom Jewelry Request</option>
                  <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>Message *</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}
                  placeholder="How can we help you today?"
                />
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#000000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  transition: 'background-color 0.2s',
                  marginTop: '8px'
                }}
              >
                {status === 'loading' ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box' as const,
  fontFamily: 'inherit'
};
