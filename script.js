/* ============================================================
   JEWELS PALACE — Main Script
   Hero auto-scroll carousel  |  Navbar interactions
   ============================================================ */

(function () {
  'use strict';

  // ─── HERO CAROUSEL ─────────────────────────────────────────
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  let currentSlide = 0;
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 4500; // ms

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Arrow clicks
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay(); // restart timer after manual nav
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  // Dot clicks
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.slide, 10);
      goToSlide(target);
      startAutoplay();
    });
  });

  // Pause on hover
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }

  // Swipe support (touch)
  let touchStartX = 0;
  let touchEndX = 0;

  if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        startAutoplay();
      }
    }, { passive: true });
  }

  // Start autoplay
  startAutoplay();

  // ─── NAVBAR SCROLL EFFECT ──────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ─── MOBILE MENU ──────────────────────────────────────────
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.navbar__link:not(.navbar__link--dropdown)').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ─── MOBILE DROPDOWN TOGGLE ────────────────────────────────
  const shopByItem = document.getElementById('shopby-item');
  const shopByBtn = document.getElementById('shopby-btn');

  if (shopByBtn && shopByItem) {
    shopByBtn.addEventListener('click', (e) => {
      // On mobile, toggle the dropdown
      if (window.innerWidth <= 900) {
        e.preventDefault();
        shopByItem.classList.toggle('open');
        const expanded = shopByBtn.getAttribute('aria-expanded') === 'true';
        shopByBtn.setAttribute('aria-expanded', String(!expanded));
      }
    });
  }

  // Close dropdown on outside click (desktop)
  document.addEventListener('click', (e) => {
    if (shopByItem && !shopByItem.contains(e.target)) {
      shopByItem.classList.remove('open');
      if (shopByBtn) shopByBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // ─── CART FUNCTIONALITY ────────────────────────────────────
  const cartBadge = document.getElementById('cart-badge');
  
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('jewels_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    // Also dispatch event for other pages to update if needed
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  // Add to cart buttons
  const addToCartBtns = document.querySelectorAll('.product-card__btn');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent jump to top if any
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');
      
      let cart = JSON.parse(localStorage.getItem('jewels_cart')) || [];
      
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, img, quantity: 1 });
      }
      
      localStorage.setItem('jewels_cart', JSON.stringify(cart));
      updateCartBadge();
      
      const originalText = btn.textContent;
      btn.textContent = 'Added to Cart!';
      btn.style.backgroundColor = '#d84b76';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
      }, 1500);
    });
  });

  // Initialize badge
  updateCartBadge();

  // ─── FAQ FUNCTIONALITY ──────────────────────────────────────
  const faqQuestions = document.querySelectorAll('.faq__question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq__item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

})();
