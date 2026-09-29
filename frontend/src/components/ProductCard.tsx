'use client';
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = React.useState(false);
  
  const inWishlist = isInWishlist(product._id);
  const imageUrl = product.media && product.media.length > 0 ? product.media[0].url : '/images/placeholder.png';
  const hoverImageUrl = product.media && product.media.length > 1 ? product.media[1].url : imageUrl;

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      <button 
        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
        style={{ 
          position: 'absolute', top: '12px', right: '12px', zIndex: 10, 
          background: 'white', border: 'none', borderRadius: '50%', 
          width: '36px', height: '36px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', cursor: 'pointer', 
          color: inWishlist ? '#000000' : '#9ca3af', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s'
        }}
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0", fontSize: '20px' }}>
          favorite
        </span>
      </button>
      
      <Link href={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div 
          className="product-card__image-wrapper"
          style={{ position: 'relative', overflow: 'hidden' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="product-card__image" 
          />
          {hoverImageUrl !== imageUrl && (
            <img 
              src={hoverImageUrl} 
              alt={`${product.name} alternate view`} 
              className="product-card__image"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'opacity 0.4s ease, transform 1s ease-out'
              }}
            />
          )}
        </div>
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <div className="product-card__price" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Rs. {product.price}</span>
            {product.originalPrice > product.price && (
              <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.85em' }}>
                Rs. {product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <button 
        className="product-card__btn" 
        onClick={() => {
          addToCart(product, 1);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
