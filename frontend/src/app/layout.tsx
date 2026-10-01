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

export const metadata = {
  title: 'Kiara Jewels | Silver CZ Jewellery, Made to Order',
  description: '925 silver jewellery with premium cubic zirconia (CZ) stones, rhodium-plated with an anti-tarnish coating. Free shipping across India.',
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
              
              {/* Razorpay Script for Client Side Checkout */}
              <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
