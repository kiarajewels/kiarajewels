'use client';
import React from 'react';

export default function CustomOrderPage() {
  const whatsappNumber = "919510676409";
  const message = "Hi Kiara Jewels! I am interested in creating a custom jewellery piece. Can you help me?";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main style={{ backgroundColor: '#FBFAF7', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Times New Roman, serif', fontSize: '3.5rem', color: '#000000', marginBottom: '24px', fontWeight: 'bold' }}>
          Bring Your Dream Jewellery to Life
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#000000ff', lineHeight: '1.6', marginBottom: '40px' }}>
          Can't find exactly what you're looking for? Let our artisans craft a bespoke 925 Sterling Silver piece uniquely for you.
        </p>
      </section>

      {/* How It Works */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '2.2rem', color: '#000000', textAlign: 'center', marginBottom: '48px' }}>
          How It Works
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
          
          <div style={{ backgroundColor: 'white', padding: '32px 24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#c9c2b4', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.4rem', color: '#27302E', marginBottom: '16px' }}>Share Your Vision</h3>
            <p style={{ color: '#000000ff', fontSize: '1rem', lineHeight: '1.5' }}>Message us with your ideas, sketches, or reference pictures.</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '32px 24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#c9c2b4', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.4rem', color: '#27302E', marginBottom: '16px' }}>Consultation & Quote</h3>
            <p style={{ color: '#000000ff', fontSize: '1rem', lineHeight: '1.5' }}>We discuss design details, materials, and provide a final price.</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '32px 24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#c9c2b4', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.4rem', color: '#27302E', marginBottom: '16px' }}>Crafting</h3>
            <p style={{ color: '#000000ff', fontSize: '1rem', lineHeight: '1.5' }}>Once approved, our skilled artisans begin crafting your piece.</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '32px 24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#c9c2b4', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#000000', fontSize: '1.5rem', fontWeight: 'bold' }}>4</div>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.4rem', color: '#27302E', marginBottom: '16px' }}>Safe Delivery</h3>
            <p style={{ color: '#000000ff', fontSize: '1rem', lineHeight: '1.5' }}>Your unique jewellery is securely packaged and shipped to your door.</p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: '#c9c2b4', borderRadius: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '2.4rem', color: '#000000', marginBottom: '24px' }}>Ready to start your custom order?</h2>
        <p style={{ fontSize: '1.1rem', color: '#000000ff', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Click the button below to instantly connect with our design team on WhatsApp. Let's create something beautiful together.
        </p>
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '12px',
            backgroundColor: '#25D366', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '50px', 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
            transition: 'transform 0.2s, boxShadow 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Chat with our Design Team on WhatsApp
        </a>
      </section>

    </main>
  );
}
