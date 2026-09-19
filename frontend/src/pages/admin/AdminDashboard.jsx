import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Layers,
  Package,
  Users,
  IndianRupee,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
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
    return <div style={{ color: 'var(--text-muted)' }}>Loading Admin Dashboard overview...</div>;
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Store Overview & Analytics</h2>
          <p>Real-time statistics for catalog, user registrations, and customer shoe orders</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/products" className="btn btn-sm btn-primary">
            <PlusCircle size={15} /> Add Shoe Product
          </Link>
          <Link to="/admin/categories" className="btn btn-sm btn-outline">
            Manage Categories
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Registered Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="card-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
            Recent Customer Orders
          </h3>
          <Link to="/admin/orders" className="btn btn-sm btn-outline" style={{ gap: '4px' }}>
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, index) => (
                  <tr key={order._id}>
                    <td><strong style={{ color: 'var(--primary)' }}>#{index + 1}</strong></td>
                    <td>
                      <div><strong>{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</strong></div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>{order.items?.length || 0} item(s)</td>
                    <td><strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong></td>
                    <td>{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No orders placed yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
