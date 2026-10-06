'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Upload, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ReturnRequestForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [evidence, setEvidence] = useState<any[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && orderId) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`)
        .then(res => {
          const fetchedOrder = res.data;
          // Validate ownership
          if (fetchedOrder.shippingAddress.email !== session?.user?.email) {
             toast.error('Unauthorized');
             router.push('/');
             return;
          }
          // Validate eligibility
          if (fetchedOrder.status !== 'Delivered') {
            toast.error('Order is not eligible for return yet');
            router.push('/profile');
            return;
          }
          
          const deliveredDate = new Date(fetchedOrder.deliveredAt);
          const now = new Date();
          const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
          if (now.getTime() - deliveredDate.getTime() > threeDaysInMs) {
            toast.error('Return window has expired');
            router.push('/profile');
            return;
          }

          setOrder(fetchedOrder);
          // By default select all items
          setSelectedItems(fetchedOrder.orderItems);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          toast.error('Failed to load order details');
          router.push('/profile');
        });
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, orderId, router]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (evidence.length + files.length > 3) {
      toast.error("You can only upload up to 3 photos.");
      return;
    }

    // In a real app, upload to Cloudinary. For now, simulate or store base64 if small.
    // Assuming backend handles base64 or cloudinary directly.
    const newEvidence: any[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error("Only images are allowed");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        continue;
      }
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newEvidence.push(base64);
    }
    setEvidence(prev => [...prev, ...newEvidence]);
  };

  const removeEvidence = (index: number) => {
    const newEv = [...evidence];
    newEv.splice(index, 1);
    setEvidence(newEv);
  };

  const toggleItemSelection = (item: any) => {
    const isSelected = selectedItems.find(i => i.product === item.product);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(i => i.product !== item.product));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }
    if (!reason) {
      toast.error('Please select a reason for return');
      return;
    }
    if (!confirmed) {
      toast.error('Please confirm the return conditions');
      return;
    }
    if (reason === 'Other' && !comments) {
      toast.error('Please provide more details in the comments field');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/returns`, {
        orderId: order._id,
        email: session?.user?.email,
        name: session?.user?.name,
        items: selectedItems,
        reason,
        comments,
        evidence // Ideally these are Cloudinary URLs
      });
      toast.success('Return request submitted successfully');
      router.push('/profile');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!order) return null;

  const deliveredDate = new Date(order.deliveredAt);
  const expiryDate = new Date(deliveredDate.getTime() + 3 * 24 * 60 * 60 * 1000);

  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#F7F7F5', padding: '120px 16px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={20} /> Back to Profile
        </Link>
        
        <h1 style={{ fontFamily: 'Times New Roman, serif', color: '#000000', marginBottom: '8px', fontSize: '2rem' }}>Request Return</h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>Order #{order._id.substring(0, 8).toUpperCase()} • Delivered on {deliveredDate.toLocaleDateString()}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Select Items */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '16px', color: '#374151' }}>Select Items to Return</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.orderItems.map((item: any, idx: number) => {
                const isSelected = selectedItems.find(i => i.product === item.product);
                return (
                  <div key={idx} 
                    onClick={() => toggleItemSelection(item)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                      border: `1px solid ${isSelected ? '#000000' : '#e5e7eb'}`, 
                      borderRadius: '8px', cursor: 'pointer',
                      backgroundColor: isSelected ? '#fafafa' : 'white'
                    }}>
                    <input 
                      type="checkbox" 
                      checked={!!isSelected} 
                      readOnly 
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#000000' }} 
                    />
                    <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #f3f4f6' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '500', color: '#374151', fontSize: '1rem', margin: '0 0 4px' }}>{item.name}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Qty: {item.qty} • Paid: ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '16px', color: '#374151' }}>Why are you returning this?</h3>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}
            >
              <option value="" disabled>Select a reason...</option>
              <option value="Product received damaged">Product received damaged</option>
              <option value="Wrong product received">Wrong product received</option>
              <option value="Product doesn't meet expectations">Product doesn't meet expectations</option>
              <option value="Size / fit issue">Size / fit issue</option>
              <option value="Quality issue">Quality issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Comments & Evidence */}
          {(reason === 'Other' || reason === 'Product received damaged' || reason === 'Wrong product received') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>Additional Details</h3>
                <textarea 
                  value={comments} 
                  onChange={(e) => setComments(e.target.value)} 
                  placeholder="Please tell us more about the issue..."
                  required={reason === 'Other'}
                  rows={4}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem', resize: 'vertical' }}
                />
              </div>

              {(reason === 'Product received damaged' || reason === 'Wrong product received') && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>Upload Photos (Optional)</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '12px' }}>Please upload clear photos of the damaged or wrong product.</p>
                  
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {evidence.map((ev, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <img src={ev} alt={`Evidence ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button" 
                          onClick={() => removeEvidence(idx)}
                          style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {evidence.length < 3 && (
                      <label style={{ width: '100px', height: '100px', borderRadius: '8px', border: '2px dashed #d1d5db', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', backgroundColor: '#f9fafb' }}>
                        <Upload size={24} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '0.75rem' }}>Upload</span>
                        <input type="file" accept="image/*" multiple onChange={handleMediaUpload} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conditions */}
          <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#374151' }}>Return Conditions</h3>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
              Please make sure the jewellery is unused/unworn and returned with its original packaging and accessories. We will arrange a pickup or provide shipping instructions upon approval.
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={confirmed} 
                onChange={(e) => setConfirmed(e.target.checked)} 
                required
                style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#000000' }} 
              />
              <span style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.4' }}>
                I confirm that the product is unused/unworn and will be returned with the original packaging.
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            style={{
              padding: '16px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '1.1rem', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1, transition: 'background 0.2s', marginTop: '16px'
            }}
          >
            {submitting ? 'Submitting...' : 'SUBMIT RETURN REQUEST'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ReturnRequestPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ReturnRequestForm />
    </Suspense>
  );
}
