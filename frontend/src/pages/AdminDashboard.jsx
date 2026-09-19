import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    navigate('/admin-login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="container">
      <div className="hero-box" style={{ borderLeft: '5px solid #1e293b' }}>
        <span className="badge-week" style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }}>
          Administrator Session Active
        </span>
        <h1>Admin Control Panel (Week 1)</h1>
        <p>This screen confirms administrator authentication against the <code>admins</code> collection for Week 1.</p>
      </div>

      <div className="info-card">
        <h3>Admin Account Details (from <code>admins</code> collection)</h3>
        <table className="user-info-table">
          <tbody>
            <tr>
              <th>Admin ID:</th>
              <td><code>{user._id}</code></td>
            </tr>
            <tr>
              <th>Username:</th>
              <td>{user.username}</td>
            </tr>
            <tr>
              <th>Admin Email:</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Role:</th>
              <td><span style={{ textTransform: 'capitalize' }}>{user.role}</span></td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleLogout} className="btn btn-danger" style={{ width: 'auto', padding: '10px 20px' }}>
            Admin Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
