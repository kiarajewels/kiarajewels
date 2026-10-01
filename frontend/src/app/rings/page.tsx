'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function RingsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const { cartCount } = useCart();

  // Fetch live Rings from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?category=Rings`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch rings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      

      {/* ===== MAIN CONTENT ===== */}
      <main id="main-content" style={{ backgroundColor: '#FBFAF7', minHeight: '100vh' }}>
        <section className="best-seller" style={{ paddingTop: '120px', backgroundColor: 'transparent' }}>
          <p className="best-seller__heading" style={{ fontSize: '2.5rem', fontFamily: 'sans-serif',marginBottom: '10px' }}>All Rings</p>
          <br></br>
          <div className="best-seller__grid">
            {loading ? (
              <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', color: '#000000ff' }}>
                <p>Loading...</p>
              </div>
            ) : products.length > 0 ? (
              products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', color: '#000000ff' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 400 }}>New designs arriving soon</h2>
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
