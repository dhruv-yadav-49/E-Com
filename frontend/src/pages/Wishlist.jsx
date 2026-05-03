import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, Package, ArrowLeft, Trash2, Loader2 } from 'lucide-react';

export default function Wishlist() {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await API.get('/api/wishlist/get', { params: { userEmail: user.email } });
      setWishlist(res.data?.data);
    } catch { setWishlist(null); }
    finally { setLoading(false); }
  };

  const handleRemove = async (productId) => {
    setActionLoading(prev => ({ ...prev, [productId]: 'remove' }));
    try {
      const res = await API.delete(`/api/wishlist/remove/${productId}`, { params: { userEmail: user.email } });
      setWishlist(res.data?.data);
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
    finally { setActionLoading(prev => ({ ...prev, [productId]: null })); }
  };

  const handleMoveToCart = async (productId) => {
    setActionLoading(prev => ({ ...prev, [productId]: 'cart' }));
    try {
      await API.post(`/api/wishlist/move-to-cart/${productId}`, {}, { params: { userEmail: user.email } });
      await refreshCart();
      await fetchWishlist();
      toast.success('Moved to cart');
    } catch { toast.error('Failed to move to cart'); }
    finally { setActionLoading(prev => ({ ...prev, [productId]: null })); }
  };

  const handleClear = async () => {
    try {
      await API.delete('/api/wishlist/clear', { params: { userEmail: user.email } });
      setWishlist(null);
      toast.success('Wishlist cleared!');
    } catch { toast.error('Failed to clear wishlist'); }
  };

  if (loading) return <div className="page-loading"><div className="spinner-lg" /></div>;

  const products = wishlist?.products || [];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>
          <h1><Heart size={28} /> My Wishlist</h1>
          {products.length > 0 && (
            <button className="btn-outline btn-sm" onClick={handleClear}>Clear All</button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <Heart size={72} />
            <h3>Your wishlist is empty</h3>
            <p>Save products you love and find them here!</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Browse Products</button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-img-wrap" onClick={() => navigate(`/product/${product.id}`)}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="product-img-placeholder"><Package size={48} /></div>
                  )}
                </div>
                <div className="product-info">
                  <p className="product-brand">{product.brand || product.category?.name}</p>
                  <h3 className="product-name" onClick={() => navigate(`/product/${product.id}`)}>
                    {product.name}
                  </h3>
                  <div className="product-price">
                    {product.finalPrice && product.finalPrice < product.price ? (
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
                      disabled={!!actionLoading[product.id]}
                      onClick={() => handleMoveToCart(product.id)}
                    >
                      {actionLoading[product.id] === 'cart' ? <Loader2 className="animate-spin" size={16} /> : <ShoppingCart size={16} />}
                      Move to Cart
                    </button>
                    <button 
                      className="btn-wishlist active" 
                      disabled={!!actionLoading[product.id]}
                      onClick={() => handleRemove(product.id)}
                    >
                      {actionLoading[product.id] === 'remove' ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
