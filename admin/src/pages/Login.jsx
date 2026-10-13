import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { setAdminSession } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'reset'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.expired) {
      toast('Session locked after 24 hours. Please log in.', {
        icon: '🔒',
        duration: 5000,
      });
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/dashboard/login`, {
        email,
        password
      });
      setAdminSession(data.token);
      toast.success('Logged in successfully');
      navigate(location.state?.from || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/dashboard/request-reset`);
      toast.success(res.data.message || 'OTP sent successfully');
      setMode('reset');
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/dashboard/set-password`, {
        otp,
        newPassword
      });
      setAdminSession(data.token);
      toast.success(data.message || 'Password updated and logged in');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Kiara Jewels Admin</h1>
          <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px', lineHeight: 1.5 }}>
            {mode === 'login' && 'Sign in to manage your store'}
            {mode === 'forgot' && 'Request an OTP to reset password'}
            {mode === 'reset' && 'Set your new password'}
          </p>
        </div>
        
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kiarajewels.co@gmail.com"
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button 
              type="button"
              onClick={() => setMode('forgot')}
              style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginTop: '4px' }}
            >
              First time setup / Forgot Password?
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
              Clicking below will send a secure 6-digit OTP to <strong>kiarajewels.co@gmail.com</strong>.
            </p>
            <button 
              onClick={handleRequestReset}
              disabled={loading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <button 
              type="button"
              onClick={() => setMode('login')}
              style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginTop: '4px' }}
            >
              Back to Login
            </button>
          </div>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleSetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>6-Digit OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                placeholder="000000"
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '20px', letterSpacing: '4px', textAlign: 'center' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
            >
              {loading ? 'Saving...' : 'Set Password & Login'}
            </button>
            <button 
              type="button"
              onClick={() => setMode('login')}
              style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginTop: '4px' }}
            >
              Cancel
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
