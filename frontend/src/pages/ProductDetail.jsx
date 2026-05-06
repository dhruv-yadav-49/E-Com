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
  const [similarProducts, setSimilarProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryError, setDeliveryError] = useState('');

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, rRes, avgRes, simRes] = await Promise.all([
        API.get(`/api/products/${id}`),
        API.get(`/api/product/${id}/reviews`),
        API.get(`/api/product/${id}/avg-rating`),
        API.get(`/api/products/${id}/similar`),
      ]);
      setProduct(pRes.data);
      setReviews(rRes.data);
      setAvgRating(avgRes.data || 0);
      setSimilarProducts(simRes.data || []);
      if (user?.email) {
        try {
          const wRes = await API.get('/api/wishlist/get', { params: { userEmail: user.email } });
          const ids = new Set((wRes.data?.data?.products || []).map(p => p.id));
          setInWishlist(ids.has(parseInt(id)));
          setWishlistIds(ids);
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
        setInWishlist(false);
        setWishlistIds(prev => { const n = new Set(prev); n.delete(parseInt(id)); return n; });
        toast.success('Removed from wishlist');
      } else {
        await API.post(`/api/wishlist/add/${id}`, null, { params: { userEmail: user.email } });
        setInWishlist(true);
        setWishlistIds(prev => new Set([...prev, parseInt(id)]));
        toast.success('Added to wishlist!');
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Wishlist action failed'); }
  };

  const handleWishlistToggle = async (productId) => {
    if (!user?.email) { navigate('/login'); return; }
    try {
      if (wishlistIds.has(productId)) {
        await API.delete(`/api/wishlist/remove/${productId}`, { params: { userEmail: user.email } });
        setWishlistIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
        if(productId === parseInt(id)) setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await API.post(`/api/wishlist/add/${productId}`, null, { params: { userEmail: user.email } });
        setWishlistIds(prev => new Set([...prev, productId]));
        if(productId === parseInt(id)) setInWishlist(true);
        toast.success('Added to wishlist!');
      }
    } catch (err) { toast.error('Wishlist action failed'); }
  };

  const handleAddToCartSimilar = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const checkDelivery = async () => {
    if(!pincode.trim()) return;
    try {
      setDeliveryError('');
      setDeliveryDate(null);
      const res = await API.get('/api/delivery/delivery-estimate', { params: { pincode } });
      setDeliveryDate(res.data);
    } catch (err) {
      setDeliveryError('Invalid pincode or not serviceable');
    }
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

            <div className="delivery-check" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg2)', borderRadius: '8px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}><Truck size={16} style={{display:'inline', marginRight:'4px'}}/> Check Delivery Estimate</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Enter Pincode (e.g. 400001)" 
                  value={pincode} 
                  onChange={(e) => setPincode(e.target.value)} 
                  style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)', flex: 1, background: 'var(--bg)' }}
                />
                <button className="btn-secondary" onClick={checkDelivery} style={{ padding: '8px 16px' }}>Check</button>
              </div>
              {deliveryDate && <p style={{ color: 'var(--green)', marginTop: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Estimated Delivery: {deliveryDate}</p>}
              {deliveryError && <p style={{ color: 'var(--red)', marginTop: '8px', fontSize: '0.9rem' }}>{deliveryError}</p>}
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

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="similar-products-section" style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Similar Products</h2>
            <div className="products-grid">
              {similarProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  inWishlist={wishlistIds.has(prod.id)}
                  onAddToCart={() => handleAddToCartSimilar(prod.id)}
                  onWishlist={() => handleWishlistToggle(prod.id)}
                  onClick={() => navigate(`/product/${prod.id}`)}
                />
              ))}
            </div>
          </div>
        )}
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

function ProductCard({ product, inWishlist, onAddToCart, onWishlist, onClick }) {
  const isDiscounted = product.finalPrice && product.finalPrice < product.price;
  return (
    <div className="product-card">
      <div className="product-img-wrap" onClick={onClick}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-img-placeholder"><Package size={48} /></div>
        )}
        {isDiscounted && (
          <span className="badge-discount">
            -{Math.round(((product.price - product.finalPrice) / product.price) * 100)}%
          </span>
        )}
        {!product.productAvailable && <span className="badge-oos">Out of Stock</span>}
        {product.lowStock && product.productAvailable && (
          <span className="badge-low-stock">⚠ Only {product.stockQuantity} left!</span>
        )}
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand || product.category?.name}</p>
        <h3 className="product-name" onClick={onClick}>{product.name}</h3>
        <div className="product-price">
          {isDiscounted ? (
            <>
              <span className="price-final">₹{product.finalPrice}</span>
              <span className="price-original">₹{product.price}</span>
            </>
          ) : (
            <span className="price-final">₹{product.price}</span>
          )}
        </div>
        <div className="product-actions">
          <button
            className="btn-cart"
            onClick={onAddToCart}
            disabled={!product.productAvailable}
            title={!product.productAvailable ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingCart size={16} />
            {product.productAvailable ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button
            className={`btn-wishlist ${inWishlist ? 'active' : ''}`}
            onClick={onWishlist}
          >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
