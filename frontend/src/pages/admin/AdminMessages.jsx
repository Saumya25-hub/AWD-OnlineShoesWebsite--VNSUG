import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Mail, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/contact/${id}`);
      setAlert({ text: 'Message deleted successfully.', type: 'success' });
      fetchMessages();
    } catch (err) {
      setAlert({ text: 'Failed to delete message.', type: 'danger' });
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Customer Inquiries & Messages ({messages.length})</h2>
          <p>Customer feedback, sizing questions, and inquiries submitted via the Contact Us form</p>
        </div>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{alert.text}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading inquiries...</p>
      ) : messages.length === 0 ? (
        <div className="card-box" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No customer inquiries received yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div key={msg._id} className="card-box" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                    {msg.subject}
                  </h4>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    <span><strong>From:</strong> {msg.name}</span>
                    <span>•</span>
                    <a href={`mailto:${msg.email}`} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    {new Date(msg.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="btn btn-sm btn-danger"
                    title="Delete Message"
                    style={{ padding: '6px 10px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
