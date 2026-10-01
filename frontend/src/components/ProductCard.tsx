'use client';
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';
import Image from 'next/image';

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
        <Heart size={20} fill={inWishlist ? "currentColor" : "none"} strokeWidth={1.5} />
      </button>
      
      <Link href={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div 
          className="product-card__image-wrapper"
          style={{ position: 'relative', overflow: 'hidden' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image 
            src={imageUrl} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'cover' }}
            className="product-card__image" 
          />
          {hoverImageUrl !== imageUrl && (
            <Image 
              src={hoverImageUrl} 
              alt={`${product.name} alternate view`} 
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="product-card__image"
              style={{
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
