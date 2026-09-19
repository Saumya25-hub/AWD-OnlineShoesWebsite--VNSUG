import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CaptchaBox from '../components/CaptchaBox';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaData, setCaptchaData] = useState({ captchaToken: '', captchaInput: '' });
  const { login, logout, loading, error, setError } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    if (!captchaData.captchaInput) {
      setError('Please complete the security CAPTCHA verification.');
      return;
    }

    const res = await login(email, password, captchaData.captchaInput, captchaData.captchaToken);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        logout();
        setError('Access Denied. Your account does not have administrator privileges.');
      }
    }
  };

  const handleFillAdminDemo = () => {
    setEmail('admin@shoestore.com');
    setPassword('admin123');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090d16',
        backgroundImage: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(37, 99, 235, 0.15), rgba(255, 255, 255, 0))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        color: '#f8fafc'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          padding: '36px 32px'
        }}
      >
        {/* Admin Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: '#38bdf8'
            }}
          >
            <ShieldCheck size={32} />
          </div>

          <div
            style={{
              display: 'inline-block',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '4px 10px',
              borderRadius: '999px',
              fontWeight: 700,
              marginBottom: '10px'
            }}
          >
            Store Administration Portal
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px 0' }}>
            Admin Console Login
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            Restricted access for authorized personnel only
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.88rem',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '6px'
              }}
            >
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                type="email"
                required
                placeholder="admin@shoestore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '6px'
              }}
            >
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
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
              padding: '13px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
            }}
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}</span>
          </button>
        </form>

        {/* Demo Admin Shortcut */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #1f2937' }}>
          <button
            type="button"
            onClick={handleFillAdminDemo}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #334155',
              backgroundColor: 'rgba(51, 65, 85, 0.5)',
              color: '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ⚡ Auto-Fill Admin Demo Credentials
          </button>
        </div>

        {/* Back to Client Store */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0
            }}
          >
            <ArrowLeft size={14} />
            <span>Go to Customer Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
