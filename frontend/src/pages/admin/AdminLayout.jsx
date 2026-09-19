import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Tag,
  ShoppingBag,
  Package,
  Users,
  MessageSquare,
  Star,
  ArrowLeft
} from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>
            Store Administration
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
            Admin Panel
          </div>
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
              <span>Return to Store</span>
            </Link>
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
