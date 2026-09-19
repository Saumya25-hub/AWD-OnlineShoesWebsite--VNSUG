import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

// Helper to load official Razorpay checkout script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Surat',
    postalCode: '395007'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || ''
      }));
    }
  }, [user, navigate]);

  if (cartItems.length === 0) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>No Items to Checkout</h2>
        <p style={{ color: 'var(--text-muted)', margin: '14px 0' }}>Your shopping cart is empty.</p>
        <Link to="/products" className="btn btn-primary">Browse Shoe Collection</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayWithRazorpay = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      setError('Please fill in all shipping address fields.');
      return;
    }

    setLoading(true);

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load Razorpay SDK. Please check your internet connection and try again.');
        setLoading(false);
        return;
      }

      // 2. Create order on the server-side via cURL/Fetch to Razorpay API
      const createRes = await api.post('/orders/razorpay/create', {
        items: cartItems,
        shippingAddress: formData
      });

      const { order, razorpayOrderId, amount, currency, keyId } = createRes.data;

      // 3. Configure Razorpay Standard Checkout options
      // Note: Only the public Test Key ID is provided to the client. The Secret is strictly kept on the server!
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        name: 'StepUp Footwear',
        description: `Order #${order._id.substring(order._id.length - 6).toUpperCase()}`,
        order_id: razorpayOrderId,
        prefill: {
          name: formData.fullName,
          email: user?.email || '',
          contact: formData.phone
        },
        notes: {
          order_id: order._id
        },
        theme: {
          color: '#2563eb' // StepUp Footwear brand accent
        },
        // Callback when user completes payment in Razorpay Checkout
        handler: async function (response) {
          setLoading(true);
          try {
            // 4. Send payment response to server for strict HMAC-SHA256 signature verification
            const verifyRes = await api.post('/orders/razorpay/verify', {
              orderId: order._id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              clearCart();
              navigate(`/order-success/${order._id}`);
            } else {
              setError('Payment verification failed. Please contact customer support.');
            }
          } catch (vErr) {
            setError(vErr.response?.data?.message || 'Server signature verification failed.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment Cancelled. The Razorpay checkout window was closed before completing payment. Your cart items are preserved.');
          }
        }
      };

      // 4. Open official Razorpay Checkout popup
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (resp) {
        setLoading(false);
        const failReason = resp.error?.description || 'Your test payment could not be completed.';
        setError(`Payment Failed: ${failReason}. Please try again.`);
      });

      rzp.open();
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Unable to initiate Razorpay checkout. Please try again.');
    }
  };

  return (
    <div className="container section-padding">
      <Link to="/cart" className="btn btn-sm btn-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Back to Cart
      </Link>

      <div className="section-header">
        <div>
          <h2>Complete Your Order</h2>
          <p>Provide your delivery address and pay securely via Razorpay Test Mode</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="cart-grid">
        {/* Shipping Details & Razorpay Information */}
        <div className="card-box">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)' }}>
            1. Delivery Address
          </h3>

          <form id="checkout-form" onSubmit={handlePayWithRazorpay}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address / House No. *</label>
              <textarea
                name="address"
                className="form-control"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 102, Green Avenue, Near City Mall"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal / PIN Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  className="form-control"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                />
              </div>
            </div>

            {/* Razorpay Standard Checkout Method Card */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '24px 0 16px', color: 'var(--primary)' }}>
              2. Payment Method
            </h3>

            <div style={{
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              borderRadius: 'var(--radius)',
              padding: '18px 20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.3rem' }}>💳</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '0.98rem' }}>
                    Razorpay Standard Checkout
                  </strong>
                </div>
                <span style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '999px'
                }}>
                  TEST MODE
                </span>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                When you click <strong>Pay with Razorpay</strong>, the official Razorpay Checkout window will open. You can test using:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                <div>✓ <strong>UPI</strong> (success@razorpay / failure@razorpay)</div>
                <div>✓ <strong>Credit / Debit Cards</strong> (Test Cards)</div>
                <div>✓ <strong>Net Banking</strong> (All Major Indian Banks)</div>
                <div>✓ <strong>Wallets</strong> (Test Wallets)</div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary & Primary Payment Button */}
        <div>
          <div className="card-box">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--primary)' }}>
              Order Review
            </h3>

            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={`${item.product}-${item.size}`}
                  style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}
                >
                  <div>
                    <strong>{item.quantity} × {item.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Size: UK {item.size}</div>
                  </div>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
            </div>

            <div className="summary-total summary-row">
              <span>Total Payable</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="btn btn-primary btn-block btn-lg"
                style={{ fontSize: '1rem', padding: '14px' }}
              >
                {loading ? 'Opening Razorpay...' : `Pay with Razorpay • ₹${totalAmount.toLocaleString('en-IN')} →`}
              </button>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--accent)" /> 100% Secure Razorpay Test Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
