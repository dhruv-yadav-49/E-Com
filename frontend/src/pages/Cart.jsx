import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Package } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, fetchCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchCart();
      setLoading(false);
    };
    load();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await API.post('/api/order/place', { email: user.email, paymentMethod: 'ONLINE' });
      toast.success('Order placed successfully! 🎉');
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  if (loading) return <div className="page-loading"><div className="spinner-lg" /></div>;

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => {
    const price = item.product?.finalPrice || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
          <h1><ShoppingBag size={28} /> Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={72} />
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img" onClick={() => navigate(`/product/${item.product?.id}`)}>
                    {item.product?.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} />
                    ) : <div className="product-img-placeholder sm"><Package size={32} /></div>}
                  </div>
                  <div className="cart-item-info">
                    <h4 onClick={() => navigate(`/product/${item.product?.id}`)}>{item.product?.name}</h4>
                    <p className="cart-item-brand">{item.product?.brand}</p>
                    <div className="cart-item-price">
                      ₹{item.product?.finalPrice || item.product?.price}
                      {item.product?.finalPrice && item.product?.finalPrice < item.product?.price && (
                        <span className="original-sm">₹{item.product?.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="cart-item-qty">
                    <span className="qty-label">Qty: {item.quantity}</span>
                    <span className="item-total">
                      ₹{((item.product?.finalPrice || item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button className="btn-remove" onClick={() => handleRemove(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Items ({items.length})</span><span>₹{total.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span className="free">FREE</span></div>
              <div className="summary-divider" />
              <div className="summary-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              <button className="btn-primary btn-full" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? <span className="spinner" /> : '🛍️ Place Order'}
              </button>
              <button className="btn-outline btn-full" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
