'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';

export default function GiftingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Fetch live Gifting products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?isGifting=true`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch gifting products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <main id="main-content" style={{ backgroundColor: '#FBFAF7', minHeight: '100vh' }}>
        <section className="best-seller" style={{ paddingTop: '120px', backgroundColor: 'transparent' }}>
          <p className="best-seller__heading" style={{ fontSize: '2.5rem', fontFamily: 'sans-serif',marginBottom: '10px' }}>Gifts</p>
          <p style={{ textAlign: 'center', marginBottom: '40px', fontFamily: 'sans-serif', color: '#000000ff' }}>Curated selections perfect for any occasion.</p>

          <div className="best-seller__grid">
            {loading ? (
              <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', color: '#6b7280' }}>
                <p>Loading...</p>
              </div>
            ) : products.length > 0 ? (
              products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', color: '#6b7280' }}>
                <p style={{ fontSize: '1.5rem' }}>New designs arriving soon</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {products.length > itemsPerPage && (
            <div className="pagination">
              {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination__btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
