import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Feedback = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Auto-fill logged-in user details whenever user is available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Post to contactmessages collection via existing /api/contact endpoint
      const res = await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        subject: 'Customer Feedback',
        message: formData.message
      });
      setSuccess(res.data.message || 'Thank you! Your feedback has been submitted successfully.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding" style={{ maxWidth: '680px' }}>
      <div className="section-header" style={{ textAlign: 'center', display: 'block', marginBottom: '28px' }}>
        <h2>Customer Feedback</h2>
        <p>We value your suggestions and feedback to improve our shoe collection and service.</p>
      </div>

      <div className="card-box">
        {success && (
          <div className="alert alert-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '10px 14px',
            borderRadius: 'var(--radius)',
            fontSize: '0.85rem',
            color: '#1e40af',
            marginBottom: '18px'
          }}>
            <CheckCircle size={16} color="#2563eb" />
            <span>Logged in as <strong>{user.name}</strong> ({user.email}). Details auto-filled below.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Feedback / Message *</label>
            <textarea
              name="message"
              className="form-control"
              required
              rows={5}
              placeholder="Write your feedback, suggestions, or comments here..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '12px' }}
          >
            <Send size={16} />
            <span>{loading ? 'Submitting Feedback...' : 'Submit Feedback'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
