import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Package, X, Check, Truck, Download, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Filters
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [shippingAmount, setShippingAmount] = useState('');

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/returns`);
      setReturns(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load returns');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus, extraData = {}) => {
    setStatusUpdating(true);
    try {
      const res = await axios.put(`${API_URL}/api/returns/${id}/status`, {
        status: newStatus,
        ...extraData
      });
      toast.success(`Return marked as ${newStatus}`);
      setReturns(returns.map(r => r._id === id ? res.data : r));
      setSelectedReturn(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update return status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleInitiateRefund = async (id) => {
    setStatusUpdating(true);
    try {
      const res = await axios.post(`${API_URL}/api/returns/${id}/refund`);
      toast.success('Refund initiated successfully');
      setReturns(returns.map(r => r._id === id ? res.data : r));
      setSelectedReturn(res.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to initiate refund');
    } finally {
      setStatusUpdating(false);
    }
  };

  const filteredReturns = returns.filter(r => {
    if (filter !== 'All' && r.returnStatus !== filter) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        r.returnId.toLowerCase().includes(lowerSearch) ||
        r.customerEmail.toLowerCase().includes(lowerSearch) ||
        r.customerName.toLowerCase().includes(lowerSearch)
      );
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Return Management</h2>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input 
          type="text"
          placeholder="Search by ID, Name or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '300px' }}
        />
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        >
          <option value="All">All Returns</option>
          <option value="Requested">Requested</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="In Transit">In Transit</option>
          <option value="Received">Received</option>
          <option value="Inspection Complete">Inspection Complete</option>
          <option value="Refund Processing">Refund Processing</option>
          <option value="Refund Completed">Refund Completed</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 24px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Return ID</th>
                <th style={{ padding: '12px 24px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Customer</th>
                <th style={{ padding: '12px 24px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Reason</th>
                <th style={{ padding: '12px 24px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Refund Amt</th>
                <th style={{ padding: '12px 24px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px 24px', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>{r.returnId}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '0.875rem', color: '#111827' }}>{r.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{r.customerEmail}</div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#374151' }}>{r.reason}</td>
                  <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>₹{r.refundAmount.toLocaleString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500',
                      backgroundColor: r.returnStatus === 'Requested' ? '#fef3c7' : 
                                      r.returnStatus === 'Rejected' ? '#fee2e2' : 
                                      r.returnStatus === 'Refund Completed' ? '#dcfce7' : '#e0e7ff',
                      color: r.returnStatus === 'Requested' ? '#92400e' : 
                             r.returnStatus === 'Rejected' ? '#991b1b' : 
                             r.returnStatus === 'Refund Completed' ? '#166534' : '#3730a3'
                    }}>
                      {r.returnStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button 
                      onClick={() => {
                         setSelectedReturn(r);
                         setRejectionReason('');
                         setTrackingNumber('');
                         setCourier('');
                      }}
                      style={{ padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No returns found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Return Details Modal */}
      {selectedReturn && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Return Details: {selectedReturn.returnId}</h2>
              <button onClick={() => setSelectedReturn(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#6b7280" /></button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Customer Info</h3>
                  <p style={{ margin: '0 0 4px', fontWeight: '500' }}>{selectedReturn.customerName}</p>
                  <p style={{ margin: 0, color: '#4b5563' }}>{selectedReturn.customerEmail}</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Return Info</h3>
                  <p style={{ margin: '0 0 4px' }}>Requested: {new Date(selectedReturn.requestedAt).toLocaleString()}</p>
                  <p style={{ margin: 0 }}>Status: <strong>{selectedReturn.returnStatus}</strong></p>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>Items to Return</h3>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                  {selectedReturn.returnItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: idx !== selectedReturn.returnItems.length - 1 ? '16px' : 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontWeight: '500' }}>{item.name}</p>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Qty: {item.qty} | Paid: ₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  <p style={{ fontSize: '1.25rem', margin: 0 }}>Total Refund: <strong>₹{selectedReturn.refundAmount.toLocaleString()}</strong></p>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>Reason & Comments</h3>
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <p style={{ fontWeight: '500', margin: '0 0 8px' }}>{selectedReturn.reason}</p>
                  {selectedReturn.comments && <p style={{ color: '#4b5563', margin: 0 }}>"{selectedReturn.comments}"</p>}
                </div>
              </div>

              {selectedReturn.evidence && selectedReturn.evidence.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>Evidence Photos</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {selectedReturn.evidence.map((ev, idx) => (
                      <a key={idx} href={ev} target="_blank" rel="noreferrer">
                        <img src={ev} alt="Evidence" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Actions based on Status */}
              <div style={{ backgroundColor: '#f3f4f6', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Admin Actions</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  
                  {selectedReturn.returnStatus === 'Requested' && (
                    <>
                      <button 
                        disabled={statusUpdating}
                        onClick={() => handleStatusUpdate(selectedReturn._id, 'Approved')}
                        style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                      >
                        Approve Return
                      </button>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Rejection Reason" 
                          value={rejectionReason} 
                          onChange={(e) => setRejectionReason(e.target.value)}
                          style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                        />
                        <button 
                          disabled={statusUpdating || !rejectionReason}
                          onClick={() => handleStatusUpdate(selectedReturn._id, 'Rejected', { rejectionReason })}
                          style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', opacity: !rejectionReason ? 0.5 : 1 }}
                        >
                          Reject
                        </button>
                      </div>
                    </>
                  )}

                  {selectedReturn.returnStatus === 'Approved' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="text" placeholder="Courier Name" value={courier} onChange={(e) => setCourier(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', flex: 1 }} />
                        <input type="text" placeholder="Tracking Number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', flex: 1 }} />
                        <button 
                          disabled={statusUpdating || !trackingNumber || !courier}
                          onClick={() => handleStatusUpdate(selectedReturn._id, 'In Transit', { trackingNumber, courier })}
                          style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                        >
                          Mark In Transit
                        </button>
                      </div>
                      <button 
                          disabled={statusUpdating}
                          onClick={() => handleStatusUpdate(selectedReturn._id, 'Received')}
                          style={{ padding: '8px 16px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', alignSelf: 'flex-start' }}
                        >
                          Mark Received (Skip Transit)
                      </button>
                    </div>
                  )}

                  {selectedReturn.returnStatus === 'In Transit' && (
                    <button 
                      disabled={statusUpdating}
                      onClick={() => handleStatusUpdate(selectedReturn._id, 'Received')}
                      style={{ padding: '8px 16px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      Mark Received
                    </button>
                  )}

                  {selectedReturn.returnStatus === 'Received' && (
                    <button 
                      disabled={statusUpdating}
                      onClick={() => handleStatusUpdate(selectedReturn._id, 'Inspection Complete')}
                      style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      Mark Inspection Complete
                    </button>
                  )}

                  {selectedReturn.returnStatus === 'Inspection Complete' && (
                    <div style={{ border: '1px solid #f59e0b', backgroundColor: '#fef3c7', padding: '16px', borderRadius: '8px', width: '100%' }}>
                      <p style={{ margin: '0 0 12px 0', color: '#92400e', fontWeight: '500' }}>Ready to initiate refund of ₹{selectedReturn.refundAmount.toLocaleString()}</p>
                      {selectedReturn.razorpayPaymentId ? (
                         <button 
                          disabled={statusUpdating}
                          onClick={() => handleInitiateRefund(selectedReturn._id)}
                          style={{ padding: '12px 24px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <BanknoteIcon /> Initiate Razorpay Refund
                        </button>
                      ) : (
                         <p style={{ color: '#ef4444', margin: 0 }}>No Razorpay Payment ID found for this order. Cannot auto-refund.</p>
                      )}
                    </div>
                  )}

                  {(selectedReturn.returnStatus === 'Refund Processing' || selectedReturn.returnStatus === 'Refund Completed') && (
                     <div style={{ backgroundColor: '#dcfce7', padding: '16px', borderRadius: '8px', border: '1px solid #86efac', width: '100%' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#166534' }}>Refund Information</h4>
                        <p style={{ margin: '0 0 4px', color: '#15803d' }}>Status: <strong>{selectedReturn.returnStatus}</strong></p>
                        <p style={{ margin: '0 0 4px', color: '#15803d' }}>Razorpay Refund ID: {selectedReturn.razorpayRefundId}</p>
                        {selectedReturn.refundInitiatedAt && <p style={{ margin: '0 0 4px', color: '#15803d' }}>Initiated: {new Date(selectedReturn.refundInitiatedAt).toLocaleString()}</p>}
                        {selectedReturn.refundCompletedAt && <p style={{ margin: 0, color: '#15803d' }}>Completed: {new Date(selectedReturn.refundCompletedAt).toLocaleString()}</p>}
                     </div>
                  )}

                  {selectedReturn.returnStatus === 'Refund Failed' && (
                     <div style={{ backgroundColor: '#fee2e2', padding: '16px', borderRadius: '8px', border: '1px solid #fca5a5', width: '100%' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#991b1b' }}>Refund Failed</h4>
                        <p style={{ margin: '0 0 12px', color: '#7f1d1d' }}>The automated refund attempt failed. Check Razorpay dashboard.</p>
                        <button 
                          disabled={statusUpdating}
                          onClick={() => handleInitiateRefund(selectedReturn._id)}
                          style={{ padding: '8px 16px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Retry Razorpay Refund
                        </button>
                     </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon
const BanknoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
);

export default Returns;
