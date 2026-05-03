import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ShoppingCart, Heart, Star, ArrowLeft, Package, Tag, Box,
  CheckCircle, XCircle, Truck, Shield
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, rRes, avgRes] = await Promise.all([
        API.get(`/api/products/${id}`),
        API.get(`/api/product/${id}/reviews`),
        API.get(`/api/product/${id}/avg-rating`),
      ]);
      setProduct(pRes.data);
      setReviews(rRes.data);
      setAvgRating(avgRes.data || 0);
      if (user?.email) {
        try {
          const wRes = await API.get('/api/wishlist/get', { params: { userEmail: user.email } });
          const ids = new Set((wRes.data?.data?.products || []).map(p => p.id));
          setInWishlist(ids.has(parseInt(id)));
        } catch {}
      }
    } catch { toast.error('Product not found'); navigate('/'); }
    finally { setLoading(false); }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(parseInt(id), quantity);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!user?.email) { navigate('/login'); return; }
    try {
      if (inWishlist) {
        await API.delete(`/api/wishlist/remove/${id}`, { params: { userEmail: user.email } });
        setInWishlist(false); toast.success('Removed from wishlist');
      } else {
        await API.post(`/api/wishlist/add/${id}`, null, { params: { userEmail: user.email } });
        setInWishlist(true); toast.success('Added to wishlist!');
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Wishlist action failed'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setReviewLoading(true);
    try {
      const res = await API.post(`/api/product/${id}/review`, {
        rating: newReview.rating,
        comment: newReview.comment,
        username: user.email,   // backend Review model uses 'username' field
      });
      setReviews(prev => [res.data, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted!');
      const avgRes = await API.get(`/api/product/${id}/avg-rating`);
      setAvgRating(avgRes.data || 0);
    } catch { toast.error('Failed to submit review'); }
    finally { setReviewLoading(false); }
  };

  if (loading) return <div className="page-loading"><div className="spinner-lg" /></div>;
  if (!product) return null;

  const isDiscounted = product.finalPrice && product.finalPrice < product.price;

  return (
    <div className="page-wrapper">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-img">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="product-img-placeholder large"><Package size={80} /></div>
            )}
            {isDiscounted && (
              <span className="badge-discount large">
                -{Math.round(((product.price - product.finalPrice) / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <div className="product-detail-tags">
              {product.category && <span className="tag"><Tag size={12} />{product.category.name}</span>}
              {product.brand && <span className="tag"><Box size={12} />{product.brand}</span>}
            </div>
            <h1>{product.name}</h1>

            <div className="rating-row">
              <StarRating rating={avgRating} />
              <span className="rating-count">({reviews.length} reviews)</span>
            </div>

            <div className="detail-price">
              {isDiscounted ? (
                <>
                  <span className="price-final-lg">₹{product.finalPrice}</span>
                  <span className="price-original-lg">₹{product.price}</span>
                  {product.discountPercentage && (
                    <span className="price-save">Save {product.discountPercentage}%</span>
                  )}
                </>
              ) : (
                <span className="price-final-lg">₹{product.price}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="stock-info">
              {product.productAvailable ? (
                product.lowStock ? (
                  <span className="low-stock-warn">
                    ⚠️ Only <strong>{product.stockQuantity}</strong> left — Order soon!
                  </span>
                ) : (
                  <span className="in-stock"><CheckCircle size={16} /> In Stock ({product.stockQuantity} available)</span>
                )
              ) : (
                <span className="out-stock"><XCircle size={16} /> Out of Stock</span>
              )}
            </div>

            <div className="qty-row">
              <label>Quantity:</label>
              <div className="qty-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}>+</button>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={!product.productAvailable}
              >
                <ShoppingCart size={20} />
                {product.productAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                className={`btn-wishlist-lg ${inWishlist ? 'active' : ''}`}
                onClick={handleWishlist}
              >
                <Heart size={22} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="product-perks">
              <div className="perk"><Truck size={18} /> Free Delivery</div>
              <div className="perk"><Shield size={18} /> 1 Year Warranty</div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {user && (
            <form onSubmit={handleReview} className="review-form">
              <h3>Write a Review</h3>
              <div className="star-select">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`star-btn ${s <= newReview.rating ? 'active' : ''}`}
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                  >
                    <Star size={24} fill={s <= newReview.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                required
                rows={4}
              />
              <button type="submit" className="btn-primary" disabled={reviewLoading}>
                {reviewLoading ? <span className="spinner" /> : 'Submit Review'}
              </button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <StarRating rating={r.rating} />
                  <span className="review-user">{r.username || 'Anonymous'}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          size={16}
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={s <= Math.round(rating) ? '#f59e0b' : '#9ca3af'}
        />
      ))}
      {rating > 0 && <span className="rating-num">{rating.toFixed(1)}</span>}
    </div>
  );
}
