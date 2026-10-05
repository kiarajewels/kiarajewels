'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import PurchasedProductCard from '@/components/PurchasedProductCard';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/myorders?email=${session.user.email}`)
        .then(res => {
          setOrders(res.data);
          setLoadingOrders(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load orders.');
          setLoadingOrders(false);
        });

      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.email}/addresses`)
        .then(res => {
          setAddresses(res.data);
          setLoadingAddresses(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingAddresses(false);
        });
    }
  }, [status, session]);

  const handleDeleteAddress = (id: string) => {
    toast((t) => (
      <div>
        <p style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 'bold' }}>Are you sure you want to delete this address?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            style={{ padding: '6px 12px', background: '#000000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session?.user?.email}/addresses/${id}`);
                setAddresses(res.data);
                toast.success('Address deleted successfully');
              } catch (err) {
                console.error("Failed to delete address", err);
                toast.error('Failed to delete address');
              }
            }}
          >
            Delete
          </button>
          <button 
            style={{ padding: '6px 12px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { border: '1px solid #000000', padding: '16px' } });
  };

  if (status === 'loading') {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (status === 'unauthenticated' || !session?.user) {
    router.push('/login');
    return null;
  }

  const user = session.user as any;
  
  // Extract unique purchased products
  const purchasedProductsMap = new Map();
  orders.forEach(order => {
    order.orderItems.forEach((item: any) => {
      if (item.product) {
        // Use product._id as key to ensure uniqueness
        // We preserve the order date just in case
        if (!purchasedProductsMap.has(item.product._id)) {
          purchasedProductsMap.set(item.product._id, {
            ...item.product,
            historicalPrice: item.price,
            orderDate: order.createdAt
          });
        }
      }
    });
  });
  const purchasedProducts = Array.from(purchasedProductsMap.values());

  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#F7F7F5', padding: '120px 16px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Profile Info Section */}
        <div style={{ backgroundColor: 'white', padding: '24px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto 32px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '24px' }}>My Profile</h1>
          
          <img 
            src={user.image || '/images/placeholder.png'} 
            alt="Profile" 
            style={{ width: '96px', height: '96px', borderRadius: '50%', border: '2px solid #000000', marginBottom: '16px' }} 
          />
          
          <div style={{ textAlign: 'left', marginTop: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#4b5563', fontSize: '0.875rem', fontWeight: 'bold' }}>Name</label>
              <p style={{ color: '#000000', fontSize: '1.125rem', marginTop: '4px', wordBreak: 'break-word' }}>{user.name}</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#4b5563', fontSize: '0.875rem', fontWeight: 'bold' }}>Email</label>
              <p style={{ color: '#000000', fontSize: '1.125rem', marginTop: '4px', wordBreak: 'break-all' }}>{user.email}</p>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ color: '#4b5563', fontSize: '0.875rem', fontWeight: 'bold' }}>Phone Number</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
                <p style={{ color: '#000000', fontSize: '1.125rem', wordBreak: 'break-all' }}>{user.phoneNumber || 'Not provided'}</p>
                <Link href="/complete-profile" style={{ color: '#000000', textDecoration: 'none', fontWeight: '500', padding: '6px 12px', border: '1px solid #000', borderRadius: '4px' }}>Edit</Link>
              </div>
            </div>
          </div>

          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              padding: '12px 24px', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px',
              fontSize: '1rem', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            Logout
          </button>
        </div>

        {/* Saved Addresses Section */}
        <div style={{ marginBottom: '48px', backgroundColor: 'white', padding: '24px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', fontSize: '1.25rem', letterSpacing: '1px' }}>SAVED ADDRESSES</h2>
          
          {loadingAddresses ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No saved addresses yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {addresses.map(addr => (
                <div key={addr._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#4b5563' }}>
                      {addr.type || 'Home'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#000000' }}>{addr.firstName} {addr.lastName}</h3>
                  </div>
                  
                  <p style={{ margin: '0 0 4px 0', color: '#4b5563', lineHeight: '1.5' }}>
                    {addr.house}, {addr.floor && `${addr.floor},`} {addr.area}
                  </p>
                  <p style={{ margin: '0 0 12px 0', color: '#4b5563', lineHeight: '1.5' }}>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p style={{ margin: '0 0 16px 0', color: '#4b5563', fontWeight: '500' }}>
                    +91 {addr.mobile}
                  </p>

                  <button 
                    onClick={() => handleDeleteAddress(addr._id)}
                    style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', fontWeight: '500', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Section */}
        <div style={{ marginBottom: '48px', backgroundColor: 'white', padding: '24px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', fontSize: '1.25rem', letterSpacing: '1px' }}>ORDER STATUS</h2>
          
          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading orders...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>{error}</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '1.1rem' }}>No orders yet.</p>
              <Link href="/" style={{ padding: '10px 20px', backgroundColor: '#53131e', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>EXPLORE JEWELLERY</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {orders.map((order) => (
                <div key={order._id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#374151', fontSize: '0.9rem' }}>Order #{order._id.substring(0, 8).toUpperCase()}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold', color: '#000000' }}>₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    {order.orderItems.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f3f4f6' }} />
                        <div>
                          <p style={{ fontSize: '0.95rem', color: '#374151' }}>{item.name} × {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Status Timeline */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginTop: '24px', padding: '0 10px' }}>
                    <div style={{ position: 'absolute', top: '12px', left: '20px', right: '20px', height: '2px', backgroundColor: '#e5e7eb', zIndex: 0 }}></div>
                    
                    {['Processing', 'In-Transit', 'Delivered'].map((step, idx) => {
                      // Map frontend status names appropriately based on backend values
                      const backendStatus = order.status === 'Pending' ? 'Processing' : order.status;
                      const isActive = ['Pending', 'Processing', 'In-Transit', 'Delivered'].indexOf(backendStatus) >= ['Processing', 'In-Transit', 'Delivered'].indexOf(step) + 1;
                      const isCurrent = backendStatus === step || (backendStatus === 'Pending' && step === 'Processing');
                      
                      const displayStep = step === 'In-Transit' ? 'In Transit' : step;
                      
                      return (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', width: '33%' }}>
                          <div style={{ 
                            width: '24px', height: '24px', borderRadius: '50%', 
                            backgroundColor: isActive ? '#f01385ff' : '#f9fafb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: isActive ? 'none' : '2px solid #d1d5db',
                            marginBottom: '8px'
                          }}>
                            {isActive && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }}></div>}
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 'bold' : 'normal', color: isCurrent ? '#53131e' : '#6b7280', textAlign: 'center' }}>{displayStep}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchased Products Section */}
        {orders.length > 0 && purchasedProducts.length > 0 && (
          <div style={{ backgroundColor: 'white', padding: '24px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', fontSize: '1.25rem', letterSpacing: '1px' }}>MY ORDERS</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              {purchasedProducts.map((product) => (
                <PurchasedProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
