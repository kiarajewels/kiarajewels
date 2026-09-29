import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeProducts: 0,
    totalCustomers: 0,
    orders: {
      Daily: 0,
      Weekly: 0,
      Monthly: 0,
      Quarterly: 0,
      Yearly: 0
    }
  });
  const [orderPeriod, setOrderPeriod] = useState('Daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading dashboard data...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Total Revenue</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27302E' }}>Rs. {stats.totalRevenue.toLocaleString()}</p>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Orders</h3>
          <select 
            value={orderPeriod} 
            onChange={(e) => setOrderPeriod(e.target.value)}
            style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer', outline: 'none' }}
          >
            <option value="Daily">Today</option>
            <option value="Weekly">This Week</option>
            <option value="Monthly">This Month</option>
            <option value="Quarterly">This Quarter</option>
            <option value="Yearly">This Year</option>
          </select>
        </div>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27302E' }}>{stats.orders[orderPeriod]}</p>
      </div>
      
      <Link to="/products" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', textDecoration: 'none', display: 'block', transition: 'box-shadow 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Active Products</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27302E', margin: 0 }}>{stats.activeProducts.toLocaleString()}</p>
      </Link>
      
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>Total Customers</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27302E' }}>{stats.totalCustomers.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Dashboard;
