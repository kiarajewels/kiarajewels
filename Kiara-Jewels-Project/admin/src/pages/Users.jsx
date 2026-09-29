import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 , color: 'black'}}>Registered Users</h2>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Image</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Name</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Email</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Phone Number</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img 
                      src={user.image || 'https://via.placeholder.com/40'} 
                      alt={user.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{user.name}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{user.phoneNumber || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
