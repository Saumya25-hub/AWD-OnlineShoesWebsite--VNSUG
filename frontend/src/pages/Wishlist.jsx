import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { UPLOADS_BASE_URL } from '../services/api';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    const defaultSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : '8';
    addToCart(item, defaultSize, 1);
  };

  const getImageSrc = (image) => {
    if (!image) return 'https://via.placeholder.com/400x400?text=Shoe';
    return image.startsWith('http') ? image : `${UPLOADS_BASE_URL}/${image}`;
  };

  return (
    <div className="container section-padding">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2>My Wishlist</h2>
          <p>Your saved favorite footwear items</p>
        </div>
        {wishlistItems.length > 0 && (
          <button onClick={clearWishlist} className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }}>
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="card-box" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <Heart size={56} strokeWidth={1.5} style={{ margin: '0 auto', color: '#94a3b8' }} />
          </div>
          <h3 style={{ marginBottom: '8px', color: 'var(--primary)' }}>Your Wishlist is Empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
            You haven't added any shoes to your wishlist yet. Explore our collection and save what you like!
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Shoes
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="product-card">
              <div className="card-img-wrapper">
                <Link to={`/products/${item._id}`} style={{ width: '100%', height: '100%' }}>
                  <img
                    src={getImageSrc(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400?text=Shoe+Image';
                    }}
                  />
                </Link>
                {item.category?.name && (
                  <span className="card-category-badge">{item.category.name}</span>
                )}
              </div>

              <div className="card-body">
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {item.brand || 'Brand'}
                </div>
                <Link to={`/products/${item._id}`}>
                  <h3 className="card-title" title={item.name}>{item.name}</h3>
                </Link>
                <p className="card-desc">{item.description}</p>

                <div className="card-bottom">
                  <div>
                    <div className="card-price">₹{item.price.toLocaleString('en-IN')}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-sm btn-primary"
                      title="Add to Shopping Cart"
                      style={{ gap: '6px' }}
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="btn btn-sm btn-outline"
                      title="Remove from Wishlist"
                      style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <Link to="/products" className="btn btn-outline" style={{ gap: '6px' }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
