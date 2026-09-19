import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post('/categories', { name, description });
      setName('');
      setDescription('');
      setMessage({ text: 'Category created successfully!', type: 'success' });
      fetchCategories();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to create category',
        type: 'danger'
      });
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/categories/${editingId}`, {
        name: editName,
        description: editDescription
      });
      setEditingId(null);
      setMessage({ text: 'Category updated successfully!', type: 'success' });
      fetchCategories();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update category',
        type: 'danger'
      });
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);
      setMessage({ text: `Category "${catName}" deleted.`, type: 'success' });
      fetchCategories();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to delete category',
        type: 'danger'
      });
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Category Management (CRUD)</h2>
          <p>Create, update, and manage shoe categories in the catalog</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ text: '', type: '' })}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Add Category Form */}
      <div className="card-box" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
          Add New Shoe Category
        </h3>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Hiking & Trekking"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Brief description of this shoe category"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
            <Plus size={16} /> Add Category
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="card-box">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
          Existing Categories ({categories.length})
        </h3>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading categories...</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{cat.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{cat.description || '—'}</td>
                    <td>{new Date(cat.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="btn btn-sm btn-outline"
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="btn btn-sm btn-danger"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      {editingId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                Edit Shoe Category
              </h3>
              <button
                onClick={() => setEditingId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
