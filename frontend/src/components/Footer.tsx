import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#c9c2b4', color: '#ffffff', padding: '60px 40px 40px', marginTop: 'auto', overflow: 'hidden' }}>
      <style>{`
        .footer-link-elegant {
          color: #ffffff;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 1px;
          transition: opacity 0.3s ease;
        }
        .footer-link-elegant:hover {
          opacity: 0.7;
        }
        .footer-link-small {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.85rem;
          transition: opacity 0.3s ease;
        }
        .footer-link-small:hover {
          opacity: 0.7;
        }
        .footer-massive-text {
          font-family: 'Abyssinica SIL', serif;
          font-size: clamp(4rem, 20vw, 22rem);
          line-height: 1;
          color: #ffffff;
          text-align: center;
          margin: 40px 0;
          letter-spacing: 2px;
          user-select: none;
        }
        .footer-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.4);
          width: 100%;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .footer-top-nav, .footer-bottom-nav {
            flex-direction: column;
            align-items: center !important;
            gap: 24px !important;
            text-align: center;
          }
          .footer-top-nav-links, .footer-bottom-nav-links, .footer-bottom-nav-legal {
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px !important;
          }
          .footer-massive-text {
            margin: 24px 0;
          }
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Top Nav */}
        <div className="footer-top-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '32px' }}>
          <div className="footer-top-nav-links" style={{ display: 'flex', gap: '32px' }}>
            <Link href="/rings" className="footer-link-elegant">Rings</Link>
            <Link href="/earrings" className="footer-link-elegant">Earrings</Link>
            <Link href="/pendant" className="footer-link-elegant">Necklaces</Link>
            <Link href="/bracelets" className="footer-link-elegant">Bracelets</Link>
            <Link href="/sets" className="footer-link-elegant">Sets</Link>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="https://www.facebook.com/kiarajewels.co" className="footer-link-elegant" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/kiarajewels.co" className="footer-link-elegant" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Massive Logo */}
        <div className="footer-massive-text">
          KIARA
        </div>

        <div className="footer-divider"></div>

        {/* Bottom Nav */}
        <div className="footer-bottom-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px', marginBottom: '60px' }}>
          <div className="footer-bottom-nav-links" style={{ display: 'flex', gap: '24px' }}>
            <Link href="/about" className="footer-link-small">Our Story</Link>
            <Link href="/jewellery-care" className="footer-link-small">Materials & Care</Link>
            <Link href="/shipping-policy" className="footer-link-small">Shipping & Returns</Link>
            <Link href="/contact" className="footer-link-small">Contact Us</Link>
          </div>
          <div className="footer-bottom-nav-legal" style={{ display: 'flex', gap: '24px' }}>
            <Link href="/privacy-policy" className="footer-link-small">Privacy Policy</Link>
            <Link href="/terms" className="footer-link-small">Terms of Service</Link>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
          &copy; {new Date().getFullYear()} Kiara Jewels. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
