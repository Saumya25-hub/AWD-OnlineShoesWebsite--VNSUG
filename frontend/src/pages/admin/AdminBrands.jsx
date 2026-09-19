import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, Image as ImageIcon, Tag } from 'lucide-react';
import api, { UPLOADS_BASE_URL } from '../../services/api';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState(null);

  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const addFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get('/brands');
      setBrands(res.data);
    } catch (err) {
      console.error('Error loading brands:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to load brands.',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditLogoFile(file);
        setEditLogoPreview(URL.createObjectURL(file));
      } else {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ text: 'Please enter a brand name.', type: 'danger' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      await api.post('/brands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setName('');
      setDescription('');
      setLogoFile(null);
      setLogoPreview(null);
      if (addFileInputRef.current) addFileInputRef.current.value = '';

      setMessage({ text: `Brand "${name.trim()}" created successfully!`, type: 'success' });
      fetchBrands();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to create brand.',
        type: 'danger'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (brand) => {
    setEditingBrand(brand);
    setEditName(brand.name);
    setEditDescription(brand.description || '');
    setEditLogoFile(null);

    const currentLogo = brand.logo
      ? brand.logo.startsWith('/') || brand.logo.startsWith('http')
        ? brand.logo
        : `${UPLOADS_BASE_URL}/${brand.logo}`
      : null;

    setEditLogoPreview(currentLogo);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setMessage({ text: 'Brand name is required.', type: 'danger' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('name', editName.trim());
      formData.append('description', editDescription.trim());
      if (editLogoFile) {
        formData.append('logo', editLogoFile);
      }

      await api.put(`/brands/${editingBrand._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowEditModal(false);
      setMessage({ text: `Brand "${editName.trim()}" updated successfully!`, type: 'success' });
      fetchBrands();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to update brand.',
        type: 'danger'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, brandName) => {
    if (!window.confirm(`Are you sure you want to delete brand "${brandName}"? Shoes linked to this brand will remain in catalog.`)) {
      return;
    }

    try {
      await api.delete(`/brands/${id}`);
      setMessage({ text: `Brand "${brandName}" deleted successfully.`, type: 'success' });
      fetchBrands();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to delete brand.',
        type: 'danger'
      });
    }
  };

  const renderBrandLogo = (brand) => {
    if (brand.logo) {
      const src = brand.logo.startsWith('/') || brand.logo.startsWith('http')
        ? brand.logo
        : `${UPLOADS_BASE_URL}/${brand.logo}`;
      return (
        <img
          src={src}
          alt={`${brand.name} Logo`}
          style={{ maxHeight: '32px', maxWidth: '70px', objectFit: 'contain' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }
    return (
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '6px',
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        color: 'var(--primary)',
        fontSize: '0.9rem'
      }}>
        {brand.name.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Brand Management (CRUD)</h2>
          <p>Create, update, and manage official shoe brands for the store and catalog</p>
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

      {/* Add New Brand Box */}
      <div className="card-box" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>
          Add New Shoe Brand
        </h3>

        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group" style={{ flex: '1 1 240px' }}>
              <label className="form-label">Brand Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Reebok, Under Armour, Asics"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: '2 1 340px' }}>
              <label className="form-label">Brand Description / Tagline</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. High performance athletic footwear and running sneakers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row" style={{ alignItems: 'center' }}>
            <div className="form-group" style={{ flex: '1 1 280px' }}>
              <label className="form-label">Brand Logo (SVG, PNG, JPG)</label>
              <input
                type="file"
                ref={addFileInputRef}
                accept="image/*"
                className="form-control"
                onChange={(e) => handleLogoChange(e, false)}
              />
            </div>

            {logoPreview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <div style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff' }}>
                  <img src={logoPreview} alt="Preview" style={{ maxHeight: '34px', maxWidth: '80px', objectFit: 'contain' }} />
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setLogoFile(null);
                    setLogoPreview(null);
                    if (addFileInputRef.current) addFileInputRef.current.value = '';
                  }}
                >
                  Remove Logo
                </button>
              </div>
            )}

            <div style={{ marginLeft: 'auto', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ padding: '10px 24px' }}
              >
                <Plus size={16} />
                <span>{submitting ? 'Adding...' : 'Add Brand'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Existing Brands List */}
      <div className="card-box">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>
          Existing Brands ({brands.length})
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading brands...
          </div>
        ) : brands.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No brands found. Use the form above to add your first brand.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th style={{ width: '100px' }}>Logo</th>
                  <th style={{ width: '150px' }}>Brand Name</th>
                  <th style={{ width: '120px' }}>Slug</th>
                  <th>Description</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand, idx) => (
                  <tr key={brand._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                        {renderBrandLogo(brand)}
                      </div>
                    </td>
                    <td>
                      <strong>{brand.name}</strong>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.82rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {brand.slug}
                      </code>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      {brand.description || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleStartEdit(brand)}
                          className="btn-icon"
                          title="Edit Brand"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id, brand.name)}
                          className="btn-icon btn-icon-danger"
                          title="Delete Brand"
                        >
                          <Trash2 size={16} />
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

      {/* Edit Brand Modal */}
      {showEditModal && editingBrand && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>Edit Brand</h3>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="modal-body">
              <div className="form-group">
                <label className="form-label">Brand Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand Logo</label>
                {editLogoPreview && (
                  <div style={{ marginBottom: '10px', padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '6px', background: '#f8fafc', display: 'inline-flex', alignItems: 'center' }}>
                    <img src={editLogoPreview} alt="Logo" style={{ maxHeight: '40px', maxWidth: '100px', objectFit: 'contain' }} />
                  </div>
                )}
                <input
                  type="file"
                  ref={editFileInputRef}
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleLogoChange(e, true)}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Leave empty to keep existing logo. Supports SVG, PNG, JPG.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;
