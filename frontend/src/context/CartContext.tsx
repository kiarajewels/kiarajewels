'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { OFFERS_CONFIG } from '@/config/offers';

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number, size?: string) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  cartTotal: number;
  isFirstOrder: boolean;
  showConfetti: boolean;
  confettiMessage: string;
  setShowConfetti: (val: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<{id: string, quantity: number, size?: string}[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { data: session, status } = useSession();

  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiMessage, setConfettiMessage] = useState('');
  
  // Track previous subtotal to know when we CROSS the threshold
  const prevSubtotalRef = useRef(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setIsClient(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    
    const saved = localStorage.getItem('cartData');
    if (saved) {
      setCartData(JSON.parse(saved));
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
      
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch first order status if logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/check-first-order?email=${session.user.email}`)
        .then(res => setIsFirstOrder(res.data.isFirstOrder))
        .catch(err => console.error(err));
    } else {
      setIsFirstOrder(false); // Guest assume not first order until checkout, or assume true? The requirement said "first time buyer gets 10%". If they aren't logged in, they can't checkout anyway.
    }
  }, [status, session]);

  // Sync to local storage and DB
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cartData', JSON.stringify(cartData));
      if (status === 'authenticated' && session?.user?.email) {
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.email}/sync`, { cart: cartData })
          .catch(err => console.error("Failed to sync cart", err));
      }
    }
  }, [cartData, isClient, status, session]);

  const addToCart = (product: any, quantity = 1, size?: string) => {
    setCartData(prev => {
      const existing = prev.find(item => item.id === product._id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: product._id, quantity, size }];
    });
  };

  const removeFromCart = (id: string, size?: string) => setCartData(prev => prev.filter(item => !(item.id === id && item.size === size)));
  
  const updateQuantity = (id: string, size: string | undefined, quantity: number) => {
    if (quantity < 1) return;
    setCartData(prev => prev.map(item => (item.id === id && item.size === size) ? { ...item, quantity } : item));
  };

  const clearCart = () => setCartData([]);

  const cartItems: CartItem[] = cartData.map(cData => {
    const p = products.find(prod => prod._id === cData.id);
    if (!p) return null;
    return {
      _id: p._id,
      name: p.name,
      price: p.price,
      image: p.media && p.media.length > 0 ? p.media[0].url : '/images/placeholder.png',
      quantity: cData.quantity,
      size: cData.size
    };
  }).filter(Boolean) as CartItem[];

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Confetti Logic: Check if we crossed a threshold
  useEffect(() => {
    const prev = prevSubtotalRef.current;
    
    // Sort tiers ascending by minSpend to check threshold crossing
    const sortedTiers = [...OFFERS_CONFIG.tiers].sort((a, b) => a.minSpend - b.minSpend);
    
    for (const tier of sortedTiers) {
      if (prev < tier.minSpend && subtotal >= tier.minSpend && !isFirstOrder) {
        setConfettiMessage(`Amazing! You unlocked a ${tier.discountPercent}% discount!`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
    
    prevSubtotalRef.current = subtotal;
  }, [subtotal, isFirstOrder]);

  // Calculate Discount
  let discountPercentage = 0;
  
  if (isFirstOrder) {
    discountPercentage = OFFERS_CONFIG.firstOrder.discountPercent / 100;
  } else {
    // Find the highest applicable tier
    const applicableTiers = OFFERS_CONFIG.tiers.filter((t: any) => subtotal >= t.minSpend);
    if (applicableTiers.length > 0) {
      const bestTier = applicableTiers.reduce((prev: any, current: any) => (prev.discountPercent > current.discountPercent) ? prev : current);
      discountPercentage = bestTier.discountPercent / 100;
    }
  }

  const discountAmount = subtotal * discountPercentage;
  const cartTotal = subtotal - discountAmount;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal, discountAmount, cartTotal, isFirstOrder, showConfetti, setShowConfetti, confettiMessage }}>
      {children}
      
      {showConfetti && isClient && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}>
          <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />
          
          <div style={{ 
            position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'white', padding: '24px 40px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            textAlign: 'center', border: '2px solid #000'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#27302E', fontFamily: 'Times New Roman, serif' }}>Yay! 🎉</h2>
            <p style={{ margin: '12px 0 0', fontSize: '1.1rem', color: '#4b5563', fontWeight: '500' }}>{confettiMessage}</p>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
