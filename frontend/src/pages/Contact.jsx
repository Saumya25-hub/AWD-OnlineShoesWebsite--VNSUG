import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
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
      const res = await api.post('/contact', formData);
      setSuccess(res.data.message || 'Your inquiry has been submitted successfully!');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit contact message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding">
      <div className="section-header">
        <div>
          <h2>Contact Customer Support</h2>
          <p>Have questions about shoe sizing, bulk orders, or your current delivery? Get in touch!</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
        {/* Contact Form */}
        <div className="card-box">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--primary)' }}>
            Send Us a Message
          </h3>

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

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  required
                  placeholder="e.g. Priyanshu Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                required
                placeholder="e.g. Size exchange inquiry"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                name="message"
                className="form-control"
                required
                rows={5}
                placeholder="Write your query or feedback here..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ marginTop: '8px' }}
            >
              <Send size={16} />
              <span>{loading ? 'Submitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div>
          <div className="card-box" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--primary)' }}>
              Store Contact Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div className="feature-icon-wrap"><MapPin size={18} /></div>
                <div>
                  <strong>Store Location</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    104, Fashion Square, Ring Road, Surat, Gujarat - 395007, India
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div className="feature-icon-wrap"><Phone size={18} /></div>
                <div>
                  <strong>Phone Support</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    +91 98765 43210 (Mon - Sat, 9 AM - 6 PM)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div className="feature-icon-wrap"><Mail size={18} /></div>
                <div>
                  <strong>Email Inquiries</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    support@stepupfootwear.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
