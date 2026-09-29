'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useParams } from 'next/navigation';
import FAQSection from '@/components/FAQSection';
import ProductOfferBox from '@/components/ProductOfferBox';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainMedia, setMainMedia] = useState<any>({ url: '/images/placeholder.png', type: 'image' });
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  
  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };
  
  const { addToCart, cartCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        if (res.data.media && res.data.media.length > 0) {
          setMainMedia(res.data.media[0]);
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
            <div className="product-main-image">
              {mainMedia.type === 'video' ? (
                <video src={mainMedia.url} controls className="product-main-media-item" />
              ) : (
                <img src={mainMedia.url} alt={product.name} className="product-main-media-item" />
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
              <span style={{ color: '#000000', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
              <h1 className="product-title">{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>★★★★★</span>
                <span style={{ color: '#4b5563', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer' }}>12 Reviews</span>
              </div>
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
                <span className="material-symbols-outlined" style={{ color: '#27302E', fontSize: '1.2rem' }}>diamond</span>
                <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '500' }}>925 Silver</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ color: '#27302E', fontSize: '1.2rem' }}>water_drop</span>
                <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '500' }}>Tarnish Free</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ color: '#27302E', fontSize: '1.2rem' }}>local_shipping</span>
                <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '500' }}>Free Ship</span>
              </div>
            </div>

            {product?.category?.toLowerCase() === 'rings' && (
              <div style={{ marginBottom: '24px' }}>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FBFAF7', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', fontSize: '0.95rem', color: '#27302E', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = '#000')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                >
                  <span style={{ fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Find Your Ring Size</span>
                </button>
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

            <ProductOfferBox />

            <div className="product-actions">
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => {
                    addToCart(product, quantity);
                  }}
                  disabled={product.countInStock < 1}
                  className="btn-add-cart"
                  style={{ opacity: product.countInStock < 1 ? 0.5 : 1 }}
                >
                  ADD TO CART
                </button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  style={{ 
                    width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer',
                    color: inWishlist ? '#000000' : '#9ca3af', transition: 'all 0.2s'
                  }}
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
              </div>
              
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  window.location.href = '/checkout';
                }}
                disabled={product.countInStock < 1}
                className="btn-buy-now"
                style={{ opacity: product.countInStock < 1 ? 0.5 : 1 }}
              >
                BUY IT NOW
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#4b5563', marginBottom: '32px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }}>local_shipping</span>
              Free Delivery across India.
            </p>

            {/* Accordions */}
            <div style={{ borderTop: '1px solid #e5e7eb' }}>
              <div style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button 
                  onClick={() => toggleAccordion('desc')}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 'bold', color: '#27302E', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', alignItems: 'center' }}
                >
                  Product Description
                  <span className="material-symbols-outlined" style={{ transform: openAccordion === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>expand_more</span>
                </button>
                <div style={{ display: 'grid', gridTemplateRows: openAccordion === 'desc' ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ paddingBottom: '16px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>{product.description}</p>
                  </div>
                </div>
              </div>
              
              <div style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button 
                  onClick={() => toggleAccordion('care')}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 'bold', color: '#27302E', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', alignItems: 'center' }}
                >
                  Jewellery Care
                  <span className="material-symbols-outlined" style={{ transform: openAccordion === 'care' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>expand_more</span>
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
                  <span className="material-symbols-outlined" style={{ transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>expand_more</span>
                </button>
                <div style={{ display: 'grid', gridTemplateRows: openAccordion === 'shipping' ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ paddingBottom: '16px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                      Free shipping across India. Delivery takes approximately 7 days. Returns are accepted within 2 days of delivery subject to inspection.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      {/* Ring Size Guide Modal */}
      {isSizeGuideOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563', transition: 'all 0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#e5e7eb')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div style={{ padding: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontFamily: '"Abyssinica SIL", serif', fontSize: '2rem', color: '#27302E', marginBottom: '8px' }}>💍 Find Your Ring Size</h2>
                <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>Not sure about your ring size? Find your perfect fit in just a few easy steps.</p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '48px' }}>
                {/* Method 1 */}
                <div style={{ flex: '1 1 300px', backgroundColor: '#FBFAF7', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27302E', marginBottom: '16px', borderBottom: '1px solid #d1d5db', paddingBottom: '12px' }}>Method 1: Measure Your Finger</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
                    <div style={{ fontSize: '2.5rem' }}>👇</div>
                    <div style={{ fontSize: '1.5rem', color: '#9ca3af' }}>➔</div>
                    <div style={{ fontSize: '2.5rem' }}>🧵</div>
                    <div style={{ fontSize: '1.5rem', color: '#9ca3af' }}>➔</div>
                    <div style={{ fontSize: '2.5rem' }}>📏</div>
                  </div>
                  <ol style={{ paddingLeft: '20px', color: '#4b5563', lineHeight: '1.7', margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>Take a thin strip of paper or a piece of thread.</li>
                    <li style={{ marginBottom: '8px' }}>Wrap it around the finger where you want to wear the ring.</li>
                    <li style={{ marginBottom: '8px' }}>Make a small mark where the paper or thread meets.</li>
                    <li style={{ marginBottom: '8px' }}>Lay it flat and measure the length with a ruler in millimetres (mm).</li>
                    <li>Use the measurement to find your ring size in the size chart below.</li>
                  </ol>
                </div>

                {/* Method 2 */}
                <div style={{ flex: '1 1 300px', backgroundColor: '#FBFAF7', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27302E', marginBottom: '16px', borderBottom: '1px solid #d1d5db', paddingBottom: '12px' }}>Method 2: Measure Your Existing Ring</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
                    <div style={{ fontSize: '2.5rem' }}>💍</div>
                    <div style={{ fontSize: '1.5rem', color: '#9ca3af' }}>➔</div>
                    <div style={{ fontSize: '2.5rem' }}>📏</div>
                  </div>
                  <ol style={{ paddingLeft: '20px', color: '#4b5563', lineHeight: '1.7', margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>Take a ring that already fits you well.</li>
                    <li style={{ marginBottom: '8px' }}>Place it on a flat surface.</li>
                    <li style={{ marginBottom: '8px' }}>Measure the inside width of the ring from one inner edge to the other.</li>
                    <li style={{ marginBottom: '8px' }}>Measure in millimetres (mm).</li>
                    <li>Use the measurement to find your ring size in the size chart below.</li>
                  </ol>
                </div>
              </div>

              {/* Size Chart */}
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#27302E', marginBottom: '16px', textAlign: 'center' }}>Indian Ring Size Chart</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                        <th style={{ padding: '12px 16px', color: '#374151', fontWeight: 'bold' }}>Indian Size</th>
                        <th style={{ padding: '12px 16px', color: '#374151', fontWeight: 'bold' }}>Inside Diameter (mm)</th>
                        <th style={{ padding: '12px 16px', color: '#374151', fontWeight: 'bold' }}>Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: 5, dia: 14.3, circ: 45 },
                        { size: 6, dia: 14.6, circ: 46 },
                        { size: 7, dia: 14.9, circ: 47 },
                        { size: 8, dia: 15.3, circ: 48 },
                        { size: 9, dia: 15.6, circ: 49 },
                        { size: 10, dia: 15.9, circ: 50 },
                        { size: 11, dia: 16.2, circ: 51 },
                        { size: 12, dia: 16.5, circ: 52 },
                        { size: 13, dia: 16.8, circ: 53 },
                        { size: 14, dia: 17.1, circ: 54 },
                        { size: 15, dia: 17.5, circ: 55 },
                        { size: 16, dia: 17.8, circ: 56 },
                        { size: 17, dia: 18.1, circ: 57 },
                        { size: 18, dia: 18.4, circ: 58 },
                        { size: 19, dia: 18.7, circ: 59 },
                        { size: 20, dia: 19.1, circ: 60 },
                        { size: 21, dia: 19.4, circ: 61 },
                        { size: 22, dia: 19.7, circ: 62 },
                        { size: 23, dia: 20.0, circ: 63 },
                        { size: 24, dia: 20.3, circ: 64 },
                        { size: 25, dia: 20.6, circ: 65 }
                      ].map((row, i) => (
                        <tr key={row.size} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: i % 2 === 0 ? '#ffffff' : '#FBFAF7' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 'bold', color: '#27302E' }}>{row.size}</td>
                          <td style={{ padding: '10px 16px', color: '#4b5563' }}>{row.dia}</td>
                          <td style={{ padding: '10px 16px', color: '#4b5563' }}>{row.circ}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginTop: '32px', backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '16px 20px', borderRadius: '4px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e3a8a', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}><strong>Tip:</strong> Measure your finger at the end of the day when your fingers are at their normal size.</li>
                  <li style={{ marginBottom: '8px' }}>If you are between two sizes, choose the <strong>larger size</strong>.</li>
                  <li>For the best fit, measure 2–3 times.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
      <FAQSection />
    </>
  );
}
