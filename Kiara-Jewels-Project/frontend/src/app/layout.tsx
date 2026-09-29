import './globals.css'
import Script from 'next/script'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import AuthProvider from '@/context/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnnouncementBar from '@/components/AnnouncementBar'

export const metadata = {
  title: 'Kiara Jewels | The Perfect Match',
  description: 'Find your perfect jewelry match with Kiara Jewels.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0..1,0" />
        <link href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&display=swap" rel="stylesheet" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <div style={{ flex: 1 }}>
                {children}
              </div>
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
