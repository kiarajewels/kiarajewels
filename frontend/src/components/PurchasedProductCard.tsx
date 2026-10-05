'use client';
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function PurchasedProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  
  if (!product) {
    return null; // Product might have been deleted from DB
  }

  const isAvailable = product.countInStock > 0;
  const imageUrl = product.media && product.media.length > 0 ? product.media[0].url : '/images/placeholder.png';

  return (
    <div className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Link href={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none', flexGrow: 1 }}>
        <div className="product-card__image-wrapper">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="product-card__image" 
          />
        </div>
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__price">Rs. {product.price}</p>
        </div>
      </Link>
      
      <div style={{ marginTop: 'auto' }}>
        {isAvailable ? (
          <button 
            className="product-card__btn" 
            onClick={() => {
              addToCart(product, 1);
            }}
            style={{ 
              backgroundColor: '#53131e', 
              color: 'white',
              width: '100%',
              padding: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '14px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fc128bff')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f01385ff')}
          >
            Buy Again
          </button>
        ) : (
          <div style={{
            width: '100%',
            padding: '10px',
            textAlign: 'center',
            backgroundColor: '#f3f4f6',
            color: '#9ca3af',
            fontWeight: '500',
            fontSize: '14px',
            borderTop: '1px solid #e5e7eb'
          }}>
            Currently unavailable
          </div>
        )}
      </div>
    </div>
  );
}
