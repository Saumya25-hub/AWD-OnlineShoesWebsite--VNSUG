import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { UPLOADS_BASE_URL } from '../services/api';
import ProductCard from '../components/ProductCard';
import { BRANDS } from '../utils/brandsData';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState(BRANDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodEndpoint = searchQuery
        ? `/products?search=${encodeURIComponent(searchQuery)}`
        : '/products';

      const [prodRes, brandRes] = await Promise.all([
        api.get(prodEndpoint),
        api.get('/brands')
      ]);
      setProducts(prodRes.data);
      if (brandRes.data && brandRes.data.length > 0) {
        setBrands(brandRes.data);
      }
    } catch (err) {
      console.error('Error fetching products/brands:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding">
      {/* Choose a Brand Section (shown on main catalog) */}
      {!searchQuery && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
              Choose a Brand
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Select a brand to explore its exclusive shoe collection
            </p>
          </div>

          {/* Brand Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              maxWidth: '1000px',
              margin: '0 auto 48px auto'
            }}
          >
            {brands.map((brand) => {
              const logoSrc = brand.logo
                ? brand.logo.startsWith('/') || brand.logo.startsWith('http')
                  ? brand.logo
                  : `${UPLOADS_BASE_URL}/${brand.logo}`
                : null;

              return (
                <Link
                  key={brand.slug || brand.name}
                  to={`/brand/${brand.slug || brand.name.toLowerCase()}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '22px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div
                    style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px'
                    }}
                  >
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={`${brand.name} Logo`}
                        style={{ maxHeight: '44px', maxWidth: '100px', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '8px',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'var(--primary)'
                      }}>
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--primary)'
                    }}
                  >
                    {brand.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--accent)',
                      marginTop: '4px',
                      fontWeight: 600
                    }}
                  >
                    View Shoes &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Shoes Products Grid */}
      <div style={{ borderTop: searchQuery ? 'none' : '1px solid rgba(255, 255, 255, 0.12)', paddingTop: searchQuery ? '0' : '36px' }}>
        
        {/* Search Filter Header when searching */}
        {searchQuery ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#1e293b',
            padding: '14px 20px',
            borderRadius: '8px',
            marginBottom: '28px',
            border: '1px solid #334155'
          }}>
            <span style={{ color: '#f8fafc', fontSize: '1.05rem' }}>
              Search results for: <strong style={{ color: '#38bdf8' }}>"{searchQuery}"</strong> ({products.length} shoes found)
            </span>
            <button
              onClick={() => setSearchParams({})}
              className="btn btn-sm btn-outline"
              style={{ color: '#f8fafc', borderColor: '#475569' }}
            >
              ✕ Clear Search
            </button>
          </div>
        ) : (
          <div className="section-header" style={{ marginBottom: '22px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                All Shoes Collection
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '4px' }}>
                Explore shoes from various top brands and categories
              </p>
            </div>
            <span style={{ fontSize: '0.88rem', color: '#94a3b8', fontWeight: 600 }}>
              {products.length} Products Available
            </span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
            Loading shoes collection...
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card-box" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No shoes matching your search were found.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchParams({})}
                className="btn btn-primary"
                style={{ marginTop: '14px' }}
              >
                Browse All Shoes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
