import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CaptchaBox from '../components/CaptchaBox';

const AdminLogin = () => {
  // Hardcoded / Pre-filled credentials as requested
  const [email, setEmail] = useState('admin@shoestore.com');
  const [password, setPassword] = useState('admin123');
  const [captchaData, setCaptchaData] = useState({ captchaToken: '', captchaInput: '' });
  const { login, logout, loading, error, setError } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!captchaData.captchaInput) {
      setError('Please enter the CAPTCHA code.');
      return;
    }

    // Support both 'admin' and 'admin@shoestore.com'
    let loginEmail = email.trim();
    if (loginEmail === 'admin') {
      loginEmail = 'admin@shoestore.com';
    }

    const res = await login(loginEmail, password, captchaData.captchaInput, captchaData.captchaToken);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        logout();
        setError('Access Denied. Only administrators can login here.');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'inherit'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '32px 28px'
        }}
      >
        {/* Simple Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
            Admin Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
            Online Shoes Store - Admin Portal
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}
          >
            {error}
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px'
              }}
            >
              Email / Username:
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px'
              }}
            >
              Password:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <CaptchaBox
              value={captchaData.captchaInput}
              onChange={setCaptchaData}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
