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
      <section style={{ background: 'var(--stone)', padding: '24px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="trust-strip-grid">
          {[
            { icon: <ShieldCheck size={20} strokeWidth={1.5} />, text: '925 sterling silver' },
            { icon: <Sparkles size={20} strokeWidth={1.5} />, text: 'Rhodium + anti-tarnish finish' },
            { icon: <Diamond size={20} strokeWidth={1.5} />, text: 'Premium CZ stones' },
            { icon: <Truck size={20} strokeWidth={1.5} />, text: 'Free shipping across India' },
            { icon: <RefreshCcw size={20} strokeWidth={1.5} />, text: '3-day returns' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}>
              {item.icon}
              <span style={{ fontSize: '0.9rem', letterSpacing: '0.02em', fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {[
            { name: 'Rings', image: '/images/herorings-v2.png', link: '/rings' },
            { name: 'Earrings', image: '/images/heroearrings-v2.png', link: '/earrings' },
            { name: 'Necklaces', image: '/images/heropendants-v2.png', link: '/necklaces' },
            { name: 'Bracelets', image: '/images/herobracelets-v2.png', link: '/bracelets' },
            { name: 'Sets', image: '/images/herosets-v2.png', link: '/sets' }
          ].map(cat => {
            const catKey = cat.name.toLowerCase();
            const minPrice = minPrices[catKey];
            return (
            <Link key={cat.name} href={cat.link} style={{ display: 'block', position: 'relative', aspectRatio: '4/5', background: 'var(--stone)', overflow: 'hidden' }}>
              {cat.image !== '/images/setsplaceholder.png' ? (
                <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 768px) 50vw, 20vw" style={{ objectFit: 'cover' }} className="hover-scale" priority={cat.name === 'Rings'} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: 'var(--stone)' }}></div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}></div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: 'var(--white)' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '0.05em', fontWeight: 500 }}>{cat.name}</h3>
                {minPrice && <p style={{ margin: '4px 0 0', fontSize: '0.9rem', opacity: 0.9 }}>From Rs. {minPrice}</p>}
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
      <section style={{ padding: '80px 24px', background: 'var(--ink)', color: 'var(--ivory)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: '0 0 16px', fontWeight: 500, fontFamily: 'var(--font-cormorant), serif' }}>Gifts, made to be remembered</h2>
          <p style={{ fontSize: '1.1rem', margin: '0 0 40px', color: 'rgba(255,255,255,0.8)' }}>Exclusive designs for every occasion.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Birthday', 'Anniversary', 'Engagement & Wedding', 'Festive', 'Just because'].map(occasion => (
              <Link key={occasion} href={`/gifting?occasion=${encodeURIComponent(occasion)}`} style={{ padding: '12px 24px', border: '1px solid var(--ivory)', color: 'var(--ivory)', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                {occasion}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Craft and Made to order */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 24px', fontWeight: 500, fontFamily: 'var(--font-cormorant), serif' }}>Made by hand, to order.</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, margin: '0 0 32px' }}>
            Every piece is made in our own unit by artisans with over a decade of experience. Made in about 4 days, delivered in about 3 more.
          </p>
          <Link href="/custom-order" style={{ display: 'inline-block', background: 'var(--ink)', color: 'var(--ivory)', padding: '14px 32px', textDecoration: 'none', letterSpacing: '0.05em', fontSize: '1rem' }}>
            Design your own piece
          </Link>
        </div>
      </section>

      {/* Meet the family */}
      <section style={{ padding: '60px 24px', background: 'var(--stone)', textAlign: 'center' }}>
        <Link href="/about" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-cormorant), serif', color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
          Meet the family behind Kiara &rarr;
        </Link>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Email Capture */}
      <EmailCapture />

    </main>
  );
}
