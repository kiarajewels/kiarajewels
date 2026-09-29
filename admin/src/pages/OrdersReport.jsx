import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersReport = () => {
  const [stats, setStats] = useState(null);
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
    return <div style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading Orders Report...</div>;
  }

  if (!stats) {
    return <div style={{ color: '#ef4444', fontSize: '1.1rem' }}>Failed to load report.</div>;
  }

  const orderStats = [
    { title: 'Daily', subtitle: 'Orders Today', value: stats.orders.Daily },
    { title: 'Weekly', subtitle: 'Orders This Week', value: stats.orders.Weekly },
    { title: 'Monthly', subtitle: 'Orders This Month', value: stats.orders.Monthly },
    { title: 'Quarterly', subtitle: 'Orders This Quarter', value: stats.orders.Quarterly },
    { title: 'Yearly', subtitle: 'Orders This Year', value: stats.orders.Yearly },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', margin: 0 }}>Orders Report</h2>
        <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Date-wise breakdown of order volume.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {orderStats.map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ color: '#27302E', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px' }}>{stat.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '16px' }}>{stat.subtitle}</p>
            <div style={{ backgroundColor: '#FBFAF7', border: '1px solid #d1d5db', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27302E' }}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersReport;
