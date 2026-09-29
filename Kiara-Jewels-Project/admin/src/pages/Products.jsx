import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Gift, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // Stock Popup State
  const [showStockPopup, setShowStockPopup] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [stockAddAmount, setStockAddAmount] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ['All', 'Rings', 'Earrings', 'Pendants', 'Bracelets', 'Sets'];
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  const openStockPopup = (product) => {
    setActiveProduct(product);
    setStockAddAmount('');
    setShowStockPopup(true);
  };

  const closeStockPopup = () => {
    setShowStockPopup(false);
    setActiveProduct(null);
    setStockAddAmount('');
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    if (!activeProduct || !stockAddAmount) return;

    try {
      const amountToAdd = Number(stockAddAmount);
      const newStock = (activeProduct.countInStock || 0) + amountToAdd;

      await axios.put(`http://localhost:5000/api/products/${activeProduct._id}/stock`, {
        countInStock: newStock
      });

      // Refresh list
      fetchProducts();
      closeStockPopup();
    } catch (error) {
      console.error('Failed to update stock', error);
      alert('Failed to update stock');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts(); // Refresh list after delete
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product');
      }
    }
  };

  const toggleGifting = async (product) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${product._id}`, {
        isGifting: !product.isGifting
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to toggle gifting', error);
      alert('Failed to update gifting status');
    }
  };

  const toggleBestSeller = async (product) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${product._id}`, {
        isBestSeller: !product.isBestSeller
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to toggle best seller', error);
      alert('Failed to update best seller status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', margin: 0 }}>Inventory Management</h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Manage your product listings and available stock.</p>
        </div>
        <Link 
          to="/products/new" 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            backgroundColor: '#000000', color: 'white', padding: '10px 16px', 
            borderRadius: '6px', textDecoration: 'none', fontWeight: '500' 
          }}
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: filter === cat ? '#000000' : '#e5e7eb',
                  backgroundColor: filter === cat ? '#f3f4f6' : 'white',
                  color: filter === cat ? '#000000' : '#4b5563',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              style={{ padding: '8px 12px 8px 36px', border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none' }}
            />
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Product Info</th>
              <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Category</th>
              <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Price</th>
              <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Gifting</th>
              <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Best Seller</th>
              <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Stock Quantity</th>
              <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                     <img src={product.media && product.media.length > 0 ? product.media[0].url : '/images/placeholder.png'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#374151' }}>{product.name}</div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500', color: '#4b5563' }}>
                    {product.category}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#374151' }}>Rs. {product.price}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button 
                    onClick={() => toggleGifting(product)}
                    style={{ 
                      background: product.isGifting ? '#000000' : '#f3f4f6', 
                      border: '1px solid', 
                      borderColor: product.isGifting ? '#000000' : '#e5e7eb', 
                      borderRadius: '4px', 
                      width: '32px', height: '32px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', cursor: 'pointer', 
                      color: product.isGifting ? 'white' : '#9ca3af' 
                    }}
                    title={product.isGifting ? "Remove from Gifting" : "Add to Gifting"}
                  >
                    <Gift size={18} />
                  </button>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button 
                    onClick={() => toggleBestSeller(product)}
                    style={{ 
                      background: product.isBestSeller ? '#000000' : '#f3f4f6', 
                      border: '1px solid', 
                      borderColor: product.isBestSeller ? '#000000' : '#e5e7eb', 
                      borderRadius: '4px', 
                      width: '32px', height: '32px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', cursor: 'pointer', 
                      color: product.isBestSeller ? '#fde047' : '#9ca3af' 
                    }}
                    title={product.isBestSeller ? "Remove from Best Sellers" : "Add to Best Sellers"}
                  >
                    <Star size={18} fill={product.isBestSeller ? '#fde047' : 'none'} />
                  </button>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '500', color: '#374151' }}>{product.countInStock || 0}</span>
                    <button 
                      onClick={() => openStockPopup(product)}
                      style={{ 
                        background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', 
                        width: '28px', height: '28px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', cursor: 'pointer', color: '#4b5563' 
                      }}
                      title="Add Stock"
                    >
                      <Plus size={16} />
                    </button>
                    {(product.countInStock === 0 || !product.countInStock) && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: '500' }}>Out of Stock</span>}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <Link to={`/products/edit/${product._id}`} style={{ color: '#4b5563', cursor: 'pointer', marginRight: '12px', display: 'inline-flex' }} title="Edit Product">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(product._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete Product">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && !loading && (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                  No products found in this category.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stock Popup Modal */}
      {showStockPopup && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000 
        }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '320px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#374151' }}>Add Stock</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
              How much stock to add for <strong>{activeProduct?.name}</strong>?
            </p>
            <form onSubmit={handleStockUpdate}>
              <input 
                type="number" 
                min="1"
                required
                value={stockAddAmount}
                onChange={(e) => setStockAddAmount(e.target.value)}
                placeholder="e.g. 5"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={closeStockPopup}
                  style={{ padding: '8px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', color: '#4b5563' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 16px', background: '#000000', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
