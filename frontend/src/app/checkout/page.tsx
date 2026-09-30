'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, subtotal, discountAmount, isFirstOrder, clearCart } = useCart();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  
  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false); // Validated new address

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    house: '',
    floor: '',
    area: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    type: 'Home'
  });

  // Fetch Saved Addresses
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.email}/addresses`)
        .then(res => {
          setSavedAddresses(res.data);
          if (res.data.length > 0) {
            setSelectedAddressId(res.data[0]._id);
            setShowNewAddressForm(false);
          } else {
            setShowNewAddressForm(true);
          }
        })
        .catch(err => {
          console.error("Failed to load addresses", err);
          setShowNewAddressForm(true);
        });
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.firstName || !address.mobile || !address.house || !address.pincode || !address.city || !address.state) {
      toast.error('Please fill all required fields');
      return;
    }
    setAddressSaved(true);
  };

  const handleDeleteAddress = (id: string) => {
    toast((t) => (
      <div>
        <p style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 'bold' }}>Are you sure you want to delete this address?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            style={{ padding: '6px 12px', background: '#27302E', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session?.user?.email}/addresses/${id}`);
                setSavedAddresses(res.data);
                if (selectedAddressId === id) {
                  setSelectedAddressId(res.data.length > 0 ? res.data[0]._id : null);
                  if (res.data.length === 0) setShowNewAddressForm(true);
                }
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
    ), { duration: Infinity, style: { border: '1px solid #27302E', padding: '16px' } });
  };

  const loadRazorpay = async () => {
    if (showNewAddressForm && !addressSaved) {
      toast.error('Please save your new address first.');
      return;
    }
    if (!showNewAddressForm && !selectedAddressId) {
      toast.error('Please select a delivery address.');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setLoading(true);

    try {
      let finalAddress = { ...address };

      // If using a new address and logged in, save it to profile
      if (showNewAddressForm && session?.user?.email) {
         try {
           const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.email}/addresses`, { address });
           setSavedAddresses(res.data);
         } catch(e) {
           console.error("Failed to save address to profile");
         }
      } else if (!showNewAddressForm && selectedAddressId) {
         const selected = savedAddresses.find(a => a._id === selectedAddressId);
         if (selected) {
           finalAddress = selected;
         }
      }
      
      const shippingAddress = {
        firstName: finalAddress.firstName,
        lastName: finalAddress.lastName || '',
        mobile: finalAddress.mobile,
        email: session?.user?.email || '',
        house: finalAddress.house,
        floor: finalAddress.floor || '',
        area: finalAddress.area,
        landmark: finalAddress.landmark || '',
        city: finalAddress.city,
        state: finalAddress.state,
        postalCode: finalAddress.pincode,
        country: 'India',
        type: finalAddress.type || 'Home'
      };

      // 1. Create order on backend (amount will be securely calculated on the server)
      const { data: orderData } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/orders`, {
        userEmail: session?.user?.email,
        orderItems: cartItems.map(item => ({ product: item._id, qty: item.quantity })),
        currency: 'INR',
        receipt: `receipt_${new Date().getTime()}`
      });

      // 2. Setup Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Kiara Jewels",
        description: "Secure Payment",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.status === 200) {
              // 4. Save order to database
              await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
                userEmail: session?.user?.email,
                orderItems: cartItems.map(item => ({
                  name: item.name,
                  qty: item.quantity,
                  image: item.image,
                  price: item.price,
                  product: item._id
                })),
                shippingAddress,
                paymentMethod: 'Razorpay',
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: orderData.backendCalculatedTotal || cartTotal,
                isPaid: true,
                paidAt: new Date(),
                paymentResult: {
                  id: response.razorpay_payment_id,
                  status: 'paid',
                  update_time: new Date().toISOString(),
                  email_address: session?.user?.email
                }
              });

              toast.success('Payment Successful and Order Placed!');
              if (clearCart) clearCart();
              window.location.href = '/';
            }
          } catch (err) {
            toast.error('Payment verification failed.');
            console.error(err);
          }
        },
        prefill: {
          name: finalAddress.firstName,
          email: session?.user?.email || '',
          contact: finalAddress.mobile
        },
        theme: {
          color: "#000000"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        toast.error('Payment Failed: ' + response.error.description);
        console.error(response.error);
      });
      
      paymentObject.open();
    } catch (error) {
      console.error('Error in payment flow', error);
      toast.error('Could not initiate payment. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    <div className="checkout-container">
      <h1 className="checkout-title">Secure Checkout</h1>
      
      <div className="checkout-layout">
        <div className="checkout-form-section">
          <div className="checkout-section-header">
            <span className="step-number">1</span>
            <h2>Delivery Address</h2>
          </div>
          
          {/* Saved Addresses List */}
          {savedAddresses.length > 0 && !showNewAddressForm && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr._id;
                return (
                  <div 
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    style={{ 
                      padding: '20px', 
                      border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#FBFAF7' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#4b5563' }}>
                          {addr.type || 'Home'}
                        </span>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#27302E', wordBreak: 'break-word' }}>{addr.firstName} {addr.lastName}</h3>
                      </div>
                      {isSelected && (
                        <div style={{ color: '#000000', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '0.875rem', flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>check_circle</span>
                          <span style={{ display: 'inline-block' }}>Selected</span>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>
                      {addr.house}, {addr.floor && `${addr.floor},`} {addr.area}
                    </p>
                    <p style={{ margin: '0 0 12px 0', color: '#4b5563', lineHeight: '1.5' }}>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p style={{ margin: '0 0 8px 0', color: '#4b5563', fontWeight: '500' }}>
                      +91 {addr.mobile}
                    </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedAddressId(addr._id); }}
                        style={{ padding: '8px 16px', backgroundColor: isSelected ? '#000000' : '#ffffff', color: isSelected ? '#ffffff' : '#000000', border: '1px solid #000000', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', flex: '1 1 auto', textAlign: 'center' }}
                      >
                        {isSelected ? 'Using this address' : 'Use this address'}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }}
                        style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', fontWeight: '500', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              
              <button 
                onClick={() => setShowNewAddressForm(true)}
                style={{ padding: '16px', border: '2px dashed #d1d5db', borderRadius: '8px', backgroundColor: 'transparent', color: '#4b5563', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined">add</span>
                Add New Address
              </button>
            </div>
          )}

          {/* New Address Form */}
          {showNewAddressForm && (
            <form className={`checkout-form ${addressSaved ? 'form-disabled' : ''}`} onSubmit={saveAddress}>
              {savedAddresses.length > 0 && (
                <button 
                  type="button" 
                  onClick={() => setShowNewAddressForm(false)}
                  style={{ marginBottom: '24px', background: 'none', border: 'none', color: '#4b5563', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>arrow_back</span>
                  Back to saved addresses
                </button>
              )}

              <h3 className="form-section-title">Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" name="firstName" value={address.firstName} onChange={handleInputChange} required disabled={addressSaved} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={address.lastName} onChange={handleInputChange} disabled={addressSaved} />
                </div>
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden', backgroundColor: addressSaved ? '#f3f4f6' : '#fff' }}>
                  <span style={{ padding: '12px', backgroundColor: '#f3f4f6', color: '#6b7280', borderRight: '1px solid #d1d5db', fontWeight: '500' }}>+91</span>
                  <input type="tel" name="mobile" value={address.mobile} 
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      setAddress(prev => ({ ...prev, mobile: val.slice(0, 10) }));
                    }} 
                    required disabled={addressSaved} 
                    style={{ border: 'none', borderRadius: '0', flex: 1, padding: '12px', outline: 'none', backgroundColor: 'transparent' }} 
                  />
                </div>
              </div>

              <h3 className="form-section-title" style={{ marginTop: '32px' }}>Address Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>House / Flat / Building *</label>
                  <input type="text" name="house" value={address.house} onChange={handleInputChange} required disabled={addressSaved} />
                </div>
                <div className="form-group">
                  <label>Floor Number</label>
                  <input type="text" name="floor" value={address.floor} onChange={handleInputChange} disabled={addressSaved} />
                </div>
              </div>
              
              <div className="form-group">
                <label>Area / Street / Locality / Sector *</label>
                <input type="text" name="area" value={address.area} onChange={handleInputChange} required disabled={addressSaved} />
              </div>
              
              <div className="form-group">
                <label>Landmark</label>
                <input type="text" name="landmark" value={address.landmark} onChange={handleInputChange} disabled={addressSaved} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pincode *</label>
                  <input type="text" name="pincode" value={address.pincode} onChange={handleInputChange} required disabled={addressSaved} />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" name="city" value={address.city} onChange={handleInputChange} required disabled={addressSaved} />
                </div>
              </div>
              
              <div className="form-group">
                <label>State *</label>
                <select name="state" value={address.state} onChange={handleInputChange} required disabled={addressSaved}>
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group address-type-group">
                <label>This is the address of:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="type" value="Home" checked={address.type === 'Home'} onChange={handleInputChange} disabled={addressSaved} />
                    Home
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="type" value="Office" checked={address.type === 'Office'} onChange={handleInputChange} disabled={addressSaved} />
                    Office
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="type" value="Others" checked={address.type === 'Others'} onChange={handleInputChange} disabled={addressSaved} />
                    Others
                  </label>
                </div>
              </div>

              {!addressSaved ? (
                <button type="submit" className="btn-add-address">Save Address & Continue</button>
              ) : (
                <div className="address-saved-msg">
                  <span className="material-symbols-outlined">check_circle</span>
                  Address Saved successfully.
                  <button type="button" onClick={() => setAddressSaved(false)} className="btn-edit-address">Edit</button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Right Side: Order Summary & Payment */}
        <div className="checkout-summary-section">
          <div className="checkout-section-header">
            <span className="step-number">2</span>
            <h2>Order Summary</h2>
          </div>
          
          <div className="checkout-summary-card">
            {cartItems.length === 0 ? (
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your cart is empty.</p>
            ) : (
              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="checkout-item">
                    <img src={item.image} alt={item.name} className="checkout-item-img" />
                    <div className="checkout-item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="checkout-item-price">
                      Rs. {item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="checkout-total-row" style={{ color: '#10b981' }}>
                  <span>Discount {isFirstOrder ? '(First Order 10%)' : ''}</span>
                  <span>- Rs. {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="checkout-total-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="checkout-total-divider"></div>
              <div className="checkout-total-final">
                <span>Total</span>
                <span>Rs. {cartTotal}</span>
              </div>
            </div>

            <button 
              onClick={loadRazorpay} 
              disabled={loading || (showNewAddressForm && !addressSaved) || (!showNewAddressForm && !selectedAddressId) || cartItems.length === 0}
              className={`btn-proceed-payment ${((showNewAddressForm && !addressSaved) || (!showNewAddressForm && !selectedAddressId) || cartItems.length === 0) ? 'btn-disabled' : ''}`}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
            <p className="payment-note">Secure payment gateway powered by Razorpay.</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

