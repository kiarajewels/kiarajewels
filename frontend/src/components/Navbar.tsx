'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Navbar() {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header id="main-header">
      <nav id="navbar" className="navbar" style={{ background: 'var(--ivory)' }}>
        <Link href="/" className="navbar__brand" id="brand-link" aria-label="Kiara Jewels Home">
          <Logo width={100} height={45} />
        </Link>
        <ul className={`navbar__links ${isMenuOpen ? 'open' : ''}`} id="nav-links">
          <li className="navbar__item"><Link href="/rings" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Rings</Link></li>
          <li className="navbar__item"><Link href="/earrings" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Earrings</Link></li>
          <li className="navbar__item"><Link href="/necklaces" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Necklaces</Link></li>
          <li className="navbar__item"><Link href="/bracelets" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Bracelets</Link></li>
          <li className="navbar__item"><Link href="/sets" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Sets</Link></li>
          <li className="navbar__item"><Link href="/gifting" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Gifting</Link></li>
          <li className="navbar__item"><Link href="/custom-order" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Custom Order</Link></li>
          <li className="navbar__item"><Link href="/about" className="navbar__link" onClick={() => setIsMenuOpen(false)}>About</Link></li>
        </ul>
        <div className="navbar__icons" id="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="navbar__icon-link" aria-label="Search" onClick={() => { /* phase 3 */ }}>
            <Search size={22} strokeWidth={1.5} color="var(--ink)" />
          </button>
          
          <Link href={status === 'authenticated' ? "/profile" : "/login"} className="navbar__icon-link" title="Profile">
            <User size={22} strokeWidth={1.5} color="var(--ink)" />
          </Link>

          <Link href="/wishlist" className="navbar__icon-link" id="wishlist-icon" aria-label="Wishlist">
            <Heart size={22} strokeWidth={1.5} color="var(--ink)" />
          </Link>
          
          <Link href="/cart" className="navbar__icon-link" id="cart-icon" aria-label="Cart" style={{ position: 'relative' }}>
            <ShoppingBag size={22} strokeWidth={1.5} color="var(--ink)" />
            {cartCount > 0 && <span className="cart-badge" id="cart-badge" style={{ display: 'flex' }}>{cartCount}</span>}
          </Link>
          
          <button 
            className="navbar__hamburger" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }}
          >
            {isMenuOpen ? <X size={24} color="var(--ink)" /> : <Menu size={24} color="var(--ink)" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
