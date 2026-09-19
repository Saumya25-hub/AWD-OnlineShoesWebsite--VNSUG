import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Store Info */}
          <div>
            <div className="brand-logo" style={{ color: '#ffffff', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.5rem' }}>👟</span>
              <span>StepUp Footwear</span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#94a3b8' }}>
              Your one-stop destination for quality footwear. Explore top collections of running shoes, casual sneakers, athletic sports shoes, and formal footwear.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Shoes</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="footer-title">Customer Service</h4>
            <ul className="footer-links">
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/my-orders">Track Orders</Link></li>
              <li><Link to="/login">User Login</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-title">Store Location</h4>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '8px' }}>
              📍 104, Fashion Square, Ring Road, Surat, Gujarat, India
            </p>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '8px' }}>
              📞 +91 98765 43210
            </p>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
              ✉️ support@stepupfootwear.com
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 StepUp Footwear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
