import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Tag,
  ShoppingBag,
  Package,
  Users,
  MessageSquare,
  Star,
  ArrowLeft,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ paddingBottom: '18px', marginBottom: '18px', borderBottom: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Admin Panel
          </h2>
        </div>

        <ul className="admin-nav">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <Layers size={18} />
              <span>Categories</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/brands"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <Tag size={18} />
              <span>Brands</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <ShoppingBag size={18} />
              <span>Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <Package size={18} />
              <span>Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <Users size={18} />
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/messages"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <MessageSquare size={18} />
              <span>Inquiries</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <Star size={18} />
              <span>Reviews</span>
            </NavLink>
          </li>

          <li style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
            <Link to="/" className="admin-nav-item">
              <ArrowLeft size={16} />
              <span>Back to Store</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="admin-nav-item"
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Admin Area */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
