import React, { useState, useEffect } from 'react';
import { Star, Trash2, CheckCircle, AlertCircle, Calendar, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { UPLOADS_BASE_URL } from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/admin/all');
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;

    try {
      await api.delete(`/reviews/admin/${id}`);
      setAlert({ text: 'Review deleted successfully.', type: 'success' });
      fetchReviews();
    } catch (err) {
      setAlert({ text: 'Failed to delete review.', type: 'danger' });
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Product Reviews & Ratings Management ({reviews.length})</h2>
          <p>Inspect which customer submitted which review for which shoe, along with star ratings and feedback</p>
        </div>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{alert.text}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading shoe reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="card-box" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No customer reviews submitted yet.</p>
        </div>
      ) : (
        <div className="card-box" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Review ID</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Shoe / Product</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Customer</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Rating</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Feedback / Comment</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => {
                  const prodImage = rev.product?.image?.startsWith('http')
                    ? rev.product.image
                    : `${UPLOADS_BASE_URL}/${rev.product?.image}`;

                  return (
                    <tr key={rev._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                        #{rev._id.substring(rev._id.length - 6).toUpperCase()}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        {rev.product ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={prodImage}
                              alt={rev.product.name}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40?text=Shoe'; }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--primary)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {rev.product.name}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                                {rev.product.brand} • ₹{rev.product.price?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Deleted Product</span>
                        )}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {rev.userName || rev.user?.name || 'Customer'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {rev.user?.email || 'N/A'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#fef3c7', padding: '3px 8px', borderRadius: '12px' }}>
                          <Star size={13} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontWeight: 800, color: '#b45309', fontSize: '0.84rem' }}>
                            {rev.rating} / 5
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', maxWidth: '280px' }}>
                        <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.4, wordBreak: 'break-word' }}>
                          "{rev.comment}"
                        </p>
                      </td>

                      <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(rev._id)}
                          className="btn btn-sm btn-danger"
                          title="Delete Review"
                          style={{ padding: '6px 10px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
