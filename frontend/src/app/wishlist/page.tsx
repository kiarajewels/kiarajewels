'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart, cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      

      <main style={{ paddingTop: '120px', minHeight: '80vh', backgroundColor: '#FBFAF7', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#000000', marginBottom: '32px', fontFamily: 'Times New Roman, serif' }}>Your Wishlist</h1>
          
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px', backgroundColor: 'white', borderRadius: '12px' }}>
              <Heart size={64} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '16px' }}>Your wishlist is empty</h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>Save items you love here and buy them later.</p>
              <Link href="/" style={{ display: 'inline-block', backgroundColor: '#000000', color: 'white', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' }}>
                Discover Products
              </Link>
            </div>
          ) : (
            <div className="best-seller__grid">
              {wishlistItems.map((product) => (
                <div key={product._id} className="product-card" style={{ position: 'relative' }}>
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                    style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#000000', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                  <Link href={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="product-card__image-wrapper">
                      <img 
                        src={product.media && product.media.length > 0 ? product.media[0].url : '/images/placeholder.png'} 
                        alt={product.name} 
                        className="product-card__image" 
                      />
                    </div>
                    <div className="product-card__info">
                      <h3 className="product-card__title">{product.name}</h3>
                      <p className="product-card__price">Rs. {product.price}</p>
                    </div>
                  </Link>
                  <button 
                    onClick={() => { addToCart(product, 1); toggleWishlist(product); }}
                    className="product-card__btn"
                  >
                    Move to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      
    </>
  );
}
