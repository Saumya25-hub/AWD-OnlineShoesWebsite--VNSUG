import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, CheckCircle, ShieldCheck, Truck, RotateCcw, Star, MessageSquare, AlertCircle } from 'lucide-react';
import api, { UPLOADS_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('8');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedAlert, setAddedAlert] = useState(false);
  const [error, setError] = useState('');

  // Reviews & Ratings State
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ count: 0, averageRating: 0 });
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      if (res.data.sizes && res.data.sizes.length > 0) {
        setSelectedSize(res.data.sizes[0]);
      }
    } catch (err) {
      setError('Product not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data.reviews || []);
      setReviewStats({
        count: res.data.count || 0,
        averageRating: res.data.averageRating || 0
      });
    } catch (err) {
      console.error('Error fetching shoe reviews:', err);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, selectedSize, quantity);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await api.post('/reviews', {
        productId: id,
        rating: userRating,
        comment: userComment
      });

      setReviewSuccess(res.data.message || 'Review submitted successfully!');
      setUserComment('');
      fetchReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading shoe details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container section-padding">
        <div className="alert alert-danger">{error || 'Shoe product not found.'}</div>
        <Link to="/products" className="btn btn-dark">
          <ArrowLeft size={16} /> Back to All Shoes
        </Link>
      </div>
    );
  }

  const imageSrc = product.image?.startsWith('http')
    ? product.image
    : `${UPLOADS_BASE_URL}/${product.image}`;

  const isFavorited = isInWishlist(product._id);

  return (
    <div className="container section-padding">
      <Link to="/products" className="btn btn-sm btn-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Shoe Catalog
      </Link>

      {addedAlert && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>Added <strong>{quantity} × {product.name} (Size: {selectedSize})</strong> to your shopping cart!</span>
        </div>
      )}

      <div className="product-detail-grid">
        {/* Shoe Image Box */}
        <div className="detail-img-box">
          <img
            src={imageSrc}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500x500?text=Shoe+Image';
            }}
          />
        </div>

        {/* Shoe Information & Purchase Controls */}
        <div className="detail-info-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.brand} Footwear
            </span>
            {product.category?.name && (
              <span className="card-category-badge" style={{ position: 'static' }}>
                {product.category.name}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.25, marginBottom: '12px' }}>
            {product.name}
          </h1>

          {/* Star Rating Overview in Product Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div className="star-rating-display">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.round(reviewStats.averageRating) ? '#f59e0b' : '#e2e8f0'}
                  color={star <= Math.round(reviewStats.averageRating) ? '#f59e0b' : '#cbd5e1'}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
              {reviewStats.averageRating > 0 ? `${reviewStats.averageRating} / 5` : 'New'}
            </span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              ({reviewStats.count} {reviewStats.count === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {/* Price Tag */}
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '20px' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary)' }}>
                Select UK/India Size:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: selectedSize === s ? 'var(--accent)' : 'var(--border)',
                      background: selectedSize === s ? 'var(--accent)' : '#ffffff',
                      color: selectedSize === s ? '#ffffff' : 'var(--primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    UK {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div className="quantity-picker">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="qty-val">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '160px', gap: '8px' }}
            >
              <ShoppingBag size={18} />
              <span>Add To Cart</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-outline"
              style={{
                color: isFavorited ? '#ef4444' : 'var(--text-muted)',
                borderColor: isFavorited ? '#ef4444' : 'var(--border)',
                gap: '6px'
              }}
              title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} />
              <span>{isFavorited ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>

          {/* Product Description */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '10px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>
              Product Description
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              {product.description}
            </p>
          </div>

          {/* Assurance Highlights */}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <Truck size={18} color="var(--accent)" /> Free Delivery across India
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <RotateCcw size={18} color="var(--accent)" /> 7-Day Size Replacement
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={18} color="var(--accent)" /> 100% Genuine Footwear
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          PRODUCT-SPECIFIC REVIEWS & STAR RATINGS SECTION
          ========================================================== */}
      <section className="reviews-section">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={22} color="var(--accent)" />
            <span>Customer Reviews & Ratings for {product.name}</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '4px' }}>
            Real reviews and ratings submitted specifically for these shoes.
          </p>
        </div>

        {/* Rating Summary Card */}
        <div className="rating-summary-box">
          <div style={{ textAlign: 'center', paddingRight: '24px', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
              {reviewStats.averageRating > 0 ? reviewStats.averageRating : '0.0'}
            </div>
            <div className="star-rating-display" style={{ margin: '8px 0 4px 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  fill={star <= Math.round(reviewStats.averageRating) ? '#f59e0b' : '#e2e8f0'}
                  color={star <= Math.round(reviewStats.averageRating) ? '#f59e0b' : '#cbd5e1'}
                />
              ))}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {reviewStats.count} {reviewStats.count === 1 ? 'Total Review' : 'Total Reviews'}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
              Shoe Quality & Fit Rating
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              {reviewStats.count > 0
                ? `${reviewStats.averageRating} out of 5 stars based on verified shoe purchaser ratings.`
                : 'No customer reviews yet. Be the first to review these shoes!'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Left: Write / Submit Review Form */}
          <div className="card-box" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px' }}>
              Write a Review
            </h3>

            {reviewSuccess && (
              <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                <CheckCircle size={16} />
                <span>{reviewSuccess}</span>
              </div>
            )}

            {reviewError && (
              <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                <AlertCircle size={16} />
                <span>{reviewError}</span>
              </div>
            )}

            {user ? (
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                    Select Your Star Rating *:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className="star-interactive"
                        style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer' }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(star)}
                        title={`Rate ${star} star`}
                      >
                        <Star
                          size={28}
                          fill={star <= (hoverRating || userRating) ? '#f59e0b' : '#e2e8f0'}
                          color={star <= (hoverRating || userRating) ? '#f59e0b' : '#cbd5e1'}
                        />
                      </button>
                    ))}
                    <span style={{ marginLeft: '10px', fontWeight: 700, color: '#f59e0b', fontSize: '0.92rem' }}>
                      {hoverRating || userRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="userComment" className="form-label" style={{ fontWeight: 700 }}>
                    Your Review / Feedback *:
                  </label>
                  <textarea
                    id="userComment"
                    rows="4"
                    className="form-control"
                    placeholder="Tell us about the comfort, sizing, durability, and style of these shoes..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Reviewing as: <strong>{user.name}</strong>
                  </span>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    {submittingReview ? 'Saving Review...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px' }}>
                  Please log in to your account to submit a review for this product.
                </p>
                <Link to={`/login?redirect=products/${id}`} className="btn btn-outline" style={{ padding: '8px 18px' }}>
                  Log In to Review Shoes
                </Link>
              </div>
            )}
          </div>

          {/* Right: Existing Reviews List */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              Customer Feedback ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="card-box" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                <p>No customer reviews yet for this shoe model.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {reviews.map((rev) => (
                  <div key={rev._id} className="review-card">
                    <div className="review-meta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#eff6ff',
                          color: 'var(--accent)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <strong style={{ color: 'var(--primary)', fontSize: '0.92rem' }}>
                          {rev.userName}
                        </strong>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div className="star-rating-display">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              fill={s <= rev.rating ? '#f59e0b' : '#e2e8f0'}
                              color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
