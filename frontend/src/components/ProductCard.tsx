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
    <div className="product-card">
      <button 
        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
        style={{ 
          position: 'absolute', top: '12px', right: '12px', zIndex: 10, 
          background: 'transparent', border: 'none', 
          width: '32px', height: '32px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', cursor: 'pointer', 
          color: inWishlist ? '#000000' : '#4b5563', 
          transition: 'color 0.2s'
        }}
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart size={18} fill={inWishlist ? "currentColor" : "none"} strokeWidth={1} />
      </button>
      
      <div 
        className="product-card__image-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
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
                transition: 'opacity 0.4s ease'
              }}
            />
          )}
        </Link>
        <button 
          className="product-card__add-btn"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product, 1);
          }}
        >
          ADD +
        </button>
      </div>
      
      <Link href={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <div className="product-card__price">
            Rs. {product.price}
            {product.originalPrice > product.price && (
              <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginLeft: '8px', fontSize: '0.9em', fontWeight: 400 }}>
                Rs. {product.originalPrice}
              </span>
            )}
          </div>
          <div className="product-card__material">{product.category || 'Sterling Silver'}</div>
        </div>
      </Link>
    </div>
  );
}
