'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { Search as SearchIcon } from 'lucide-react';
import ProductSkeletonGrid from '@/components/ProductSkeletonGrid';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?q=${encodeURIComponent(q)}`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch search results', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (q) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [q]);

  return (
    <main style={{ backgroundColor: '#F7F7F5', minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Times New Roman, serif', marginBottom: '8px', color: '#000000' }}>
          Search Results
        </h1>
        {q && (
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '40px' }}>
            Showing results for "{q}"
          </p>
        )}

        {loading ? (
          <ProductSkeletonGrid count={4} />
        ) : products.length > 0 ? (
          <div className="best-seller__grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <SearchIcon size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '12px' }}>No results found</h2>
            <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>
              We couldn't find anything matching "{q}". Try checking for spelling errors or using more general terms.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <ProductSkeletonGrid count={8} />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
