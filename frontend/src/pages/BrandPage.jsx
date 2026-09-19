import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api, { UPLOADS_BASE_URL } from '../services/api';
import ProductCard from '../components/ProductCard';
import { getBrandBySlug } from '../utils/brandsData';

const BrandPage = () => {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackBrand = getBrandBySlug(brandName) || {
    name: brandName ? brandName.charAt(0).toUpperCase() + brandName.slice(1) : 'Brand',
    slug: brandName ? brandName.toLowerCase() : '',
    logo: `/brands/${brandName ? brandName.toLowerCase() : 'all'}.svg`
  };

  const brandInfo = brandData || fallbackBrand;

  useEffect(() => {
    fetchBrandAndProducts();
  }, [brandName]);

  const fetchBrandAndProducts = async () => {
    setLoading(true);
    try {
      let activeBrand = fallbackBrand;
      try {
        const bRes = await api.get(`/brands/${encodeURIComponent(brandName)}`);
        if (bRes.data) {
          setBrandData(bRes.data);
          activeBrand = bRes.data;
        }
      } catch (e) {
        // Fallback
      }

      const res = await api.get(`/products?brand=${encodeURIComponent(activeBrand.name)}`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching brand products:', err);
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = brandInfo.logo
    ? brandInfo.logo.startsWith('/') || brandInfo.logo.startsWith('http')
      ? brandInfo.logo
      : `${UPLOADS_BASE_URL}/${brandInfo.logo}`
    : null;

  return (
    <div className="container section-padding">
      {/* Back Link */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#94a3b8',
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Brands</span>
        </Link>
      </div>

      {/* Brand Header — Simple Centered Brand Logo & Title */}
      <div
        className="card-box"
        style={{
          padding: '24px 20px',
          marginBottom: '28px',
          textAlign: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        <div
          style={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={`${brandInfo.name} Logo`}
              style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '8px',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'var(--primary)'
            }}>
              {brandInfo.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 6px 0' }}>
          {brandInfo.name} Shoes
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Showing {products.length} {brandInfo.name} product{products.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Brand Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Loading {brandInfo.name} shoes...
        </div>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card-box" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <h3 style={{ marginBottom: '8px', color: 'var(--primary)' }}>
            No {brandInfo.name} Shoes Available
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            There are currently no shoes listed under {brandInfo.name}.
          </p>
          <Link to="/products" className="btn btn-primary">
            Choose Another Brand
          </Link>
        </div>
      )}
    </div>
  );
};

export default BrandPage;
