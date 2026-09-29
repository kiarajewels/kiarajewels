'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface WishlistContextType {
  wishlistItems: any[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('wishlistIds');
    localStorage.removeItem('wishlistItems');
    if (saved) {
      setWishlistIds(JSON.parse(saved));
    }
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Sync to local storage and DB
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('wishlistIds', JSON.stringify(wishlistIds));
      if (status === 'authenticated' && session?.user?.email) {
        axios.put(`http://localhost:5000/api/users/${session.user.email}/sync`, { wishlist: wishlistIds })
          .catch(err => console.error("Failed to sync wishlist", err));
      }
    }
  }, [wishlistIds, isClient, status, session]);

  const toggleWishlist = (product: any) => {
    setWishlistIds(prev => {
      if (prev.includes(product._id)) {
        return prev.filter(id => id !== product._id);
      }
      return [...prev, product._id];
    });
  };

  const isInWishlist = (id: string) => {
    return wishlistIds.includes(id);
  };

  const wishlistItems = products.filter(p => wishlistIds.includes(p._id));

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
