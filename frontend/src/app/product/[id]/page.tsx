'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useParams, useSearchParams } from 'next/navigation';
import FAQSection from '@/components/FAQSection';
import ProductOfferBox from '@/components/ProductOfferBox';
import { Diamond, Droplets, Truck, Heart, ChevronDown, X } from 'lucide-react';
import { trackEvent } from '@/components/Analytics';
import { Suspense } from 'react';

function ProductDetailsContent() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainMedia, setMainMedia] = useState<any>({ url: '/images/placeholder.png', type: 'image' });
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  
  const searchParams = useSearchParams();
  const [showReviewForm, setShowReviewForm] = useState(searchParams.get('review') === 'true');
  const [newReview, setNewReview] = useState({ 
    customerName: '', 
    rating: 5, 
    title: '', 
    body: '',
    order: searchParams.get('order') || ''
  });
  const [reviewSubmitStatus, setReviewSubmitStatus] = useState<string | null>(null);
  
  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };
  
  const { addToCart, cartCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
        setProduct(res.data);
        if (res.data.media && res.data.media.length > 0) {
          setMainMedia(res.data.media[0]);
        }
        
        trackEvent('view_item', {
          currency: 'INR',
          value: res.data.price,
          items: [{
            item_id: res.data._id,
            item_name: res.data.name,
            affiliation: 'Kiara Jewels',
            item_category: res.data.category,
            price: res.data.price
          }]
        });

        // Fetch related products
        if (res.data.category) {
          try {
            const relRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${encodeURIComponent(res.data.category)}`);
            setRelatedProducts(relRes.data.filter((p: any) => p._id !== id).slice(0, 4));
          } catch (err) {
            console.error('Failed to fetch related products', err);
          }
        }
        
        // Fetch reviews
        try {
          const reviewRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${id}`);
          setReviews(reviewRes.data.reviews || []);
          setReviewStats({
            averageRating: reviewRes.data.averageRating || 0,
            totalReviews: reviewRes.data.totalReviews || 0
          });
        } catch (err) {
          console.error('Failed to fetch reviews', err);
        }
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.customerName || !newReview.body) return;
    
    setReviewSubmitStatus('submitting');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        ...newReview,
        product: id
      });
      setReviewSubmitStatus('success');
      setNewReview({ customerName: '', rating: 5, title: '', body: '', order: searchParams.get('order') || '' });
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSubmitStatus(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to submit review', err);
      setReviewSubmitStatus('error');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBFAF7' }}>
        <p style={{ color: '#000000', fontSize: '1.25rem' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBFAF7' }}>
        <p style={{ color: '#000000', fontSize: '1.25rem' }}>Product not found.</p>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

  return (
    <>
      

      <main style={{ paddingTop: '120px', minHeight: '80vh', backgroundColor: '#FBFAF7', paddingBottom: '80px', overflowX: 'hidden' }}>
        <div className="product-details-container">
          
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="product-main-image" style={{ overflow: 'hidden', cursor: 'zoom-in' }}>
              {mainMedia.type === 'video' ? (
                <video src={mainMedia.url} controls className="product-main-media-item" />
              ) : (
                <img 
                  src={mainMedia.url} 
                  alt={product.name} 
                  className="product-main-media-item" 
                  style={{ transition: 'transform 0.4s ease' }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.5)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseMove={(e) => {
                    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - left) / width) * 100;
                    const y = ((e.clientY - top) / height) * 100;
                    e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                  }}
                />
              )}
            </div>
            
            {product.media && product.media.length > 1 && (
              <div className="product-thumbnails">
                {product.media.map((mediaItem: any, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainMedia(mediaItem)}
                    style={{ 
                      width: '80px', height: '80px', flexShrink: 0, 
                      border: mainMedia.url === mediaItem.url ? '2px solid #000000' : '1px solid #e5e7eb',
                      borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', cursor: 'pointer'
                    }}
                  >
                    {mediaItem.type === 'video' ? (
                      <video src={mediaItem.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={mediaItem.url} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#000000', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
                {reviewStats.totalReviews > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.9rem' }}>
                    <span>★</span>
                    <span style={{ fontWeight: 'bold', color: '#374151' }}>{reviewStats.averageRating}</span>
                    <span style={{ color: '#6b7280' }}>({reviewStats.totalReviews})</span>
                  </div>
                )}
              </div>
              <h1 className="product-title">{product.name}</h1>

              <div className="product-price" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>Rs. {product.price}</span>
                {product.originalPrice > product.price && (
                  <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.85em' }}>
                    Rs. {product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Trust Icons */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Diamond size={18} strokeWidth={1.5} color="var(--ink)" />
                <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '500' }}>925 Silver</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Droplets size={18} strokeWidth={1.5} color="var(--ink)" />
                <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '500' }}>Anti-tarnish coating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={18} strokeWidth={1.5} color="var(--ink)" />
                <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '500' }}>Free shipping</span>
              </div>
            </div>

            {product?.category?.toLowerCase() === 'rings' && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#374151' }}>RING SIZE (Indian) *</label>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    style={{ background: 'none', border: 'none', color: '#4b5563', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Size Guide
                  </button>
                </div>
                <select 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', fontSize: '1rem', outline: 'none' }}
                >
                  <option value="" disabled>Select your size</option>
                  {[...Array(21)].map((_, i) => (
                    <option key={i+5} value={i+5}>{i+5}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>QUANTITY</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', width: 'fit-content', backgroundColor: 'white' }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '12px 16px', fontSize: '1.2rem', color: '#374151', borderRight: '1px solid #d1d5db', cursor: 'pointer', background: 'transparent', borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
                >-</button>
                <span style={{ padding: '0 20px', fontSize: '1.1rem', fontWeight: '500', color: '#27302E' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '12px 16px', fontSize: '1.2rem', color: '#374151', borderLeft: '1px solid #d1d5db', cursor: 'pointer', background: 'transparent', borderTop: 'none', borderBottom: 'none', borderRight: 'none' }}
                >+</button>
              </div>
              <p style={{ marginTop: '8px', fontSize: '0.875rem', color: product.countInStock > 0 ? '#10b981' : '#ef4444' }}>
                {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
              </p>
            </div>

            {/* Pincode Checker */}
            <div style={{ marginBottom: '32px', backgroundColor: '#FBFAF7', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#27302E', marginBottom: '12px' }}>
                <Truck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> 
                CHECK DELIVERY ESTIMATE
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter 6 digit pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }}
                />
                <button 
                  onClick={() => {
                    if (pincode.length === 6) {
                      setDeliveryEstimate("Estimated delivery in 7 days (4 days to make + 3 days shipping)");
                    } else {
                      setDeliveryEstimate("Please enter a valid 6-digit pincode");
                    }
                  }}
                  style={{ backgroundColor: '#27302E', color: 'white', border: 'none', borderRadius: '6px', padding: '0 24px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Check
                </button>
              </div>
              {deliveryEstimate && (
                <p style={{ marginTop: '12px', fontSize: '0.9rem', color: deliveryEstimate.includes('7 days') ? '#10b981' : '#ef4444' }}>
                  {deliveryEstimate}
                </p>
              )}
            </div>

            <ProductOfferBox />

            <div className="product-actions">
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => {
                    if (product?.category?.toLowerCase() === 'rings' && !selectedSize) {
                      alert('Please select a ring size before adding to cart.');
                      return;
                    }
                    addToCart(product, quantity, selectedSize);
                    trackEvent('add_to_cart', {
                      currency: 'INR',
                      value: product.price * quantity,
                      items: [{
                        item_id: product._id,
                        item_name: product.name,
                        affiliation: 'Kiara Jewels',
                        item_category: product.category,
                        price: product.price,
                        quantity: quantity
                      }]
                    });
                  }}
                  disabled={product.countInStock < 1}
                  className="btn-add-cart"
                  style={{ opacity: product.countInStock < 1 ? 0.5 : 1 }}
                >
                  ADD TO CART
                </button>
                <button 
                  onClick={() => {
                    toggleWishlist(product);
                    if (!inWishlist) {
                      trackEvent('add_to_wishlist', {
                        currency: 'INR',
                        value: product.price,
                        items: [{ item_id: product._id, item_name: product.name, item_category: product.category }]
                      });
                    }
                  }}
                  style={{ 
                    width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer',
                    color: inWishlist ? '#000000' : '#9ca3af', transition: 'all 0.2s'
                  }}
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={22} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  if (product?.category?.toLowerCase() === 'rings' && !selectedSize) {
                    alert('Please select a ring size before purchasing.');
                    return;
                  }
                  addToCart(product, quantity, selectedSize);
                  trackEvent('add_to_cart', {
                    currency: 'INR',
                    value: product.price * quantity,
                    items: [{
                      item_id: product._id,
                      item_name: product.name,
                      affiliation: 'Kiara Jewels',
                      item_category: product.category,
                      price: product.price,
                      quantity: quantity
                    }]
                  });
                  window.location.href = '/checkout';
                }}
                disabled={product.countInStock < 1}
                className="btn-buy-now"
                style={{ opacity: product.countInStock < 1 ? 0.5 : 1 }}
              >
                BUY IT NOW
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#4b5563', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Truck size={16} strokeWidth={1.5} />
              Free shipping across India.
            </p>

            {/* Accordions */}
            <div style={{ borderTop: '1px solid #e5e7eb' }}>
              <div style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button 
                  onClick={() => toggleAccordion('desc')}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 'bold', color: '#27302E', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', alignItems: 'center' }}
                >
                  Product Details
                  <ChevronDown size={20} style={{ transform: openAccordion === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                </button>
                <div style={{ display: 'grid', gridTemplateRows: openAccordion === 'desc' ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ paddingBottom: '12px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>{product.description}</p>
                    <ul style={{ paddingBottom: '16px', color: '#4b5563', lineHeight: '1.6', paddingLeft: '20px', margin: 0 }}>
                      <li><strong>Material:</strong> 925 Sterling Silver</li>
                      <li><strong>Stones:</strong> Premium Cubic Zirconia (CZ)</li>
                      <li><strong>Finish:</strong> Rhodium plated with anti-tarnish coating</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button 
                  onClick={() => toggleAccordion('care')}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 'bold', color: '#27302E', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', alignItems: 'center' }}
                >
                  Jewellery Care
                  <ChevronDown size={20} style={{ transform: openAccordion === 'care' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                </button>
                <div style={{ display: 'grid', gridTemplateRows: openAccordion === 'care' ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <ul style={{ paddingBottom: '16px', color: '#4b5563', lineHeight: '1.6', paddingLeft: '20px', margin: 0 }}>
                      <li>Store in a cool, dry place inside a ziplock pouch.</li>
                      <li>Avoid direct contact with perfumes and lotions.</li>
                      <li>Wipe with a soft cloth after use.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 'bold', color: '#27302E', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', alignItems: 'center' }}
                >
                  Shipping & Returns
                  <ChevronDown size={20} style={{ transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                </button>
                <div style={{ display: 'grid', gridTemplateRows: openAccordion === 'shipping' ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <ul style={{ paddingBottom: '16px', color: '#4b5563', lineHeight: '1.6', paddingLeft: '20px', margin: 0 }}>
                      <li>Free shipping across India. Delivery takes approximately 7 days.</li>
                      <li>Returns accepted within 3 days of delivery (subject to inspection).</li>
                      <li>No exchanges.</li>
                      <li>Custom-designed pieces are non-returnable unless defective.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* End Accordions */}
            
            {/* Reviews Section */}
            <div style={{ marginTop: '48px', borderTop: '1px solid #e5e7eb', paddingTop: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'Times New Roman, serif', color: '#27302E' }}>Customer Reviews</h2>
                {!showReviewForm && (
                  <button 
                    onClick={() => setShowReviewForm(true)}
                    style={{ background: 'none', border: '1px solid #27302E', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Write your review</h3>
                  {reviewSubmitStatus === 'success' && <p style={{ color: '#10b981', marginBottom: '16px' }}>Review submitted successfully! It will appear once approved.</p>}
                  {reviewSubmitStatus === 'error' && <p style={{ color: '#ef4444', marginBottom: '16px' }}>Failed to submit review. Please try again.</p>}
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name *</label>
                    <input 
                      type="text" 
                      value={newReview.customerName}
                      onChange={(e) => setNewReview({...newReview, customerName: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Rating *</label>
                    <select 
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title (optional)</label>
                    <input 
                      type="text" 
                      value={newReview.title}
                      onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Review *</label>
                    <textarea 
                      value={newReview.body}
                      onChange={(e) => setNewReview({...newReview, body: e.target.value})}
                      required
                      rows={4}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      type="submit" 
                      disabled={reviewSubmitStatus === 'submitting'}
                      style={{ backgroundColor: '#27302E', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {reviewSubmitStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowReviewForm(false)}
                      style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>No reviews yet.</p>
                  {!showReviewForm && (
                    <button onClick={() => setShowReviewForm(true)} style={{ background: 'none', border: 'none', color: '#27302E', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>
                      Be the first to review
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {reviews.map(review => (
                    <div key={review._id} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {review.customerName} 
                            {review.verifiedPurchase && <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>Verified</span>}
                          </p>
                          <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginTop: '4px' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && <h4 style={{ margin: '8px 0', fontSize: '1.05rem' }}>{review.title}</h4>}
                      <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ maxWidth: '1200px', margin: '80px auto 0', padding: '0 24px' }}>
            <h2 style={{ fontSize: '2rem', fontFamily: 'Times New Roman, serif', color: '#27302E', marginBottom: '32px', textAlign: 'center' }}>You May Also Like</h2>
            <div className="best-seller__grid">
              {relatedProducts.map(p => {
                const ProductCard = require('@/components/ProductCard').default;
                return <ProductCard key={p._id} product={p} />;
              })}
            </div>
          </div>
        )}
      </main>
      
      {/* Ring Size Guide Modal */}
      {isSizeGuideOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563', transition: 'all 0.2s', zIndex: 10 }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#e5e7eb')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            >
              <X size={20} />
            </button>

            <div style={{ padding: '0', display: 'flex', justifyContent: 'center' }}>
              <img 
                src="/size-guide/ring-size-guide.jpg" 
                alt="Ring Size Guide" 
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="%23f3f4f6" width="800" height="600"/><text fill="%239ca3af" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">TODO: Drop ring-size-guide.jpg into /public/size-guide/</text></svg>';
                }}
              />
            </div>
          </div>
        </div>
      )}
      <FAQSection />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.kiarajewels.co/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": product.category || "Jewellery",
            "item": `https://www.kiarajewels.co/${product.category?.toLowerCase() || ''}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.name,
            "item": `https://www.kiarajewels.co/product/${product._id}`
          }
        ]
      }) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.media?.map((m: any) => m.url) || [],
            "description": product.description,
            "offers": {
              "@type": "Offer",
              "url": `https://kiarajewels.co/product/${product._id}`,
              "priceCurrency": "INR",
              "price": product.price,
              "availability": product.countInStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
            ...(reviewStats.totalReviews > 0 ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": reviewStats.averageRating,
                "reviewCount": reviewStats.totalReviews
              },
              "review": reviews.map(r => ({
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": r.rating,
                  "bestRating": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": r.customerName
                },
                "reviewBody": r.body
              }))
            } : {})
          })
        }}
      />
    </>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}
