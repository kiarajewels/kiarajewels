'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/components/Analytics';

interface CatalogPageProps {
  category?: string;
  title: string;
  apiQuery?: string;
}

function CatalogPageContent({ category, title, apiQuery }: CatalogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = apiQuery || `category=${encodeURIComponent(category || '')}`;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${query}`);
        setProducts(res.data);
        if (res.data.length > 0) {
          trackEvent('view_item_list', {
            item_list_id: title.toLowerCase().replace(/\s+/g, '_'),
            item_list_name: title,
            items: res.data.slice(0, 10).map((p: any, i: number) => ({
              item_id: p._id,
              item_name: p.name,
              affiliation: 'Kiara Jewels',
              item_category: p.category,
              price: p.price,
              index: i
            }))
          });
        }
      } catch (error) {
        console.error(`Failed to fetch catalog`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, apiQuery]);

  // Derived filter options based on actual data
  const availableSubTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach(p => { if (p.subType) types.add(p.subType); });
    return Array.from(types);
  }, [products]);

  const availableOccasions = useMemo(() => {
    const occs = new Set<string>();
    products.forEach(p => { if (p.occasion) occs.add(p.occasion); });
    return Array.from(occs);
  }, [products]);

  const availableStoneColours = useMemo(() => {
    const cols = new Set<string>();
    products.forEach(p => { if (p.stoneColour) cols.add(p.stoneColour); });
    return Array.from(cols);
  }, [products]);

  // URL synced state
  const currentSort = searchParams.get('sort') || 'newest';
  const priceFilter = searchParams.get('price') || '';
  const subTypeFilter = searchParams.get('type') || '';
  const occasionFilter = searchParams.get('occasion') || '';
  const stoneColourFilter = searchParams.get('stoneColour') || '';
  const availabilityFilter = searchParams.get('availability') || '';

  // Filtering and Sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Availability
    if (availabilityFilter === 'in_stock') {
      result = result.filter(p => p.countInStock > 0);
    } else if (availabilityFilter === 'out_of_stock') {
      result = result.filter(p => p.countInStock === 0);
    }

    // Sub-type
    if (subTypeFilter) {
      result = result.filter(p => p.subType === subTypeFilter);
    }
    
    // Occasion
    if (occasionFilter) {
      result = result.filter(p => p.occasion === occasionFilter);
    }
    
    // Stone Colour
    if (stoneColourFilter) {
      result = result.filter(p => p.stoneColour === stoneColourFilter);
    }

    // Price
    if (priceFilter) {
      if (priceFilter === 'under_1999') {
        result = result.filter(p => p.price < 1999);
      } else if (priceFilter === '1999_3999') {
        result = result.filter(p => p.price >= 1999 && p.price <= 3999);
      } else if (priceFilter === '4000_plus') {
        result = result.filter(p => p.price >= 4000);
      }
    }

    // Sort
    if (currentSort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'best_sellers') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else {
      // newest (mocked by reverse order if no createdAt exists)
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [products, currentSort, priceFilter, subTypeFilter, availabilityFilter]);

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // reset pagination on filter
    if (key !== 'page') {
      params.delete('page');
      setCurrentPage(1);
    }
    router.push(`?${params.toString()}`);
  };

  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <main style={{ backgroundColor: '#F7F7F5', minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '24px', textAlign: 'center' }}>
          {title}
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <button 
            onClick={() => setIsFilterOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, color: '#374151' }}
          >
            <Filter size={20} />
            Filter & Sort
          </button>
          
          <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            {filteredAndSortedProducts.length} products
          </div>
        </div>

        {/* Filter Bottom Sheet / Modal */}
        {isFilterOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end', transition: 'opacity 0.3s' }}>
            <div style={{ width: '100%', maxWidth: '400px', height: '100%', backgroundColor: 'white', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Filter & Sort</h2>
                <button onClick={() => setIsFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ padding: '24px', flex: 1 }}>
                {/* SORT */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Sort By</h3>
                  <select 
                    value={currentSort} 
                    onChange={(e) => updateQueryParams('sort', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="best_sellers">Best Sellers</option>
                  </select>
                </div>

                {/* PRICE FILTER */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Price</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="price" checked={priceFilter === ''} onChange={() => updateQueryParams('price', '')} /> All Prices
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="price" checked={priceFilter === 'under_1999'} onChange={() => updateQueryParams('price', 'under_1999')} /> Under Rs. 1,999
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="price" checked={priceFilter === '1999_3999'} onChange={() => updateQueryParams('price', '1999_3999')} /> Rs. 1,999 - Rs. 3,999
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="price" checked={priceFilter === '4000_plus'} onChange={() => updateQueryParams('price', '4000_plus')} /> Rs. 4,000+
                    </label>
                  </div>
                </div>

                {/* AVAILABILITY */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Availability</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="availability" checked={availabilityFilter === ''} onChange={() => updateQueryParams('availability', '')} /> All
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="availability" checked={availabilityFilter === 'in_stock'} onChange={() => updateQueryParams('availability', 'in_stock')} /> In Stock
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="availability" checked={availabilityFilter === 'out_of_stock'} onChange={() => updateQueryParams('availability', 'out_of_stock')} /> Out of Stock
                    </label>
                  </div>
                </div>

                {/* DYNAMIC SUBTYPES */}
                {availableSubTypes.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Style</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="type" checked={subTypeFilter === ''} onChange={() => updateQueryParams('type', '')} /> All Styles
                      </label>
                      {availableSubTypes.map(type => (
                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="radio" name="type" checked={subTypeFilter === type} onChange={() => updateQueryParams('type', type)} /> {type}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* DYNAMIC OCCASIONS */}
                {availableOccasions.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Occasion</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="occasion" checked={occasionFilter === ''} onChange={() => updateQueryParams('occasion', '')} /> All Occasions
                      </label>
                      {availableOccasions.map(occ => (
                        <label key={occ} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="radio" name="occasion" checked={occasionFilter === occ} onChange={() => updateQueryParams('occasion', occ)} /> {occ}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* DYNAMIC STONE COLOURS */}
                {availableStoneColours.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Stone Colour</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="stoneColour" checked={stoneColourFilter === ''} onChange={() => updateQueryParams('stoneColour', '')} /> All Colours
                      </label>
                      {availableStoneColours.map(col => (
                        <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="radio" name="stoneColour" checked={stoneColourFilter === col} onChange={() => updateQueryParams('stoneColour', col)} /> {col}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', position: 'sticky', bottom: 0, backgroundColor: 'white' }}>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  style={{ width: '100%', padding: '16px', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
                >
                  Show {filteredAndSortedProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="best-seller__grid">
          {loading ? (
            <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '60px', color: '#6b7280' }}>
              <p>Loading...</p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '80px 24px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '12px' }}>No matches found</h2>
              <p style={{ color: '#4b5563' }}>Try adjusting your filters to see more products.</p>
              <button onClick={() => router.push('?')} style={{ marginTop: '24px', padding: '10px 24px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredAndSortedProducts.length > itemsPerPage && (
          <div className="pagination" style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {Array.from({ length: Math.ceil(filteredAndSortedProducts.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination__btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #d1d5db',
                  backgroundColor: currentPage === page ? '#000' : '#fff',
                  color: currentPage === page ? '#fff' : '#000',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function CatalogPage({ category, title, apiQuery }: CatalogPageProps) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CatalogPageContent category={category} title={title} apiQuery={apiQuery} />
    </Suspense>
  );
}
