import './globals.css'
import Script from 'next/script'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import AuthProvider from '@/context/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnnouncementBar from '@/components/AnnouncementBar'
import { Toaster } from 'react-hot-toast'
import WhatsAppButton from '@/components/WhatsAppButton'

import Analytics from '@/components/Analytics'
import CookieConsent from '@/components/CookieConsent'

export const metadata = {
  title: 'Kiara Jewels | 925 Silver Jewellery Online India',
  description: 'Shop premium 925 silver jewellery online in India. Discover anti-tarnish rhodium plated silver rings, American Diamond (CZ) jewellery, and perfect gifts for her.',
  keywords: ['925 silver jewellery online India', 'American Diamond (CZ) jewellery', 'anti-tarnish silver jewellery', 'rhodium plated silver rings', 'gifts for her'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://www.kiarajewels.co/#organization",
              "name": "Kiara Jewels",
              "url": "https://www.kiarajewels.co",
              "logo": "https://www.kiarajewels.co/logo.png"
            },
            {
              "@type": "WebSite",
              "@id": "https://www.kiarajewels.co/#website",
              "url": "https://www.kiarajewels.co",
              "name": "Kiara Jewels",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.kiarajewels.co/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          ]
        })}} />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster position="bottom-center" toastOptions={{ style: { background: 'var(--ink)', color: 'var(--ivory)' } }} />
              <AnnouncementBar />
              <Navbar />
              <div style={{ flex: 1 }}>
                {children}
              </div>
              <WhatsAppButton />
              <Footer />
              <CookieConsent />
              <Analytics />
              
              {/* Razorpay Script for Client Side Checkout */}
              <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
