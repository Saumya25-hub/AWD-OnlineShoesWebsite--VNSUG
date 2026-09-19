import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Star } from 'lucide-react';
import { UPLOADS_BASE_URL } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '8';
    addToCart(product, defaultSize, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const imageSrc = product.image?.startsWith('http')
    ? product.image
    : `${UPLOADS_BASE_URL}/${product.image}`;

  const isFavorited = isInWishlist(product._id);

  return (
    <div className="product-card">
      <div className="card-img-wrapper">
        <Link to={`/products/${product._id}`} style={{ width: '100%', height: '100%' }}>
          <img
            src={imageSrc}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x400?text=Shoe+Image';
            }}
          />
        </Link>
        {product.category?.name && (
          <span className="card-category-badge">{product.category.name}</span>
        )}
        <button
          onClick={handleWishlistClick}
          className="card-wishlist-btn"
          title={isFavorited ? "Remove from Wishlist" : "Save to Wishlist"}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            color: isFavorited ? '#ef4444' : '#64748b',
            transition: 'transform 0.2s'
          }}
        >
          <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
            {product.brand || 'Brand'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.75rem' }}>
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
              {product.averageRating || '4.8'}
            </span>
          </div>
        </div>

        <Link to={`/products/${product._id}`}>
          <h3 className="card-title" title={product.name}>{product.name}</h3>
        </Link>
        <p className="card-desc">{product.description}</p>

        <div className="card-bottom">
          <div>
            <div className="card-price">₹{product.price.toLocaleString('en-IN')}</div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <Link
              to={`/products/${product._id}`}
              className="btn btn-sm btn-outline"
              title="View Details"
              style={{ padding: '6px 10px', fontSize: '0.8rem', gap: '4px' }}
            >
              <Eye size={14} /> Details
            </Link>
            <button
              onClick={handleQuickAdd}
              className="btn btn-sm btn-primary"
              title="Add to Cart"
              style={{ padding: '6px 10px', fontSize: '0.8rem', gap: '4px' }}
            >
              <ShoppingBag size={14} /> Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
