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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`);
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
    <div>
      <div className="admin-page-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Dashboard Overview</h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '0.875rem' }}>Welcome to Kiara Jewels Admin Portal.</p>
        </div>
      </div>

      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px', fontWeight: 500 }}>Total Revenue</h3>
          <p style={{ fontSize: '1.65rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Rs. {stats.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="admin-metric-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>Orders</h3>
            <select 
              value={orderPeriod} 
              onChange={(e) => setOrderPeriod(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', outline: 'none', backgroundColor: '#000000ff' }}
            >
              <option value="Daily">Today</option>
              <option value="Weekly">This Week</option>
              <option value="Monthly">This Month</option>
              <option value="Quarterly">This Quarter</option>
              <option value="Yearly">This Year</option>
            </select>
          </div>
          <p style={{ fontSize: '1.65rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.orders[orderPeriod]}</p>
        </div>
        
        <Link to="/products" className="admin-metric-card" style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px', fontWeight: 500 }}>Active Products</h3>
          <p style={{ fontSize: '1.65rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.activeProducts.toLocaleString()}</p>
        </Link>
        
        <div className="admin-metric-card">
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px', fontWeight: 500 }}>Total Customers</h3>
          <p style={{ fontSize: '1.65rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.totalCustomers.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
