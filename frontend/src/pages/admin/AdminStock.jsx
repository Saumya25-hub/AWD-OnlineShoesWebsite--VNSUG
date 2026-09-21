import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Save, RefreshCw, Search } from 'lucide-react';
import api, { UPLOADS_BASE_URL } from '../../services/api';

const AdminStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Quick Add State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [addQty, setAddQty] = useState(10);
  const [addingStock, setAddingStock] = useState(false);

  // Local draft stock quantities { [productId]: number }
  const [draftStock, setDraftStock] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
      const drafts = {};
      res.data.forEach((p) => {
        drafts[p._id] = p.stock || 0;
      });
      setDraftStock(drafts);
    } catch (err) {
      console.error('Error fetching products for stock:', err);
      setMessage({ text: 'Failed to load products.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Handle draft stock input change
  const handleStockChange = (id, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setDraftStock((prev) => ({ ...prev, [id]: num }));
  };

  // Save exact stock for single product
  const handleSaveStock = async (id) => {
    const newStock = draftStock[id];
    setSavingId(id);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.patch(`/products/${id}/stock`, { stock: newStock });
      // Update local product list
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock: res.data.stock } : p))
      );
      setMessage({ text: 'Stock updated successfully.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error saving stock:', err);
      setMessage({ text: 'Failed to update stock.', type: 'danger' });
    } finally {
      setSavingId(null);
    }
  };

  // Add stock in bulk/quick addition
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!selectedProduct || addQty <= 0) {
      setMessage({ text: 'Please select a shoe and enter units to add.', type: 'danger' });
      return;
    }

    setAddingStock(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.patch(`/products/${selectedProduct}/stock`, { addStock: Number(addQty) });
      setProducts((prev) =>
        prev.map((p) => (p._id === selectedProduct ? { ...p, stock: res.data.stock } : p))
      );
      setDraftStock((prev) => ({ ...prev, [selectedProduct]: res.data.stock }));
      setMessage({ text: 'Stock added successfully.', type: 'success' });
      setSelectedProduct('');
      setAddQty(10);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error adding stock:', err);
      setMessage({ text: 'Failed to add stock.', type: 'danger' });
    } finally {
      setAddingStock(false);
    }
  };

  // Quick increment helper (+5 or +10)
  const handleQuickIncrement = (id, amount) => {
    setDraftStock((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current + amount };
    });
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term) ||
      p.category?.name?.toLowerCase().includes(term)
    );
  });

  const totalModels = products.length;
  const inStockCount = products.filter((p) => (p.stock || 0) > 0).length;
  const outOfStockCount = products.filter((p) => (p.stock || 0) <= 0).length;

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2>Stock Management</h2>
          <p>Quickly view shoe inventory stock and update quantities.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchProducts} className="btn btn-sm btn-outline" title="Refresh stock">
            <RefreshCw size={15} /> Refresh
          </button>
          <Link to="/admin/products" className="btn btn-sm btn-outline">
            View All Products
          </Link>
        </div>
      </div>

      {/* 3 Simple Student Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '25px' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap icon-blue">
            <Boxes size={22} />
          </div>
          <div>
            <div className="stat-value">{totalModels}</div>
            <div className="stat-label">Total Shoes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap icon-green">
            <Boxes size={22} />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#16a34a' }}>{inStockCount}</div>
            <div className="stat-label">Available Stock</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap icon-purple" style={{ color: '#dc2626', background: '#fee2e2' }}>
            <Boxes size={22} />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#dc2626' }}>{outOfStockCount}</div>
            <div className="stat-label">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {message.text && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: 500,
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
          }}
        >
          {message.text}
        </div>
      )}

      {/* Quick Add Stock Box */}
      <div className="card-box" style={{ padding: '20px', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
          Add Stock to Shoe
        </h3>
        <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '2', minWidth: '260px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>
              Select Shoe:
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="form-control"
              required
            >
              <option value="">-- Choose Shoe Model --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.brand}) — Current Stock: {p.stock || 0}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '140px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>
              Units to Add:
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={addQty}
              onChange={(e) => setAddQty(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div>
            <button type="submit" disabled={addingStock} className="btn btn-primary" style={{ height: '40px' }}>
              {addingStock ? 'Adding...' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search shoes or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Showing {filteredProducts.length} of {products.length} shoes
        </span>
      </div>

      {/* Stock Table */}
      <div className="table-responsive card-box" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading shoe inventory...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Image</th>
                <th>Shoe Model</th>
                <th>Brand</th>
                <th>Category</th>
                <th style={{ width: '110px' }}>Price</th>
                <th style={{ width: '140px', textAlign: 'center' }}>Stock Status</th>
                <th style={{ width: '260px', textAlign: 'center' }}>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const stockVal = draftStock[p._id] !== undefined ? draftStock[p._id] : (p.stock || 0);
                  const isSaved = Number(stockVal) === Number(p.stock || 0);
                  const isOut = (p.stock || 0) <= 0;

                  return (
                    <tr key={p._id}>
                      {/* Image */}
                      <td>
                        <img
                          src={p.image?.startsWith('http') ? p.image : `${UPLOADS_BASE_URL}/${p.image}`}
                          alt={p.name}
                          className="product-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50?text=Shoe';
                          }}
                        />
                      </td>

                      {/* Shoe Name */}
                      <td>
                        <strong>{p.name}</strong>
                      </td>

                      {/* Brand */}
                      <td>
                        <span style={{ fontWeight: 600, color: '#0284c7' }}>{p.brand}</span>
                      </td>

                      {/* Category */}
                      <td>
                        <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {p.category?.name || 'General'}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <strong>₹{Number(p.price).toLocaleString()}</strong>
                      </td>

                      {/* Status Badge */}
                      <td style={{ textAlign: 'center' }}>
                        {isOut ? (
                          <span className="badge badge-cancelled">Out of Stock</span>
                        ) : (
                          <span className="badge badge-delivered">{p.stock} in stock</span>
                        )}
                      </td>

                      {/* Inline Stock Update */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            max="9999"
                            value={stockVal}
                            onChange={(e) => handleStockChange(p._id, e.target.value)}
                            className="form-control"
                            style={{ width: '75px', textAlign: 'center', padding: '4px 6px', fontSize: '13px', fontWeight: 600 }}
                          />

                          <button
                            type="button"
                            onClick={() => handleQuickIncrement(p._id, 5)}
                            className="btn btn-sm btn-outline"
                            title="Add 5"
                            style={{ padding: '4px 6px', fontSize: '11px' }}
                          >
                            +5
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickIncrement(p._id, 10)}
                            className="btn btn-sm btn-outline"
                            title="Add 10"
                            style={{ padding: '4px 6px', fontSize: '11px' }}
                          >
                            +10
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveStock(p._id)}
                            disabled={savingId === p._id || isSaved}
                            className={`btn btn-sm ${isSaved ? 'btn-outline' : 'btn-primary'}`}
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                            title="Save stock"
                          >
                            <Save size={13} /> {savingId === p._id ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '35px', color: 'var(--text-muted)' }}>
                    No shoe products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStock;
