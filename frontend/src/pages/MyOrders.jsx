import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import api, { UPLOADS_BASE_URL } from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/myorders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-delivered">Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-shipped">Shipped</span>;
      case 'Processing':
        return <span className="badge badge-processing">Processing</span>;
      case 'Cancelled':
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="section-header">
        <div>
          <h2>My Shoe Orders</h2>
          <p>View and track the status of all your placed footwear orders</p>
        </div>
        <Link to="/products" className="btn btn-sm btn-outline">
          <ShoppingBag size={14} /> Shop More Shoes
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card-box" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>
            No Orders Placed Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            You haven't placed any shoe orders yet. Explore our shoe collection to get started.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Shoes
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} className="card-box" style={{ padding: '20px' }}>
              {/* Order Card Header */}
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
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Order ID:</div>
                  <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{order._id}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Calendar size={15} />
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  {getStatusBadge(order.status)}
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

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Amount: </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                  {order.razorpayPaymentId && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                      Txn: {order.razorpayPaymentId}
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items.map((item, idx) => {
                  const imageSrc = item.image?.startsWith('http')
                    ? item.image
                    : `${UPLOADS_BASE_URL}/${item.image}`;

                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={imageSrc}
                        alt={item.name}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#f1f5f9' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/60x60?text=Shoe';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Size: <strong>{item.size}</strong> | Qty: <strong>{item.quantity}</strong> | Price: ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Address Summary */}
              {order.shippingAddress && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} />
                  <span>
                    <strong>Delivering to:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode} (Ph: {order.shippingAddress.phone})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
