import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, KeyRound, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CaptchaBox from '../components/CaptchaBox';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaData, setCaptchaData] = useState({ captchaToken: '', captchaInput: '' });
  const { login, loading, error, setError } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Check redirect path (e.g. from checkout)
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    if (!captchaData.captchaInput) {
      setError('Please enter the CAPTCHA code');
      return;
    }

    const res = await login(email, password, captchaData.captchaInput, captchaData.captchaToken);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else if (redirect === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/');
      }
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@shoestore.com');
      setPassword('admin123');
    } else {
      setEmail('rahul@gmail.com');
      setPassword('user123');
    }
  };

  return (
    <div className="container section-padding" style={{ maxWidth: '480px' }}>
      <div className="card-box" style={{ padding: '36px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👟</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Login to your StepUp Footwear account
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <CaptchaBox
            value={captchaData.captchaInput}
            onChange={setCaptchaData}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '10px' }}
          >
            <LogIn size={18} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Viva Shortcuts */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
            Demo / Project Evaluation Credentials:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('user')}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem' }}
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="btn btn-sm btn-dark"
              style={{ fontSize: '0.78rem' }}
            >
              Store Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
