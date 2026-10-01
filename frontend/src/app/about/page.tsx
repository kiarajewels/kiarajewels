import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--ivory)' }}>
      {/* Hero Section */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', backgroundColor: 'var(--stone)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 24px', fontWeight: 500, letterSpacing: '0.02em', color: 'var(--ink)' }}>
            Why Kiara Exists
          </h1>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'rgba(0,0,0,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            A family-run business crafting premium 925 silver jewellery in-house.
          </p>
        </div>
      </section>

      {/* Content Section: Why Kiara exists & What we make */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', aspectRatio: '4/5', width: '100%', background: 'var(--stone)' }}>
            <Image 
              src="/images/herorings.png" 
              alt="Artisans at work in our workshop"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '32px', fontWeight: 500 }}>What we make and how</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(0,0,0,0.8)' }}>
              <p>
                We believe that high-quality, elegant jewellery shouldn't be limited to special occasions or come with an exorbitant retail markup. Kiara Jewels was born out of a desire to bridge the gap between mass-produced fast fashion and unattainable luxury.
              </p>
              <p>
                By keeping our operations family-run and our manufacturing strictly in-house, we control every detail of the process. We create premium 925 sterling silver pieces adorned with high-grade CZ stones, giving you the brilliance of diamonds with the everyday durability you need.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* The 3 Steps Section */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--ink)', color: 'var(--ivory)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '64px', fontWeight: 500 }}>How It's Made: The 3 Steps</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--rose)' }}>01</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 500 }}>Design</h3>
              <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Every piece starts as an idea, sketched and refined by our in-house design team to balance modern aesthetics with timeless elegance.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--rose)' }}>02</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 500 }}>Setting</h3>
              <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Master artisans hand-set our premium CZ stones into the 925 silver base, ensuring maximum light reflection and secure placement.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--rose)' }}>03</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 500 }}>Finishing</h3>
              <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                We apply a multi-layer rhodium plating and a specialized anti-tarnish coating to give the piece its lasting, signature shine.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* The Family Section */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--ivory)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '64px', fontWeight: 500, color: 'var(--ink)' }}>The Family</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
            
            {/* Prakash */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid #d1d5db' }}>
                <span style={{ fontSize: '2rem', color: '#9ca3af', fontWeight: 500 }}>PL</span>
                {/* TODO: replace with photo */}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: 500, color: 'var(--ink)' }}>Prakash Lalchandani</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--rose-deep)', fontWeight: 500, marginBottom: '16px' }}>Founder</p>
              <p style={{ lineHeight: 1.6, color: 'rgba(0,0,0,0.7)' }}>Technology, packaging and deliveries.</p>
            </div>

            {/* Parmanand */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid #d1d5db' }}>
                <span style={{ fontSize: '2rem', color: '#9ca3af', fontWeight: 500 }}>PL</span>
                {/* TODO: replace with photo */}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: 500, color: 'var(--ink)' }}>Parmanand Lalchandani</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--rose-deep)', fontWeight: 500, marginBottom: '16px' }}>Manufacturing & Design</p>
              <p style={{ lineHeight: 1.6, color: 'rgba(0,0,0,0.7)' }}>Manufacturing and design.</p>
            </div>

            {/* Yash */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid #d1d5db' }}>
                <span style={{ fontSize: '2rem', color: '#9ca3af', fontWeight: 500 }}>YL</span>
                {/* TODO: replace with photo */}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: 500, color: 'var(--ink)' }}>Yash Lalchandani</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--rose-deep)', fontWeight: 500, marginBottom: '16px' }}>Online Presence & Marketing</p>
              <p style={{ lineHeight: 1.6, color: 'rgba(0,0,0,0.7)' }}>Online presence and marketing.</p>
            </div>
            
          </div>
          
          {/* Placeholder paragraph for owner to personalize */}
          <div style={{ marginTop: '64px', padding: '32px', backgroundColor: 'var(--stone)', borderLeft: '4px solid var(--rose)' }}>
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
              "We built Kiara Jewels from the ground up in [CITY], driven by a passion for creating meaningful pieces that don't compromise on quality or ethics. Every day, our family works together to bring you the very best in silver jewellery." <br />
              <span style={{ fontSize: '0.9rem', color: '#6b7280', display: 'block', marginTop: '16px' }}>(TODO: Owner to personalize this message and replace [CITY])</span>
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
