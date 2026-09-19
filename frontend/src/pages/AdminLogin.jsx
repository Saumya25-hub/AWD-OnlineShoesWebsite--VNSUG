import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usernameOrEmail || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(usernameOrEmail, password);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-wrapper" style={{ borderTop: '4px solid #1e293b' }}>
        <h2 className="auth-title">Admin Login</h2>
        <p className="auth-subtitle">Week 1 - Administrator Portal</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username or Admin Email</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="e.g. admin or admin@shoes.com"
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ backgroundColor: '#1e293b' }} disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Login as Admin'}
          </button>
        </form>

        <div className="auth-footer">
          Customer login? <Link to="/login">Back to User Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
