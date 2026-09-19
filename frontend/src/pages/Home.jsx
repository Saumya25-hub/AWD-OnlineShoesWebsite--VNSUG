import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import api, { UPLOADS_BASE_URL } from '../services/api';
import ProductCard from '../components/ProductCard';
import { BRANDS } from '../utils/brandsData';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState(BRANDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, brandRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories'),
          api.get('/brands')
        ]);
        setFeaturedProducts(prodRes.data);
        setCategories(catRes.data);
        if (brandRes.data && brandRes.data.length > 0) {
          setBrands(brandRes.data);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="container">
        <section className="hero-section">
          {/* Background Video */}
          <video
            className="hero-video-bg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/video/NIKE-background.mp4" type="video/mp4" />
          </video>
          {/* Subtle Overlay to ensure high contrast & legibility */}
          <div className="hero-video-overlay"></div>

          <div className="container hero-grid">
            <div>
              <span className="hero-badge">Step Into Comfort & Style</span>
              <h1 className="hero-title">Find Your Perfect Pair Of Everyday Shoes</h1>
              <p className="hero-text">
                Explore our handpicked collection of premium running shoes, classic sneakers, formal footwear, and athletic sports gear at the best affordable prices.
              </p>
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-lg btn-primary">
                  <span>Shop Collection</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline" style={{ color: '#ffffff', borderColor: '#475569' }}>
                  Learn More
                </Link>
              </div>
            </div>

            <div className="hero-image-box">
              <img
                src="/hero-shoe.jpg"
                alt="Featured Performance Running Shoe"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${UPLOADS_BASE_URL}/shoe1.jpg`;
                }}
              />
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="features-grid">
          <div className="feature-box">
            <div className="feature-icon-wrap">
              <Truck size={22} />
            </div>
            <div className="feature-info">
              <h4>Free Fast Delivery</h4>
              <p>On all domestic shoe orders across India</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrap">
              <ShieldCheck size={22} />
            </div>
            <div className="feature-info">
              <h4>100% Genuine Quality</h4>
              <p>Durable materials crafted for lasting comfort</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrap">
              <RotateCcw size={22} />
            </div>
            <div className="feature-info">
              <h4>7 Days Replacement</h4>
              <p>Hassle-free size exchange and replacement</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrap">
              <Headphones size={22} />
            </div>
            <div className="feature-info">
              <h4>Student Support</h4>
              <p>Quick assistance for orders and sizing</p>
            </div>
          </div>
        </section>

        {/* Shop By Categories */}
        <section className="section-padding" style={{ paddingTop: '10px' }}>
          <div className="section-header">
            <div>
              <h2>Explore Shoe Categories</h2>
              <p>Find footwear tailored for your daily lifestyle and routine</p>
            </div>
            <Link to="/products" className="btn btn-sm btn-outline">
              View All Categories →
            </Link>
          </div>

          <div className="category-pills">
            <Link to="/products" className="cat-pill active">
              All Shoes
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="cat-pill"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Brands Section - Continuous Running Line */}
        <section className="section-padding" style={{ paddingTop: '0px', paddingBottom: '20px' }}>
          <div className="section-header">
            <div>
              <h2>Featured Brands</h2>
              <p>Explore official shoe collections from world-renowned footwear brands</p>
            </div>
            <Link to="/products" className="btn btn-sm btn-outline">
              View All Shoes →
            </Link>
          </div>

          <div className="brands-marquee-wrapper">
            <div className="brands-marquee-track">
              {[...brands, ...brands, ...brands, ...brands].map((brand, idx) => {
                const logoSrc = brand.logo
                  ? brand.logo.startsWith('/') || brand.logo.startsWith('http')
                    ? brand.logo
                    : `${UPLOADS_BASE_URL}/${brand.logo}`
                  : null;

                return (
                  <Link
                    key={`${brand.slug || brand.name}-${idx}`}
                    to={`/brand/${brand.slug || brand.name.toLowerCase()}`}
                    className="brand-marquee-card"
                    title={`View ${brand.name} shoes`}
                  >
                    <div className="brand-marquee-logo-wrap">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={`${brand.name} Logo`}
                        />
                      ) : (
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="brand-marquee-name">
                      {brand.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="section-padding" style={{ paddingTop: '0px' }}>
          <div className="section-header">
            <div>
              <h2>Featured Shoe Arrivals</h2>
              <p>Top trending athletic and casual footwear chosen for comfort</p>
            </div>
            <Link to="/products" className="btn btn-sm btn-primary">
              Browse All Shoes →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading shoes catalog...
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
