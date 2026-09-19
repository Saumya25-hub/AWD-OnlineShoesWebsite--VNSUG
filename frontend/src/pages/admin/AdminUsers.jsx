import React, { useState, useEffect } from 'react';
import { Users, Trash2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user account "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/auth/users/${id}`);
      setMessage({ text: `User "${name}" deleted successfully.`, type: 'success' });
      fetchUsers();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to delete user',
        type: 'danger'
      });
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Registered Users ({users.length})</h2>
          <p>List of registered student & customer accounts on the store</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="card-box">
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u._id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td style={{ maxWidth: '200px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {u.address || '—'}
                    </td>
                    <td>
                      {u.role === 'admin' ? (
                        <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                          Admin
                        </span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                          Customer
                        </span>
                      )}
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="btn btn-sm btn-danger"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
