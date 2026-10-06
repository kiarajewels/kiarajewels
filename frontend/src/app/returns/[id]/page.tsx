'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, Clock, Truck, PackageCheck, Banknote } from 'lucide-react';
import Link from 'next/link';

export default function ReturnDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [returnReq, setReturnReq] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Need to use the backend ID, or fetch all returns and find by returnId
    if (status === 'authenticated' && session?.user?.email) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/returns/customer/${session.user.email}`)
        .then(res => {
          const matchedReturn = res.data.find((r: any) => r.returnId === params.id);
          if (matchedReturn) {
            setReturnReq(matchedReturn);
          } else {
            router.push('/profile');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, params.id, router]);

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!returnReq) return null;

  const timelineSteps = [
    { status: 'Requested', icon: <Clock size={24} />, title: 'Return Requested', date: returnReq.requestedAt },
    { status: 'Approved', icon: <CheckCircle2 size={24} />, title: 'Return Approved', date: returnReq.approvedAt },
    { status: 'In Transit', icon: <Truck size={24} />, title: 'In Transit', date: null },
    { status: 'Received', icon: <PackageCheck size={24} />, title: 'Received & Inspected', date: returnReq.inspectedAt || returnReq.receivedAt },
    { status: 'Refund Completed', icon: <Banknote size={24} />, title: 'Refund Completed', date: returnReq.refundCompletedAt }
  ];

  // Map backend status to index for timeline tracking
  let currentIndex = 0;
  if (returnReq.returnStatus === 'Rejected') {
    // Special case
  } else {
    const statuses = ['Requested', 'Approved', 'In Transit', 'Received', 'Inspection Complete', 'Refund Processing', 'Refund Completed'];
    const statusIndex = statuses.indexOf(returnReq.returnStatus);
    if (statusIndex >= 0) currentIndex = 1;
    if (statusIndex >= 1) currentIndex = 2;
    if (statusIndex >= 2) currentIndex = 3;
    if (statusIndex >= 3) currentIndex = 4;
    if (statusIndex >= 6) currentIndex = 5;
  }

  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#F7F7F5', padding: '120px 16px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={20} /> Back to Profile
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', margin: '0 0 8px 0', fontSize: '2rem' }}>Return #{returnReq.returnId}</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Requested on {new Date(returnReq.requestedAt).toLocaleDateString()}</p>
          </div>
          
          <div style={{ padding: '8px 16px', backgroundColor: returnReq.returnStatus === 'Rejected' ? '#fee2e2' : '#f0fdf4', color: returnReq.returnStatus === 'Rejected' ? '#ef4444' : '#166534', borderRadius: '999px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {returnReq.returnStatus}
          </div>
        </div>

        {returnReq.returnStatus === 'Rejected' ? (
          <div style={{ backgroundColor: '#fee2e2', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
            <h3 style={{ color: '#b91c1c', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Return Request Rejected</h3>
            <p style={{ color: '#7f1d1d', margin: 0 }}>{returnReq.rejectionReason || 'Unfortunately, your return request was not approved.'}</p>
          </div>
        ) : (
          <div style={{ position: 'relative', marginBottom: '48px', padding: '0 16px' }}>
            {/* Timeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '2px', backgroundColor: '#e5e7eb', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: '24px', left: '0', width: `${(currentIndex / 4) * 100}%`, height: '2px', backgroundColor: '#000000', zIndex: 1, transition: 'width 0.5s ease' }}></div>
              
              {timelineSteps.map((step, idx) => {
                const isActive = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '20%' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '50%', 
                      backgroundColor: isActive ? '#000000' : 'white',
                      border: isActive ? 'none' : '2px solid #d1d5db',
                      color: isActive ? 'white' : '#9ca3af',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '12px',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(0,0,0,0.1)' : 'none'
                    }}>
                      {step.icon}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#374151' : '#9ca3af', textAlign: 'center' }}>{step.title}</p>
                    {step.date && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#6b7280' }}>{new Date(step.date).toLocaleDateString()}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Items Returned</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {returnReq.returnItems.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f3f4f6' }} />
                  <div>
                    <p style={{ fontWeight: '500', color: '#374151', fontSize: '1rem', margin: '0 0 4px' }}>{item.name}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Qty: {item.qty} • Expected Refund: ₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '24px', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Total Refund Amount</span>
              <span style={{ fontWeight: 'bold', color: '#000000', fontSize: '1.25rem' }}>₹{returnReq.refundAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          {(returnReq.returnTrackingNumber || returnReq.returnCourier) && (
             <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#0369a1' }}>Return Shipping Information</h4>
                {returnReq.returnCourier && <p style={{ margin: '0 0 4px 0', color: '#0c4a6e', fontSize: '0.9rem' }}>Courier: <strong>{returnReq.returnCourier}</strong></p>}
                {returnReq.returnTrackingNumber && <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.9rem' }}>Tracking Number: <strong>{returnReq.returnTrackingNumber}</strong></p>}
             </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '12px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Reason for Return</h3>
            <p style={{ color: '#000000', fontWeight: '500', margin: '0 0 8px' }}>{returnReq.reason}</p>
            {returnReq.comments && (
              <p style={{ color: '#4b5563', margin: 0, fontStyle: 'italic', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px' }}>"{returnReq.comments}"</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
