import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, BarChart, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-close sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out');
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Returns', href: '/returns', icon: Package },
    { name: 'Custom Orders', href: '/custom-orders', icon: ShoppingCart },
    { name: 'Orders Report', href: '/orders-report', icon: BarChart },
    { name: 'Active Carts', href: '/carts', icon: ShoppingCart },
    { name: 'Reviews', href: '/reviews', icon: Package },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const currentTitle = navigation.find(n => location.pathname.startsWith(n.href) && n.href !== '/')?.name 
    || (location.pathname === '/' ? 'Dashboard' : '');

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`admin-sidebar-backdrop ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar (Desktop static & Mobile drawer) */}
      <aside className={`admin-sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#000000', margin: 0, letterSpacing: '-0.02em' }}>Kiara Jewels</h2>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '2px 0 0 0' }}>Admin Panel</p>
          </div>
          <button 
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#000000' : '#4b5563',
                  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.95rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={handleLogout} style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%', 
            padding: '10px 14px', border: 'none', background: 'transparent', 
            color: '#ef4444', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer',
            borderRadius: '8px', transition: 'background-color 0.15s ease'
          }}>
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <main className="admin-main">
        {/* Responsive Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button 
              type="button"
              className="admin-menu-btn"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTitle}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }} className="admin-hide-mobile">
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', margin: 0 }}>Super Admin</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>admin@kiarajewels.com</p>
            </div>
            <div style={{ 
              width: '38px', height: '38px', borderRadius: '50%', 
              backgroundColor: '#000000', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: '#ffffff', fontWeight: 'bold', 
              fontSize: '0.9rem', flexShrink: 0 
            }}>
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
