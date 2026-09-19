import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="hero-box">
        <span className="badge-week">User Session Active</span>
        <h1>Welcome, {user.name}!</h1>
        <p>This screen confirms successful customer authentication and session state for Week 1.</p>
      </div>

      <div className="info-card">
        <h3>User Account Details (from <code>users</code> collection)</h3>
        <table className="user-info-table">
          <tbody>
            <tr>
              <th>User ID:</th>
              <td><code>{user._id}</code></td>
            </tr>
            <tr>
              <th>Full Name:</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>Email Address:</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Mobile Number:</th>
              <td>{user.phone || 'N/A'}</td>
            </tr>
            <tr>
              <th>Role:</th>
              <td><span style={{ textTransform: 'capitalize' }}>{user.role}</span></td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleLogout} className="btn btn-danger" style={{ width: 'auto', padding: '10px 20px' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
