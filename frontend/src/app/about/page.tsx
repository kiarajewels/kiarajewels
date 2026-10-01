import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--ivory)' }}>
      {/* Hero Section */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', backgroundColor: 'var(--stone)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 24px', fontWeight: 500, letterSpacing: '0.02em', color: 'var(--ink)' }}>
            Our Story
          </h1>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'rgba(0,0,0,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            Bridging the gap between mass-produced junk and overpriced luxury.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', aspectRatio: '4/5', width: '100%', background: 'var(--stone)' }}>
            <Image 
              src="/images/herorings.png" 
              alt="Artisans at work in our Mumbai workshop"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '32px', fontWeight: 500 }}>A family legacy of craftsmanship</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(0,0,0,0.8)' }}>
              <p>
                Kiara Jewels started as a small, family-owned manufacturing unit in Mumbai. For over 10 years, we quietly crafted premium silver jewellery for luxury retailers across the globe, mastering the delicate balance of design and durability.
              </p>
              <p>
                But as the market evolved, we saw a widening gap. On one end were mass-produced, low-quality pieces that tarnished in days. On the other end was inaccessible, overpriced luxury. 
              </p>
              <p>
                We realized that true luxury shouldn't be defined by an exorbitant price tag, but by the quality of materials, ethical sourcing, and the hands that make it. That's why we started selling direct.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--ink)', color: 'var(--ivory)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '64px', fontWeight: 500 }}>What we stand for</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', textAlign: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 500, color: 'var(--rose)' }}>Handmade Quality</h3>
              <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Every piece is made to order by artisans with over a decade of experience, ensuring meticulous attention to detail.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 500, color: 'var(--rose)' }}>Ethical Sourcing</h3>
              <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                We use responsibly sourced 925 sterling silver and conflict-free premium cubic zirconia stones.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 500, color: 'var(--rose)' }}>Lasting Finish</h3>
              <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Our signature multi-layer rhodium plating and anti-tarnish coating keep your pieces shining for years.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Workshop Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
          
          <div style={{ order: 2 }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', width: '100%', background: 'var(--stone)' }}>
              <Image 
                src="/images/heropendant.png" 
                alt="Detailed view of our jewellery making process"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div style={{ order: 1 }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '32px', fontWeight: 500 }}>From our workshop to you</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.1rem', lineHeight: 1.7, color: 'rgba(0,0,0,0.8)' }}>
              <p>
                By cutting out the middlemen, we bring our handcrafted designs straight from our Mumbai workshop to your door. This means you get uncompromising quality and craftsmanship without the traditional retail markups.
              </p>
              <p>
                We believe everyday jewellery should elevate your daily moments. It should be beautiful, durable, and above all, accessible.
              </p>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
