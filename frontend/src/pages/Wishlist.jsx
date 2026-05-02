import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, Package, ArrowLeft, Trash2 } from 'lucide-react';

export default function Wishlist() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await API.delete(`/api/wishlist/remove/${productId}`, { params: { userEmail: user.email } });
      setWishlist(res.data?.data);
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  const handleClear = async () => {
    try {
      await API.delete('/api/wishlist/clear', { params: { userEmail: user.email } });
      setWishlist(null);
      toast.success('Wishlist cleared!');
    } catch { toast.error('Failed to clear wishlist'); }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
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
                    <button className="btn-cart" onClick={() => handleAddToCart(product.id)}>
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button className="btn-wishlist active" onClick={() => handleRemove(product.id)}>
                      <Trash2 size={18} />
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
