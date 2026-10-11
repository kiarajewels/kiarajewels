import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DownloadCloud, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/custom-orders`, { withCredentials: true });
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to fetch custom orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/custom-orders/${id}`, { status: newStatus }, { withCredentials: true });
      toast.success('Status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading custom orders...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Custom Orders</h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Review custom bespoke jewellery inquiries and quote requests.</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px', fontSize: '0.875rem' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Date</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Customer</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Request</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Reference</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{order.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '2px' }}>📞 {order.phone}</div>
                    {order.email && <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>✉️ {order.email}</div>}
                  </td>
                  <td style={{ padding: '16px', color: '#4b5563', maxWidth: '280px', whiteSpace: 'pre-wrap' }}>{order.description}</td>
                  <td style={{ padding: '16px' }}>
                    {order.referenceImage ? (
                      <a href={order.referenceImage} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View <DownloadCloud size={16} />
                      </a>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updating}
                      style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: 'white', outline: 'none' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No custom orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
