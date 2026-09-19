import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { UPLOADS_BASE_URL } from '../services/api';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount, cartCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container section-padding">
        <div className="card-box" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)' }}>
            Your Shopping Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Looks like you haven't added any shoes to your cart yet. Explore our latest arrivals to find your pair!
          </p>
          <Link to="/products" className="btn btn-primary">
            <ShoppingBag size={18} />
            <span>Browse Shoes Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="section-header">
        <div>
          <h2>Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h2>
          <p>Review the shoes you've selected before checking out</p>
        </div>
        <button onClick={clearCart} className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }}>
          <Trash2 size={14} /> Clear Cart
        </button>
      </div>

      <div className="cart-grid">
        {/* Cart Items List */}
        <div className="card-box">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cartItems.map((item) => {
              const imageSrc = item.image?.startsWith('http')
                ? item.image
                : `${UPLOADS_BASE_URL}/${item.image}`;

              return (
                <div key={`${item.product}-${item.size}`} className="cart-item-row">
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100x100?text=Shoe';
                    }}
                  />

                  <div>
                    <Link to={`/products/${item.product}`}>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                        {item.name}
                      </h4>
                    </Link>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span>Size: <strong>{item.size}</strong></span>
                      <span>•</span>
                      <span>Price: <strong>₹{item.price.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>

                  <div className="quantity-picker" style={{ margin: 0 }}>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.product, item.size, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock || 99)}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product, item.size)}
                    className="btn btn-sm btn-outline"
                    title="Remove Item"
                    style={{ padding: '6px', color: 'var(--danger)', border: 'none' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px' }}>
            <Link to="/products" className="btn btn-sm btn-outline">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Box */}
        <div>
          <div className="card-box">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--primary)' }}>
              Order Summary
            </h3>

            <div className="summary-row">
              <span>Items Total ({cartCount})</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax (GST)</span>
              <span>Included</span>
            </div>

            <div className="summary-total summary-row">
              <span>Total Payable</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-block btn-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              🔒 Safe & Secure Simple Order Processing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
