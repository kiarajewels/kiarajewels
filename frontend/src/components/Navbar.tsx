'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import HeaderSearch from '@/components/HeaderSearch';

export default function Navbar() {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHome = pathname === '/';
  // On mobile, if the menu is open, it usually has a solid background, so we force black text
  const navColor = (isHome && !isMenuOpen) ? '#FFFFFF' : 'var(--pure-black)';
  const iconColor = isHome ? '#FFFFFF' : 'var(--pure-black)';
  
  return (
    <header id="main-header" style={{ position: 'relative', zIndex: 100 }}>
      <nav id="navbar" className="navbar" style={{ background: isHome ? 'transparent' : 'var(--off-white)', borderBottom: isHome ? 'none' : undefined }}>
        <Link href="/" className="navbar__brand" id="brand-link" aria-label="Kiara Jewels Home" style={{ color: navColor }}>
          <Logo width={100} height={45} />
        </Link>
        <ul className={`navbar__links ${isMenuOpen ? 'open' : ''}`} id="nav-links">
          <li className="navbar__item"><Link href="/all" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>SHOP</Link></li>
          <li className="navbar__item"><Link href="/rings" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>RINGS</Link></li>
          <li className="navbar__item"><Link href="/earrings" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>EARRINGS</Link></li>
          <li className="navbar__item"><Link href="/pendants" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>PENDANTS</Link></li>
          <li className="navbar__item"><Link href="/bracelets" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>BRACELETS</Link></li>
          <li className="navbar__item"><Link href="/sets" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>SETS</Link></li>
          <li className="navbar__item"><Link href="/gifting" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>GIFTING</Link></li>
          <li className="navbar__item"><Link href="/about" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>ABOUT</Link></li>
          <li className="navbar__item"><Link href="/custom-order" className="navbar__link" style={{ color: navColor }} onClick={() => setIsMenuOpen(false)}>CUSTOM</Link></li>
        </ul>
        <div className="navbar__icons" id="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          <HeaderSearch isHome={isHome} />
          
          <Link href={status === 'authenticated' ? "/profile" : "/login"} className="navbar__icon-link" title="Profile">
            <User size={22} strokeWidth={1.5} color={iconColor} />
          </Link>

          <Link href="/wishlist" className="navbar__icon-link" id="wishlist-icon" aria-label="Wishlist">
            <Heart size={22} strokeWidth={1.5} color={iconColor} />
          </Link>
          
          <Link href="/cart" className="navbar__icon-link" id="cart-icon" aria-label="Cart" style={{ position: 'relative' }}>
            <ShoppingBag size={22} strokeWidth={1.5} color={iconColor} />
            {cartCount > 0 && <span className="cart-badge" id="cart-badge" style={{ display: 'flex' }}>{cartCount}</span>}
          </Link>
          
          <button 
            className="navbar__hamburger" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', alignItems: 'center' }}
          >
            {isMenuOpen ? <X size={24} color={iconColor} /> : <Menu size={24} color={iconColor} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
