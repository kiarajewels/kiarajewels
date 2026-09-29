'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  return (
    <header id="main-header">
      <nav id="navbar" className="navbar" style={{ background: '#FBFAF7' }}>
        <Link href="/" className="navbar__brand" id="brand-link" style={{ fontFamily: 'sans-serif', color: '#000', fontWeight: '400', letterSpacing: '4px', textDecoration: 'none' }}>
          KIARA
        </Link>
        <ul className={`navbar__links ${isMenuOpen ? 'open' : ''}`} id="nav-links">
          <li className={`navbar__item navbar__item--dropdown ${isDropdownOpen ? 'open' : ''}`} id="shopby-item">
            <button className="navbar__link navbar__link--dropdown" id="shopby-btn" aria-expanded={isDropdownOpen} aria-haspopup="true" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              Shop By <span className="dropdown-arrow">&#9662;</span>
            </button>
            <ul className="dropdown-menu" id="shopby-dropdown" style={{ display: isDropdownOpen ? 'block' : undefined }}>
              <li><Link href="/rings" className="dropdown-menu__link" onClick={() => setIsMenuOpen(false)}>Rings</Link></li>
              <li><Link href="/earrings" className="dropdown-menu__link" onClick={() => setIsMenuOpen(false)}>Earrings</Link></li>
              <li><Link href="/pendant" className="dropdown-menu__link" onClick={() => setIsMenuOpen(false)}>Pendant</Link></li>
              <li><Link href="/bracelets" className="dropdown-menu__link" onClick={() => setIsMenuOpen(false)}>Bracelets</Link></li>
              <li><Link href="/sets" className="dropdown-menu__link" onClick={() => setIsMenuOpen(false)}>Sets</Link></li>
            </ul>
          </li>
          <li className="navbar__item"><Link href="/gifting" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Gifting</Link></li>
          <li className="navbar__item"><Link href="/about" className="navbar__link" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
          <li className="navbar__item"><Link href="/custom-order" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Custom Order</Link></li>
        </ul>
        <div className="navbar__icons" id="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href={status === 'authenticated' ? "/profile" : "/login"} className="navbar__icon-link" title="Profile">
            <span className="material-symbols-outlined">person</span>
          </Link>

          <Link href="/wishlist" className="navbar__icon-link" id="wishlist-icon" aria-label="Wishlist">
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          
          <Link href="/cart" className="navbar__icon-link" id="cart-icon" aria-label="Cart" style={{ position: 'relative' }}>
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && <span className="cart-badge" id="cart-badge" style={{ display: 'flex' }}>{cartCount}</span>}
          </Link>
          
          <button 
            className={`navbar__hamburger ${isMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
