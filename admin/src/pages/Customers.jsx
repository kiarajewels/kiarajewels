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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 , color: 'black'}}>Paying Customers</h2>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img 
                  src={selectedCustomer.image} 
                  alt={selectedCustomer.name} 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                />
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{selectedCustomer.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#6b7280', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> 
                      {selectedCustomer.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> 
                      {selectedCustomer.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>Total Orders</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{selectedCustomer.orders.length}</div>
              </div>
              <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>Lifetime Spend</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>Rs. {selectedCustomer.totalSpend.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, padding: '16px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>Customer Since</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>{selectedCustomer.firstOrderDate}</div>
              </div>
            </div>

            {/* Order History */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: 'white' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Order History</h4>
              
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
