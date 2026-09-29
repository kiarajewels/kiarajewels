import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search } from 'lucide-react';

const Carts = () => {
  const [usersWithCarts, setUsersWithCarts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch users with active carts
      const usersRes = await axios.get('http://localhost:5000/api/users/active-carts');
      setUsersWithCarts(usersRes.data);
      
      // Fetch all products to map IDs to names
      const productsRes = await axios.get('http://localhost:5000/api/products');
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Error fetching cart data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : `Product ID: ${productId}`;
  };

  const filteredUsers = usersWithCarts.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', margin: 0 }}>Active Shopping Carts</h2>
        <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>View users who have items in their cart but haven't checked out.</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by customer name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', border: '1px solid #e5e7eb', borderRadius: '6px', outline: 'none', width: '300px' }}
            />
          </div>
          <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.875rem' }}>
            <ShoppingCart size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Total Active Carts: <strong>{usersWithCarts.length}</strong>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem', width: '30%' }}>Customer Details</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Items in Cart</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>Total Quantity</th>
                <th style={{ padding: '12px 16px', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem', textAlign: 'right' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading carts...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No active carts found.</td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const totalItems = user.cart.reduce((acc, item) => acc + item.quantity, 0);
                  
                  return (
                    <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb', verticalAlign: 'top' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ color: '#374151', fontWeight: '600' }}>{user.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>{user.email}</div>
                        {user.phoneNumber && (
                          <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '4px', display: 'inline-block', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                            {user.phoneNumber}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.875rem', color: '#4b5563', listStyleType: 'disc' }}>
                          {user.cart.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>
                              <span style={{ fontWeight: '500' }}>{getProductName(item.id)}</span> 
                              <span style={{ color: '#9ca3af', marginLeft: '6px' }}>x {item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e7ff', color: '#4f46e5', width: '28px', height: '28px', borderRadius: '50%', fontWeight: 'bold', fontSize: '0.875rem' }}>
                          {totalItems}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.875rem', textAlign: 'right' }}>
                        {new Date(user.updatedAt).toLocaleDateString()}
                        <div style={{ fontSize: '0.75rem' }}>{new Date(user.updatedAt).toLocaleTimeString()}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Carts;
