import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-wrapper">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <span style={{ fontSize: '1.6rem' }}>👟</span>
          <span>StepUp</span>
          <span className="brand-badge">Footwear</span>
        </Link>

        {/* Shoe Search Bar */}
        <form onSubmit={handleSearchSubmit} className="nav-search-form" title="Search shoe brand or model">
          <input
            type="text"
            placeholder="Search shoes (Nike, Puma...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="nav-search-input"
          />
          <button type="submit" className="nav-search-btn" aria-label="Search">
            <Search size={14} />
          </button>
        </form>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                All Shoes
              </NavLink>
            </li>
            <li>
              <NavLink to="/feedback" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Feedback
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Actions (Wishlist, Cart & Auth) */}
        <div className="nav-actions">
          <Link to="/wishlist" className="cart-btn" title="View Wishlist" style={{ position: 'relative' }}>
            <Heart size={18} />
            <span>Wishlist</span>
            {wishlistCount > 0 && <span className="cart-badge" style={{ backgroundColor: '#ef4444' }}>{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="cart-btn" title="View Cart">
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              <Link to="/my-orders" className="btn btn-sm btn-outline" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                My Orders
              </Link>

              <span className="user-badge-tag" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                {user.name ? user.name.split(' ')[0] : 'User'}
              </span>

              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline"
                title="Logout"
                style={{ padding: '6px 10px', flexShrink: 0 }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-sm btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
