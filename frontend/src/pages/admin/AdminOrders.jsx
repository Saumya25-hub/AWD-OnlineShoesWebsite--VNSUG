import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, AlertCircle, MapPin, Calendar, User } from 'lucide-react';
import api, { UPLOADS_BASE_URL } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setMessage({ text: `Order status updated to "${newStatus}"`, type: 'success' });
      fetchOrders();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update order status',
        type: 'danger'
      });
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Order Management</h2>
          <p>Review customer footwear orders, items ordered, delivery addresses, and update fulfillment status</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="card-box" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No customer orders placed yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order, index) => (
            <div key={order._id} className="card-box" style={{ padding: '20px' }}>
              {/* Order Top Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '14px',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order No.</div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>#{index + 1}</strong>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer</div>
                  <strong>{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    ({order.user?.email || order.shippingAddress?.phone})
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date Placed</div>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </strong>
                  <div style={{ marginTop: '4px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: order.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                        color: order.paymentStatus === 'Paid' ? '#15803d' : '#b45309'
                      }}
                    >
                      {order.paymentStatus === 'Paid' ? '✓ Paid' : 'Pending'} ({order.paymentMethod || 'Razorpay'})
                    </span>
                  </div>
                  {order.razorpayPaymentId && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                      {order.razorpayPaymentId}
                    </div>
                  )}
                </div>

                {/* Status Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Order Status:
                  </label>
                  <select
                    className="form-control"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.items.map((item, idx) => {
                  const imageSrc = item.image?.startsWith('http')
                    ? item.image
                    : `${UPLOADS_BASE_URL}/${item.image}`;

                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={imageSrc}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', background: '#f1f5f9' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50x50?text=Shoe';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Size: <strong>{item.size}</strong> | Qty: <strong>{item.quantity}</strong> | Unit Price: ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Address */}
              {order.shippingAddress && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--border)', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  <strong>Shipping Address:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode} | Phone: {order.shippingAddress.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
