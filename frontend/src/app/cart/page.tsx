'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import CartSavingsProgress from '@/components/CartSavingsProgress';
import OffersBlock from '@/components/OffersBlock';
import { ShoppingBag } from 'lucide-react';
import { trackEvent } from '@/components/Analytics';

export default function CartPage() {
  const { data: session } = useSession();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount, subtotal, discountAmount, isFirstOrder } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (cartItems.length > 0) {
      trackEvent('view_cart', {
        currency: 'INR',
        value: cartTotal,
        items: cartItems.map((item: any) => ({
          item_id: item.product,
          item_name: item.name,
          price: item.price,
          quantity: item.qty
        }))
      });
    }
  }, [cartItems]);

  if (!mounted) return null;

  return (
    <>
      

      <main style={{ paddingTop: '120px', minHeight: '80vh', backgroundColor: '#FBFAF7', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#000000', marginBottom: '32px', fontFamily: 'Times New Roman, serif' }}>Your Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={64} color="#d1d5db" className="cart-empty-icon" />
              <h2 className="cart-empty-title">Your cart is empty</h2>
              <p className="cart-empty-text">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/" className="btn-continue-shopping">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <CartSavingsProgress />
              <div className="cart-layout">
              {/* Cart Items List */}
              <div className="cart-items-container">
                <div className="cart-items-header">
                  <span className="col-product">Product</span>
                  <span className="col-quantity">Quantity</span>
                  <span className="col-total">Total</span>
                </div>
                
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item._id} className="cart-item-row">
                      <div className="cart-item-details">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-info">
                          <Link href={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                          {item.size && <p className="cart-item-size" style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0' }}>Size: {item.size}</p>}
                          <p className="cart-item-price">Rs. {item.price}</p>
                          <button onClick={() => removeFromCart(item._id, item.size)} className="btn-remove-item">Remove</button>
                        </div>
                      </div>
                      <div className="cart-item-controls">
                        <div className="cart-item-quantity">
                          <div className="quantity-control">
                            <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <div className="cart-item-total">
                          Rs. {item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="cart-summary-container">
                <h2 className="cart-summary-title">Order Summary</h2>
                
                <OffersBlock />

                <div className="cart-summary-row">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>Rs. {subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="cart-summary-row" style={{ color: '#10b981' }}>
                    <span>Discount {isFirstOrder ? '(First Order 10%)' : ''}</span>
                    <span>- Rs. {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="cart-summary-divider"></div>
                
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                
                <Link 
                  href={session ? "/checkout" : "/login?callbackUrl=/checkout"} 
                  className="btn-proceed-checkout"
                  onClick={() => {
                    trackEvent('begin_checkout', {
                      currency: 'INR',
                      value: cartTotal,
                      items: cartItems.map((item: any) => ({
                        item_id: item.product,
                        item_name: item.name,
                        price: item.price,
                        quantity: item.qty
                      }))
                    });
                  }}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
            </>
          )}
        </div>
      </main>
      
      
    </>
  );
}
