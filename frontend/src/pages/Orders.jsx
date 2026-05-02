import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Package, Clock, CheckCircle, XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

const STATUS_ICONS = {
  PENDING: <Clock size={16} className="status-pending" />,
  CONFIRMED: <CheckCircle size={16} className="status-confirmed" />,
  DELIVERED: <CheckCircle size={16} className="status-delivered" />,
  CANCELLED: <XCircle size={16} className="status-cancelled" />,
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get(`/api/order/${user.email}`);
      setOrders(res.data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="page-loading"><div className="spinner-lg" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>
          <h1><ShoppingBag size={28} /> My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={72} />
            <h3>No orders yet</h3>
            <p>Your order history will appear here</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order.id}</span>
                  </div>
                  <span className={`order-status status-${order.status?.toLowerCase()}`}>
                    {STATUS_ICONS[order.status] || <Clock size={16} />}
                    {order.status || 'PENDING'}
                  </span>
                </div>
                <div className="order-items">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="order-item-row">
                      <span>{item.product?.name || 'Product'}</span>
                      <span>x{item.quantity}</span>
                      <span>₹{((item.product?.finalPrice || item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="order-method">{order.paymentMethod || 'ONLINE'}</span>
                  <span className="order-total">Total: <strong>₹{order.totalAmount || '—'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
