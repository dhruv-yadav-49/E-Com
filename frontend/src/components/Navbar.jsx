import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Package, LogOut, LogIn, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Package size={26} />
          <span>ShopZen</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/wishlist" className="nav-link" onClick={() => setMenuOpen(false)}>
                <Heart size={16} /> Wishlist
              </Link>
              <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
                <Package size={16} /> Orders
              </Link>
            </>
          )}
        </div>

        <div className="nav-actions">
          {isAuthenticated && (
            <Link to="/cart" className="nav-icon-btn">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-avatar">
                <User size={18} />
                <span>{user?.fullName?.split(' ')[0] || 'Account'}</span>
              </button>
              <div className="user-dropdown">
                <span className="dropdown-email">{user?.email}</span>
                <hr />
                <button onClick={handleLogout} className="dropdown-item">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
