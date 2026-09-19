import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <div className="navbar">
        <Link to="/" className="brand-logo">
          Shoe<span>Store</span> <small style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>(Week 1)</small>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <li><Link to="/admin-dashboard">Admin Panel ({user.username})</Link></li>
              ) : (
                <li><Link to="/dashboard">My Account ({user.name})</Link></li>
              )}
              <li>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">User Login</Link></li>
              <li><Link to="/register">User Register</Link></li>
              <li><Link to="/admin-login" className="btn-nav">Admin Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
