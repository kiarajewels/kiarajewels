import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['All', 'Pending', 'Processing', 'In-Transit', 'Delivered'];

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  useEffect(() => {
    const handleNewOrder = () => {
      fetchOrders();
    };
    window.addEventListener('kiara_new_order', handleNewOrder);
    return () => window.removeEventListener('kiara_new_order', handleNewOrder);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = filter === 'All' 
        ? `${import.meta.env.VITE_API_URL}/api/orders` 
        : `${import.meta.env.VITE_API_URL}/api/orders?status=${filter}`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': 
        return { 
          bg: '#fee2e2', 
          text: '#b91c1c', 
          rowBg: 'rgba(239, 68, 68, 0.05)', 
          rowBorder: '#ef4444' 
        }; // Red
      case 'Processing': 
        return { 
          bg: '#dbeafe', 
          text: '#1d4ed8', 
          rowBg: 'rgba(37, 99, 235, 0.05)', 
          rowBorder: '#3b82f6' 
        }; // Blue
      case 'In-Transit': 
        return { 
          bg: '#f3e8ff', 
          text: '#7e22ce', 
          rowBg: 'rgba(147, 51, 234, 0.05)', 
          rowBorder: '#9333ea' 
        }; // Purple
      case 'Delivered': 
        return { 
          bg: '#dcfce3', 
          text: '#15803d', 
          rowBg: 'rgba(22, 163, 74, 0.05)', 
          rowBorder: '#16a34a' 
        }; // Green
      default: 
        return { 
          bg: '#f3f4f6', 
          text: '#4b5563', 
          rowBg: 'transparent', 
          rowBorder: 'transparent' 
        }; // Gray
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, { status: newStatus });
      // Update locally
      setOrders(orders.map(order => order._id === id ? { ...order, status: newStatus } : order));
      toast.success('Status updated successfully');
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', margin: 0 }}>Order Management</h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Track and update customer order statuses.</p>
        </div>
      </div>

      <div className="admin-table-card">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-toolbar-row">
            <Filter size={18} color="#6b7280" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none', backgroundColor: '#f9fafb', color: '#4b5563', fontWeight: '500' }}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status} Orders</option>
              ))}
            </select>
          </div>
          <div className="admin-search-box">
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              style={{ padding: '8px 12px 8px 36px', border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none', width: '250px' }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Order ID</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Date</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Customer Details</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Items</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Total</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No orders found.</td>
                </tr>
              ) : (
                orders.map(order => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr 
                      key={order._id} 
                      style={{ 
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: statusStyle.rowBg,
                        borderLeft: `4px solid ${statusStyle.rowBorder}`,
                        transition: 'background-color 0.3s ease, border-color 0.3s ease'
                      }}
                    >
                    <td style={{ padding: '16px', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>
                      {order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#374151', fontWeight: '500' }}>{order.user?.name || 'Guest User'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.user?.email || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem' }}>
                        {order.orderItems.map((item, idx) => (
                          <li key={idx}>{item.name} (x{item.qty})</li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#374151' }}>
                      Rs. {order.totalPrice?.toFixed(2)}
                      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#16a34a', marginTop: '4px' }}>
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          backgroundColor: getStatusColor(order.status).bg, 
                          color: getStatusColor(order.status).text,
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="In-Transit">In-Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: '500' }}>
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#111827', fontWeight: 'bold', wordBreak: 'break-all' }}>Order Details: {selectedOrder._id}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280', lineHeight: 1, padding: '4px' }}>&times;</button>
            </div>
            
            <div className="admin-modal-body">
              <div className="admin-modal-grid-2" style={{ marginBottom: '24px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '10px' }}>Order Info</h3>
                    <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Status:</strong> {selectedOrder.status}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Payment Status:</strong> {selectedOrder.isPaid ? 'Paid' : 'Pending'}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  </div>

                  <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '10px' }}>Customer Details</h3>
                    <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Name:</strong> {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Email:</strong> {selectedOrder.shippingAddress?.email || 'N/A'}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Mobile:</strong> {selectedOrder.shippingAddress?.mobile || 'N/A'}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '10px' }}>Shipping Address</h3>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Type:</strong> {selectedOrder.shippingAddress?.type}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}>
                    {selectedOrder.shippingAddress?.house}, {selectedOrder.shippingAddress?.floor && `Floor ${selectedOrder.shippingAddress.floor}, `}
                    <br />
                    {selectedOrder.shippingAddress?.area}
                    {selectedOrder.shippingAddress?.landmark && <><br />Landmark: {selectedOrder.shippingAddress.landmark}</>}
                    <br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                    <br />
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </div>
              </div>

              {/* Bottom Products List */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Ordered Products</h3>
                <div className="admin-table-wrapper" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', minWidth: '550px', whiteSpace: 'nowrap' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>Product</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>Price</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>Qty</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb', color: '#4b5563', textAlign: 'right' }}>Total</th>
                        <th style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb', color: '#4b5563', textAlign: 'right' }}>Review Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems.map((item, idx) => {
                        const reviewLink = `https://www.kiarajewels.co/product/${item.product}?review=true&order=${selectedOrder._id}`;
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              <span style={{ fontWeight: '500' }}>{item.name}</span>
                            </td>
                            <td style={{ padding: '10px 12px' }}>Rs. {item.price}</td>
                            <td style={{ padding: '10px 12px' }}>{item.qty}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '500' }}>Rs. {item.price * item.qty}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(reviewLink);
                                  toast.success('Review link copied!');
                                }}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#000000ff', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Copy Link
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>Subtotal:</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>Rs. {selectedOrder.totalPrice}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3" style={{ padding: '4px 12px', textAlign: 'right', fontWeight: '500', color: '#6b7280' }}>Shipping:</td>
                        <td style={{ padding: '4px 12px', textAlign: 'right', fontWeight: '500', color: '#6b7280' }}>Rs. {selectedOrder.shippingPrice}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '1rem', color: '#111827' }}>Final Total:</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '1rem', color: '#111827' }}>Rs. {selectedOrder.totalPrice + selectedOrder.shippingPrice}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
