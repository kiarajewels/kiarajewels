import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Check, X, Plus } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [newReview, setNewReview] = useState({ product: '', customerName: '', rating: 5, body: '', title: '' });

  const fetchReviews = async () => {
    try {
      const url = statusFilter ? `/api/reviews/admin?status=${statusFilter}` : '/api/reviews/admin';
      const res = await axios.get(`http://localhost:5500${url}`);
      setReviews(res.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5500/api/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5500/api/reviews/${id}/status`, { status: newStatus });
      toast.success(`Review ${newStatus}`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.product || !newReview.customerName || !newReview.body) {
      return toast.error('Product, Name, and Review text are required');
    }
    try {
      await axios.post('http://localhost:5500/api/reviews/admin', newReview);
      toast.success('Review added successfully');
      setShowAddForm(false);
      setNewReview({ product: '', customerName: '', rating: 5, body: '', title: '' });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>Customer Reviews</h1>
            <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '0.875rem' }}>Moderate, approve, and import verified customer reviews.</p>
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000', color: '#fff', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
        >
          <Plus size={18} />
          {showAddForm ? 'Close Form' : 'Add Review (Imported)'}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#111827' }}>Import Customer Review</h2>
          <form onSubmit={handleAddReview}>
            <div className="admin-form-grid-2">
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Product *</label>
                <select 
                  value={newReview.product}
                  onChange={(e) => setNewReview({...newReview, product: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                >
                  <option value="">Select a product</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Customer Name *</label>
                <input 
                  type="text" 
                  value={newReview.customerName}
                  onChange={(e) => setNewReview({...newReview, customerName: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Rating *</label>
                <select 
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                >
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Title (Optional)</label>
                <input 
                  type="text" 
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Review Body *</label>
              <textarea 
                value={newReview.body}
                onChange={(e) => setNewReview({...newReview, body: e.target.value})}
                rows={3}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <div className="admin-form-actions">
              <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                Save Imported Review
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280' }}>Product</th>
              <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280' }}>Customer</th>
              <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280' }}>Rating</th>
              <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280' }}>Review</th>
              <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280' }}>Source</th>
              <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {review.product?.name || 'Unknown Product'}
                </td>
                <td style={{ padding: '16px' }}>{review.customerName}</td>
                <td style={{ padding: '16px' }}>{review.rating}/5</td>
                <td style={{ padding: '16px', maxWidth: '300px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{review.title}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563' }}>{review.body}</p>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold',
                    backgroundColor: review.status === 'approved' ? '#dcfce7' : review.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                    color: review.status === 'approved' ? '#166534' : review.status === 'rejected' ? '#991b1b' : '#92400e'
                  }}>
                    {review.status}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '0.85rem' }}>{review.source}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {review.status !== 'approved' && (
                      <button 
                        onClick={() => updateStatus(review._id, 'approved')}
                        title="Approve"
                        style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button 
                        onClick={() => updateStatus(review._id, 'rejected')}
                        title="Reject"
                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
