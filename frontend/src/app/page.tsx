import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Diamond, Sparkles, Truck, RefreshCcw } from 'lucide-react';
import HeroVideo from '@/components/HeroVideo';
import ProductCarousel from '@/components/ProductCarousel';
import FAQSection from '@/components/FAQSection';
import EmailCapture from '@/components/EmailCapture';

export const metadata = {
  title: 'Kiara Jewels | Silver CZ Jewellery, Made to Order',
  description: '925 silver jewellery with premium CZ/American Diamond style stones. Made to order with free shipping across India.',
  openGraph: {
    title: 'Kiara Jewels | Silver CZ Jewellery, Made to Order',
    description: '925 silver jewellery with premium CZ/American Diamond style stones. Made to order with free shipping across India.',
    url: 'https://www.kiarajewels.co',
    siteName: 'Kiara Jewels',
    images: [
      {
        url: 'https://www.kiarajewels.co/images/hero_videos/heroimage1.png',
        width: 1200,
        height: 630,
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kiara Jewels | Silver CZ Jewellery, Made to Order',
    description: '925 silver jewellery with premium CZ/American Diamond style stones. Made to order with free shipping across India.',
    images: ['https://www.kiarajewels.co/images/hero_videos/heroimage1.png'],
  },
  alternates: {
    canonical: 'https://www.kiarajewels.co',
  }
}

async function getBestSellers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?isBestSeller=true`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    console.error("Failed to fetch best sellers, status:", res.status);
    return []; // Fallback to empty only if not throwing
  }
  return res.json();
}

async function getCategoryMinPrices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    console.error("Failed to fetch min prices, status:", res.status);
    return {};
  }
  const products = await res.json();
    const minPrices: Record<string, number> = {};
    products.forEach((p: any) => {
      const cat = (p.category || '').toLowerCase();
      if (!minPrices[cat] || p.price < minPrices[cat]) {
        minPrices[cat] = p.price;
      }
    });
    return minPrices;
}

export default async function Home() {
  const bestSellers = await getBestSellers();
  const minPrices = await getCategoryMinPrices();

  const instaPosts = [
    '/images/hero_videos/heroimage1.png',
    '/images/hero_videos/heroimage2.png',
    '/images/hero_videos/heroimage3.png',
    '/images/hero_videos/heroimage4.png',
    '/images/herorings.png',
    '/images/herobracelet.png'
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kiara Jewels",
    "url": "https://www.kiarajewels.co",
    "logo": "https://www.kiarajewels.co/logo.png",
    "sameAs": [
      "https://www.instagram.com/kiarajewels.co"
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroVideo />

      {/* Trust Strip */}
      <section style={{ background: '#FFFFFF', padding: '40px 0', borderBottom: '1px solid #E5E5E5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', padding: '0 24px', flexWrap: 'wrap', gap: '32px' }} className="trust-strip-container">
          {[
            { top: '925', bottom: 'STERLING SILVER' },
            { top: 'RHODIUM', bottom: 'FINISH' },
            { top: 'PREMIUM', bottom: 'CZ' },
            { top: 'FREE', bottom: 'SHIPPING' },
            { top: '3-DAY', bottom: 'RETURNS' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: '#000000', flex: '1 1 120px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}>{item.top}</span>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.7, textTransform: 'uppercase' }}>{item.bottom}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: '#000000', color: '#FFFFFF', padding: '60px 40px', textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', margin: 0, fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-cormorant), serif' }}>
            SHOP BY CATEGORY
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px', background: '#E5E5E5', border: '1px solid #E5E5E5' }}>
          {[
            { name: 'Rings', image: '/images/herorings-v2.png', link: '/rings' },
            { name: 'Earrings', image: '/images/heroearrings-v2.png', link: '/earrings' },
            { name: 'Pendants', image: '/images/heropendants-v2.png', link: '/pendants' },
            { name: 'Bracelets', image: '/images/herobracelets-v2.png', link: '/bracelets' },
            { name: 'Sets', image: '/images/herosets-v2.png', link: '/sets' }
          ].map((cat, index) => {
            const catKey = cat.name.toLowerCase();
            const minPrice = minPrices[catKey];
            const isFullWidth = index === 4;
            return (
            <Link key={cat.name} href={cat.link} style={{ display: 'block', position: 'relative', aspectRatio: isFullWidth ? '21/9' : '3/4', background: '#FFFFFF', overflow: 'hidden', gridColumn: isFullWidth ? '1 / -1' : 'auto' }} className="category-card">
              {cat.image !== '/images/setsplaceholder.png' ? (
                <Image src={cat.image} alt={cat.name} fill sizes={isFullWidth ? "100vw" : "(max-width: 768px) 50vw, 33vw"} style={{ objectFit: 'cover' }} className="hover-scale" priority={cat.name === 'Rings'} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: '#F7F7F5' }}></div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }}></div>
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', color: '#FFFFFF' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '0.1em', fontWeight: 400, textTransform: 'uppercase' }}>{cat.name}</h3>
                {minPrice && <p style={{ margin: '8px 0 0', fontSize: '0.85rem', opacity: 0.9, letterSpacing: '0.05em' }}>FROM RS. {minPrice}</p>}
              </div>
            </Link>
          )})}
        </div>
      </section>

      {/* Most Loved */}
      {bestSellers && bestSellers.length > 0 && (
        <ProductCarousel products={bestSellers} title="Most Loved" />
      )}

      {/* Gifting Teaser */}
      <section style={{ padding: '120px 24px', background: '#FFFFFF', color: '#000000', textAlign: 'center', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 24px', fontWeight: 400, fontFamily: 'var(--font-cormorant), serif', textTransform: 'uppercase', lineHeight: 1.1 }}>GIFTS,<br/>MADE TO BE REMEMBERED.</h2>
          <p style={{ fontSize: '1rem', margin: '0 0 48px', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Exclusive designs for every occasion.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Birthday', 'Anniversary', 'Engagement & Wedding', 'Festive', 'Just because'].map(occasion => (
              <Link key={occasion} href={`/gifting?occasion=${encodeURIComponent(occasion)}`} style={{ padding: '14px 32px', border: '1px solid #E5E5E5', color: '#000000', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.3s' }} className="gifting-btn">
                {occasion}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Craft and Made to order */}
      <section style={{ display: 'flex', flexWrap: 'wrap', background: '#000000', color: '#FFFFFF' }}>
        <div style={{ flex: '1 1 50%', minHeight: '500px', position: 'relative' }}>
          <Image src="/images/hero_videos/heroimage2.png" alt="Craftsmanship" fill style={{ objectFit: 'cover', filter: 'grayscale(100%) contrast(1.2)' }} sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10vw 5vw' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', margin: '0 0 24px', fontWeight: 400, fontFamily: 'var(--font-cormorant), serif', textTransform: 'uppercase', lineHeight: 1.1 }}>MADE BY HAND,<br/>TO ORDER.</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.8, margin: '0 0 16px', color: '#D9D9D9' }}>
            Every piece is made in our own unit by artisans with over a decade of experience.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.8, margin: '0 0 40px', color: '#D9D9D9' }}>
            Made in about 4 days, delivered in about 3 more.
          </p>
          <div>
            <Link href="/custom-order" style={{ display: 'inline-block', background: '#FFFFFF', color: '#000000', padding: '16px 32px', textDecoration: 'none', letterSpacing: '0.1em', fontSize: '0.85rem', textTransform: 'uppercase', border: '1px solid #FFFFFF' }}>
              DESIGN YOUR OWN PIECE
            </Link>
          </div>
          <div style={{ marginTop: '60px' }}>
            <Link href="/about" style={{ fontSize: '0.85rem', color: '#FFFFFF', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #FFFFFF', paddingBottom: '4px' }}>
              Meet the family behind Kiara &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Email Capture */}
      <EmailCapture />

    </main>
  );
}
