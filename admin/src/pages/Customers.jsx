import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      const orders = ordersRes.data;

      const customerMap = new Map();

      // Sort orders by date ascending so the first order processed is the oldest
      const sortedOrders = orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      sortedOrders.forEach(order => {
        const email = order.shippingAddress?.email || order.user?.email;
        if (!email) return;

        if (!customerMap.has(email)) {
          customerMap.set(email, {
            id: order.user?._id || email,
            image: order.user?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(order.shippingAddress?.firstName || 'C') + '&background=random',
            name: order.shippingAddress?.firstName ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}` : (order.user?.name || 'Guest'),
            email: email,
            phoneNumber: order.shippingAddress?.mobile || order.user?.phoneNumber || 'N/A',
            firstOrderDate: new Date(order.createdAt).toLocaleDateString(), // Since sorted ascending, this is the first
            totalSpend: order.totalPrice || 0,
            orders: [order]
          });
        } else {
          const existing = customerMap.get(email);
          existing.orders.push(order);
          existing.totalSpend += (order.totalPrice || 0);
        }
      });

      // Sort customers by most recent order date descending
      const uniqueCustomers = Array.from(customerMap.values()).sort((a, b) => {
        const aLast = new Date(a.orders[a.orders.length - 1].createdAt);
        const bLast = new Date(b.orders[b.orders.length - 1].createdAt);
        return bLast - aLast;
      });

      setCustomers(uniqueCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 , color: 'black'}}>Paying Customers</h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>View lifetime customers and order histories.</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Image</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Name</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Email</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Phone Number</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Customer Since</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                  No paying customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr 
                  key={customer.email} 
                  style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <img 
                      src={customer.image} 
                      alt={customer.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '500', color: '#111827' }}>{customer.name}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{customer.email}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{customer.phoneNumber}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{customer.firstOrderDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="admin-modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="admin-modal-header" style={{ backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: 0 }}>
                <img 
                  src={selectedCustomer.image} 
                  alt={selectedCustomer.name} 
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexShrink: 0 }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                />
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedCustomer.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', color: '#6b7280', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}>
                      ✉️ {selectedCustomer.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      📞 {selectedCustomer.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563', flexShrink: 0 }}
              >
                &times;
              </button>
            </div>

            {/* Quick Stats */}
            <div className="admin-modal-stats">
              <div style={{ flex: 1, padding: '14px 20px', borderRight: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>Total Orders</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#111827' }}>{selectedCustomer.orders.length}</div>
              </div>
              <div style={{ flex: 1, padding: '14px 20px', borderRight: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>Lifetime Spend</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#10b981' }}>Rs. {selectedCustomer.totalSpend.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, padding: '14px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>Customer Since</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>{selectedCustomer.firstOrderDate}</div>
              </div>
            </div>

            {/* Order History */}
            <div className="admin-modal-body" style={{ backgroundColor: 'white' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#111827', marginBottom: '14px' }}>Order History</h4>
              
              <div className="admin-table-wrapper" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', whiteSpace: 'nowrap' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '0.875rem' }}>Invoice No.</th>
                      <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '0.875rem' }}>Date</th>
                      <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '0.875rem' }}>Items</th>
                      <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '0.875rem' }}>Total</th>
                      <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '0.875rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
                      <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                          {order._id.substring(order._id.length - 8).toUpperCase()}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6b7280' }}>
                          {order.orderItems?.length || 0} item(s)
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#111827', fontWeight: '600' }}>
                          Rs. {order.totalPrice}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '9999px', 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold', 
                            backgroundColor: order.isDelivered ? '#d1fae5' : '#fef3c7',
                            color: order.isDelivered ? '#065f46' : '#92400e'
                          }}>
                            {order.isDelivered ? 'Delivered' : 'Processing'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
