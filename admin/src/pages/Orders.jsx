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
      case 'Pending': return { bg: '#fef3c7', text: '#d97706' }; // Yellow
      case 'Processing': return { bg: '#dbeafe', text: '#2563eb' }; // Blue
      case 'In-Transit': return { bg: '#f3e8ff', text: '#9333ea' }; // Purple
      case 'Delivered': return { bg: '#dcfce3', text: '#16a34a' }; // Green
      default: return { bg: '#f3f4f6', text: '#4b5563' }; // Gray
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
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', margin: 0 }}>Order Management</h2>
        <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Track and update customer order statuses.</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              style={{ padding: '8px 12px 8px 36px', border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none', width: '250px' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
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
                orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>Order Details - {selectedOrder._id}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>Order Info</h3>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Status:</strong> {selectedOrder.status}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Payment Status:</strong> {selectedOrder.isPaid ? 'Paid' : 'Pending'}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>Customer Details</h3>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Name:</strong> {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Email:</strong> {selectedOrder.shippingAddress?.email || 'N/A'}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#4b5563' }}><strong>Mobile:</strong> {selectedOrder.shippingAddress?.mobile || 'N/A'}</p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h3 style={{ fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>Shipping Address</h3>
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
            <div style={{ padding: '0 24px 24px' }}>
              <h3 style={{ fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>Ordered Products</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Product</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Price</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Qty</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Review Link</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item, idx) => {
                    const reviewLink = `https://www.kiarajewels.co/product/${item.product}?review=true&order=${selectedOrder._id}`;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          {item.name}
                        </td>
                        <td style={{ padding: '8px' }}>Rs. {item.price}</td>
                        <td style={{ padding: '8px' }}>{item.qty}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: '500' }}>Rs. {item.price * item.qty}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(reviewLink);
                              toast.success('Review link copied!');
                            }}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
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
                    <td colSpan="3" style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>Subtotal:</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>Rs. {selectedOrder.totalPrice}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{ padding: '4px 8px', textAlign: 'right', fontWeight: '500', color: '#6b7280' }}>Shipping:</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: '500', color: '#6b7280' }}>Rs. {selectedOrder.shippingPrice}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', fontSize: '1rem', color: '#111827' }}>Final Total:</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', fontSize: '1rem', color: '#111827' }}>Rs. {selectedOrder.totalPrice + selectedOrder.shippingPrice}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
