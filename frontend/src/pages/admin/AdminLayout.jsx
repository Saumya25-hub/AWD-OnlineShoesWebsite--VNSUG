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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', fontWeight: 700 }}>
              Admin Console
            </span>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
            StepUp Admin
          </div>
          {user && (
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              👤 {user.email || user.name}
            </div>
          )}
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

          <li style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
            <Link to="/" className="admin-nav-item" style={{ color: '#94a3b8' }}>
              <ArrowLeft size={16} />
              <span>Preview Store</span>
            </Link>
          </li>
          <li style={{ marginTop: '8px' }}>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="admin-nav-item"
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#f87171',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={16} />
              <span>Admin Logout</span>
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
