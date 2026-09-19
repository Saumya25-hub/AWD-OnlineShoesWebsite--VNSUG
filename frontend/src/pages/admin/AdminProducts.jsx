import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import api, { UPLOADS_BASE_URL } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Nike',
    category: '',
    price: '',
    stock: '15',
    sizes: '6, 7, 8, 9, 10, 11',
    description: '',
    isFeatured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/brands')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      console.error('Error loading products/categories/brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: brands[0]?.name || 'Nike',
      category: categories[0]?._id || '',
      price: '',
      stock: '15',
      sizes: '6, 7, 8, 9, 10, 11',
      description: '',
      isFeatured: false
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      brand: prod.brand || 'Nike',
      category: prod.category?._id || prod.category || '',
      price: prod.price,
      stock: prod.stock,
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : prod.sizes,
      description: prod.description,
      isFeatured: prod.isFeatured || false
    });
    setImageFile(null);
    const existingImg = prod.image?.startsWith('http')
      ? prod.image
      : `${UPLOADS_BASE_URL}/${prod.image}`;
    setImagePreview(existingImg);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!formData.name || !formData.brand || !formData.category || !formData.price || !formData.description) {
      setMessage({ text: 'Please fill in all required product fields (Name, Brand, Category, Price, Description).', type: 'danger' });
      return;
    }

    if (!editingProduct && !imageFile) {
      setMessage({ text: 'Please select a shoe image to upload.', type: 'danger' });
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('sizes', formData.sizes);
    data.append('description', formData.description);
    data.append('isFeatured', formData.isFeatured);

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ text: 'Shoe product updated successfully!', type: 'success' });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ text: 'New shoe product added successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error saving shoe product.',
        type: 'danger'
      });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from catalog?`)) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      setMessage({ text: `Product "${name}" deleted.`, type: 'success' });
      fetchData();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to delete product',
        type: 'danger'
      });
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Product Management (CRUD)</h2>
          <p>Add, edit, upload shoe images, and update footwear catalog details</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} /> Add New Shoe
        </button>
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

      {/* Products Table */}
      <div className="card-box">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
          All Shoes in Store ({products.length})
        </h3>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading shoe catalog...</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Shoe Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => {
                  const imageSrc = prod.image?.startsWith('http')
                    ? prod.image
                    : `${UPLOADS_BASE_URL}/${prod.image}`;

                  return (
                    <tr key={prod._id}>
                      <td>
                        <img
                          src={imageSrc}
                          alt={prod.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', background: '#f1f5f9' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50x50?text=Shoe';
                          }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Sizes: {Array.isArray(prod.sizes) ? prod.sizes.join(', ') : prod.sizes}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.82rem' }}>
                          {prod.brand || 'Nike'}
                        </span>
                      </td>
                      <td>{prod.category?.name || 'Unassigned'}</td>
                      <td><strong>₹{prod.price.toLocaleString('en-IN')}</strong></td>
                      <td>
                        <span className={`badge ${prod.stock > 0 ? 'badge-delivered' : 'badge-cancelled'}`}>
                          {prod.stock} pairs
                        </span>
                      </td>
                      <td>
                        {prod.isFeatured ? (
                          <span className="badge badge-processing">Featured</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="btn btn-sm btn-outline"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id, prod.name)}
                            className="btn btn-sm btn-danger"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                {editingProduct ? 'Edit Shoe Product' : 'Add New Shoe Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Shoe Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Nike Air Pegasus 40"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Brand *</label>
                    <select
                      className="form-control"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    >
                      {brands.map((b) => (
                        <option key={b._id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="0"
                      placeholder="e.g. 2999"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="0"
                      placeholder="e.g. 15"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Available Sizes (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 6, 7, 8, 9, 10, 11"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    required
                    rows={3}
                    placeholder="Enter shoe features, comfort level, and material details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Image Upload Box */}
                <div className="form-group">
                  <label className="form-label">Shoe Image {editingProduct ? '(Leave unchanged or upload new)' : '*'}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="isFeatured" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                    Mark as Featured Product (Display on Home page)
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update Product' : 'Save Product'}
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

export default AdminProducts;
