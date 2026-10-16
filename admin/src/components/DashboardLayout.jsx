import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, BarChart, Menu, X, Bell } from 'lucide-react';
import { isTokenValid, clearAdminSession } from '../utils/auth';
import { 
  initAudioContext, 
  playOrderAlertSound, 
  showOrderNotification, 
  requestNotificationPermission, 
  getNotificationPermission 
} from '../utils/notifications';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission());
  const latestOrderIdRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Auto-lock monitor: check every 30 seconds and on window focus
  useEffect(() => {
    const checkSession = () => {
      if (!isTokenValid()) {
        clearAdminSession();
        toast('Admin session locked after 24 hours. Please log in.', { icon: '🔒' });
        navigate('/login', { replace: true, state: { expired: true } });
      }
    };

    // Check immediately on mount/route change
    checkSession();

    const interval = setInterval(checkSession, 30000);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', checkSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', checkSession);
    };
  }, [navigate, location.pathname]);

  // Warm up audio context on any user touch/click for Chrome autoplay policy
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudioContext();
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Poll for newest orders in real-time across laptop Chrome & mobile Chrome
  useEffect(() => {
    let isMounted = true;

    const checkLatestOrder = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/latest-check`);
        const { latestOrder } = res.data || {};

        if (!latestOrder || !isMounted) return;

        // On initial mount: record the latest order ID without false-alerting on existing orders
        if (!isInitializedRef.current) {
          latestOrderIdRef.current = latestOrder._id;
          isInitializedRef.current = true;
          return;
        }

        // When a genuinely new order has arrived!
        if (latestOrderIdRef.current && latestOrder._id !== latestOrderIdRef.current) {
          latestOrderIdRef.current = latestOrder._id;
          setHasNewOrders(true);

          // 1. Play luxury audio chime
          playOrderAlertSound();

          // 2. Trigger native Chrome notification banner
          const shortId = latestOrder._id.slice(-8).toUpperCase();
          const amountStr = latestOrder.totalPrice ? latestOrder.totalPrice.toFixed(2) : '0';
          showOrderNotification({
            title: `🛍️ New Order #${shortId} (₹${amountStr})`,
            body: `${latestOrder.customerName || 'A customer'} placed a new order.`,
            onClick: () => navigate('/orders')
          });

          // 3. Interactive in-app toast
          toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>🛍️ New Order Received!</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#d1d5db' }}>
                  #{shortId} • ₹{amountStr} • {latestOrder.customerName}
                </p>
              </div>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/orders');
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                View
              </button>
            </div>
          ), { duration: 9000 });

          // 4. Dispatch event for Orders page auto-refresh
          window.dispatchEvent(new CustomEvent('kiara_new_order', { detail: latestOrder }));
        }
      } catch (err) {
        // Silently catch background network polling errors
        console.warn('Order polling notice:', err?.message);
      }
    };

    checkLatestOrder();
    const interval = setInterval(checkLatestOrder, 15000); // Check every 15s

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkLatestOrder();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [navigate]);

  // Clear new order indicator when visiting /orders
  useEffect(() => {
    if (location.pathname === '/orders') {
      setHasNewOrders(false);
    }
  }, [location.pathname]);

  const handleEnableAlerts = async () => {
    const permission = await requestNotificationPermission();
    setNotifPermission(permission);
    if (permission === 'granted') {
      playOrderAlertSound();
      toast.success('Real-time order alerts enabled on this device!');
    } else if (permission === 'denied') {
      toast.error('Notifications are blocked in your browser settings.');
    }
  };

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
    clearAdminSession();
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
                {item.name === 'Orders' && hasNewOrders && (
                  <span 
                    style={{ 
                      marginLeft: 'auto', 
                      backgroundColor: '#ef4444', 
                      color: '#ffffff', 
                      fontSize: '0.65rem', 
                      fontWeight: 'bold', 
                      padding: '2px 7px', 
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    New
                  </span>
                )}
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
            {/* Real-time Order Alerts Toggle / Badge */}
            {notifPermission === 'default' && (
              <button
                type="button"
                onClick={handleEnableAlerts}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                title="Enable browser alerts when new orders are placed"
              >
                <Bell size={15} color="#d97706" />
                <span>Enable Alerts</span>
              </button>
            )}
            {notifPermission === 'granted' && (
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  backgroundColor: '#f0fdf4',
                  color: '#15803d',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: '1px solid #bbf7d0'
                }}
                title="Order alerts active (audio chime + Chrome notifications)"
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span>Alerts On</span>
              </div>
            )}

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
