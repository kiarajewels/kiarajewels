'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

import FAQSection from '@/components/FAQSection';
import HeroVideo from '@/components/HeroVideo';
import OfferSection from '@/components/OfferSection';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const { cartCount } = useCart();

  // Simple auto-carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?isBestSeller=true`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  // Scroll animation for homepage elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const blocks = document.querySelectorAll('.animate-up');
    blocks.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ===== CINEMATIC HERO VIDEO ===== */}
      <HeroVideo />

      {/* ===== EXCLUSIVE SAVINGS OFFER SECTION ===== */}
      <OfferSection />

      {/* ===== TRUST STRIP ===== */}
      <section style={{ margin: '80px 0 60px' }}>
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#000000', textAlign: 'center', marginBottom: '48px', fontWeight: 'normal' }}>
          Shop With Confidence
        </h2>
        <div style={{ padding: '0 24px', margin: '0 auto', maxWidth: '1200px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Claim 1 */}
        <div className="animate-up" style={{ textAlign: 'center', flex: '1 1 260px', padding: '32px 24px', backgroundColor: '#eaeaeaae', borderRadius: '0' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', borderRadius: '50%', border: '1px solid #ffffffff', marginBottom: '20px', backgroundColor: 'white' }}>
            <span className="material-symbols-outlined" style={{ color: '#27302E', fontSize: '2.2rem' }}>workspace_premium</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27302E', marginBottom: '12px', fontFamily: 'Times New Roman, serif' }}>925 Sterling Silver</h3>
          <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6' }}>Crafted with pure, hypoallergenic silver for flawless everyday wear.</p>
        </div>

        {/* Claim 2 */}
        <div className="animate-up delay-100" style={{ textAlign: 'center', flex: '1 1 260px', padding: '32px 24px', backgroundColor: '#eaeaeaae', borderRadius: '0' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', borderRadius: '50%', border: '1px solid #ffffffff', marginBottom: '20px', backgroundColor: 'white' }}>
            <span className="material-symbols-outlined" style={{ color: '#27302E', fontSize: '2.2rem' }}>diamond</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27302E', marginBottom: '12px', fontFamily: 'Times New Roman, serif' }}>Premium CZ Stones</h3>
          <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6' }}>Handpicked stones that deliver exceptional brilliance and diamond-like sparkle.</p>
        </div>

        {/* Claim 3 */}
        <div className="animate-up delay-200" style={{ textAlign: 'center', flex: '1 1 260px', padding: '32px 24px', backgroundColor: '#eaeaeaae', borderRadius: '0' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', borderRadius: '50%', border: '1px solid #ffffffff', marginBottom: '20px', backgroundColor: 'white' }}>
            <span className="material-symbols-outlined" style={{ color: '#27302E', fontSize: '2.2rem' }}>water_drop</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27302E', marginBottom: '12px', fontFamily: 'Times New Roman, serif' }}>Tarnish Resistant</h3>
          <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6' }}>Advanced multi-layer plating ensures your jewellery stays brilliant for longer.</p>
        </div>

        {/* Claim 4 */}
        <div className="animate-up delay-300" style={{ textAlign: 'center', flex: '1 1 260px', padding: '32px 24px', backgroundColor: '#eaeaeaae', borderRadius: '0' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', borderRadius: '50%', border: '1px solid #ffffffff', marginBottom: '20px', backgroundColor: 'white' }}>
            <span className="material-symbols-outlined" style={{ color: '#27302E', fontSize: '2.2rem' }}>local_shipping</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27302E', marginBottom: '12px', fontFamily: 'Times New Roman, serif' }}>Free Shipping</h3>
          <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6' }}>Enjoy complimentary express delivery across India on all your orders.</p>
        </div>

      </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <main id="main-content">
        {/* ===== CATEGORY SECTION ===== */}
        <section id="categories" className="categories-minimal animate-up">
          <h2 className="categories-minimal__heading" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'normal' }}>Our Collection</h2>
          <div className="categories-minimal__container">
            <Link href="/rings" className="category-row">
              <h3 className="category-row__title" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'normal' }}>RINGS</h3>
              <span className="material-symbols-outlined category-row__arrow">arrow_right_alt</span>
            </Link>
            
            <Link href="/earrings" className="category-row">
              <h3 className="category-row__title" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'normal' }}>EARRINGS</h3>
              <span className="material-symbols-outlined category-row__arrow">arrow_right_alt</span>
            </Link>
            
            <Link href="/pendant" className="category-row">
              <h3 className="category-row__title" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'normal' }}>NECKLACES</h3>
              <span className="material-symbols-outlined category-row__arrow">arrow_right_alt</span>
            </Link>
            
            <Link href="/bracelets" className="category-row">
              <h3 className="category-row__title" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'normal' }}>BRACELETS</h3>
              <span className="material-symbols-outlined category-row__arrow">arrow_right_alt</span>
            </Link>

            <Link href="/sets" className="category-row">
              <h3 className="category-row__title" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'normal' }}>SETS</h3>
              <span className="material-symbols-outlined category-row__arrow">arrow_right_alt</span>
            </Link>
          </div>
        </section>

        {/* ===== BEST SELLER SECTION ===== */}
        <section id="best-seller" className="best-seller animate-up">
          <div className="best-seller__massive-text" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'normal' }}>
            <div>OUR MOST</div>
            <div>LOVED</div>
            <div>CREATIONS</div>
          </div>
          <div className="best-seller__grid">
            {products
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {products.length > itemsPerPage && (
            <div className="pagination">
              {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination__btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ===== EDITORIAL SHOWCASE SECTION ===== */}
        <section className="editorial-showcase">
          {/* Block 1 - Rings */}
          <div className="editorial-block editorial-block--img-left animate-up">
            <div className="editorial-block__image">
              <img src="/images/herorings.png" alt="Rings" />
            </div>
            <div className="editorial-block__content">
              <span className="editorial-block__eyebrow">THE ART OF ADORNMENT</span>
              <h2 className="editorial-block__heading" style={{ fontFamily: '"Freestyle Script", cursive' }}>Rings That Tell Your Story</h2>
              <p className="editorial-block__description">
                Designed to become part of your everyday moments, our rings bring together graceful forms, delicate details and timeless sparkle.
              </p>
              <Link href="/rings" className="editorial-block__btn">EXPLORE RINGS</Link>
            </div>
          </div>

          {/* Block 2 - Bracelets */}
          <div className="editorial-block editorial-block--img-right animate-up">
            <div className="editorial-block__content">
              <span className="editorial-block__eyebrow">EFFORTLESS ELEGANCE</span>
              <h2 className="editorial-block__heading" style={{ fontFamily: '"Freestyle Script", cursive' }}>A Touch of Brilliance</h2>
              <p className="editorial-block__description">
                Delicate details meet effortless elegance in pieces designed to add a subtle sparkle to every moment.
              </p>
              <Link href="/bracelets" className="editorial-block__btn">EXPLORE BRACELETS</Link>
            </div>
            <div className="editorial-block__image">
              <img src="/images/herobracelet.png" alt="Bracelets" />
            </div>
          </div>

          {/* Block 3 - Earrings */}
          <div className="editorial-block editorial-block--img-left animate-up">
            <div className="editorial-block__image">
              <img src="/images/heroearrings.png" alt="Earrings" />
            </div>
            <div className="editorial-block__content">
              <span className="editorial-block__eyebrow">MAKE AN IMPRESSION</span>
              <h2 className="editorial-block__heading" style={{ fontFamily: '"Freestyle Script", cursive' }}>Designed To Be Noticed</h2>
              <p className="editorial-block__description">
                From everyday elegance to unforgettable occasions, discover earrings created to frame every moment beautifully.
              </p>
              <Link href="/earrings" className="editorial-block__btn">EXPLORE EARRINGS</Link>
            </div>
          </div>

          {/* Block 4 - Pendants */}
          <div className="editorial-block editorial-block--img-right animate-up">
            <div className="editorial-block__content">
              <span className="editorial-block__eyebrow">CLOSE TO THE HEART</span>
              <h2 className="editorial-block__heading" style={{ fontFamily: '"Freestyle Script", cursive' }}>Elegance, Worn Close</h2>
              <p className="editorial-block__description">
                Timeless silhouettes and refined sparkle come together in pendants designed to hold a special place in your story.
              </p>
              <Link href="/pendant" className="editorial-block__btn">EXPLORE PENDANTS</Link>
            </div>
            <div className="editorial-block__image">
              <img src="/images/heropendant.png" alt="Pendants" />
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <div className="animate-up">
          <FAQSection />
        </div>
      </main>

      
    </>
  );
}
