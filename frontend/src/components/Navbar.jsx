import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import {
  ShoppingCart, Heart, Package, LogOut, User,
  LayoutDashboard, Search, Menu, X, ChevronDown,
  MapPin, Zap
} from 'lucide-react';

const CATEGORIES = ['For You', 'Fashion', 'Mobiles', 'Electronics', 'Beauty', 'Home', 'Appliances', 'Toys', 'Grocery', 'Sports'];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('For You');
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar" style={{ height: 'auto', paddingBottom: 0, borderBottom: 'none', background: 'var(--bg2)' }}>
      {/* Top bar */}
      <div className="nav-container" style={{ height: '72px', paddingBottom: 0 }}>
        {/* Logo */}
        <Link to="/" className="nav-brand" style={{ flexShrink: 0, marginRight: '16px' }}>
          <div className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-extrabold text-2xl tracking-tight">Shop</span>
              <span className="text-indigo-400 font-extrabold text-2xl">Zen</span>
            </div>
          </div>
        </Link>

        {/* Professional Search Bar (Amazon/Flipkart style) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-auto hidden md:flex items-center px-4">
          <div 
            className="w-full flex items-center rounded-lg overflow-hidden transition-all duration-200"
            style={{ 
              background: '#ffffff', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid transparent',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div className="pl-4" style={{ color: '#64748b' }}>
              <Search size={18} />
            </div>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full h-11 pl-3 pr-4 text-[15px] outline-none"
              style={{ color: '#0f172a', background: 'transparent' }}
            />
            <button
              type="submit"
              className="h-11 px-8 text-[15px] font-bold transition-all duration-200 flex items-center justify-center hover:brightness-110"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0 ml-auto">
          {/* Wishlist */}
          {isAuthenticated && (
            <Link 
              to="/wishlist" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-white/10 hidden lg:flex"
              style={{ color: 'var(--text)' }}
            >
              <Heart size={22} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[11px]" style={{ color: 'var(--text3)' }}>View</span>
                <span className="text-sm font-bold">Wishlist</span>
              </div>
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ color: 'var(--text)' }}
              >
                <div className="flex flex-col items-start leading-none hidden sm:flex">
                  <span className="text-[11px]" style={{ color: 'var(--text3)' }}>Hello, {user?.fullName?.split(' ')[0] || 'User'}</span>
                  <span className="text-sm font-bold flex items-center gap-1">Account & Lists <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} /></span>
                </div>
                <User size={22} className="sm:hidden" />
              </button>
              
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+4px)] mt-0 w-64 rounded-xl border shadow-2xl z-50 py-2 overflow-hidden"
                  style={{ background: 'var(--bg2)', borderColor: 'var(--bg3)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--bg3)' }}>
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{user?.fullName}</p>
                    <p className="text-xs mt-1 truncate" style={{ color: 'var(--text3)' }}>{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm hover:bg-white/5 transition-all" style={{ color: 'var(--text2)' }} onClick={() => setUserMenuOpen(false)}>
                      <Package size={18} /> My Orders
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 px-5 py-2.5 text-sm hover:bg-white/5 transition-all lg:hidden" style={{ color: 'var(--text2)' }} onClick={() => setUserMenuOpen(false)}>
                      <Heart size={18} /> My Wishlist
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-sm hover:bg-white/5 transition-all" style={{ color: 'var(--accent2)' }} onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={18} /> Admin Dashboard
                      </Link>
                    )}
                  </div>
                  <hr style={{ borderColor: 'var(--bg3)' }} className="my-1" />
                  <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-3 text-sm w-full text-left hover:bg-white/5 transition-all font-medium" style={{ color: 'var(--red)' }}>
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold hover:text-white transition-colors" style={{ color: 'var(--text2)' }}>Sign In</Link>
              <Link to="/register" className="px-5 py-2 text-sm font-bold rounded-lg transition-all hover:brightness-110" style={{ background: 'var(--accent)', color: 'white' }}>Sign Up</Link>
            </div>
          )}

          {/* Cart */}
          {isAuthenticated && (
            <Link 
              to="/cart" 
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-white/10"
              style={{ color: 'var(--text)' }}
            >
              <div className="relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold" style={{ background: 'var(--accent)', color: 'white', border: '2px solid var(--bg2)' }}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold hidden sm:block">Cart</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="p-2 rounded-lg hover:bg-white/10 md:hidden transition-all" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <div className="w-full flex items-center rounded-lg overflow-hidden" style={{ background: '#ffffff' }}>
            <div className="pl-3" style={{ color: '#64748b' }}><Search size={16} /></div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-2 pr-3 text-sm outline-none"
              style={{ color: '#0f172a', background: 'transparent' }}
            />
            <button type="submit" className="h-10 px-4 text-sm font-bold" style={{ background: 'var(--accent)', color: 'white' }}>
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Category Navigation Row */}
      <div style={{ background: 'var(--bg3)' }}>
        <div className="nav-container h-10 flex items-center px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full" style={{ paddingBottom: '2px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-3 py-1 rounded text-[13px] font-medium transition-colors whitespace-nowrap"
                style={{
                  color: activeCategory === cat ? 'white' : 'var(--text2)',
                  background: activeCategory === cat ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Open State) */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 shadow-xl" style={{ borderColor: 'var(--bg3)', background: 'var(--bg2)' }}>
          <div className="flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 mb-2 border-b" style={{ borderColor: 'var(--bg3)' }}>
                  <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{user?.fullName}</p>
                </div>
                <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}><Heart size={18} /> Wishlist</Link>
                <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}><Package size={18} /> Orders</Link>
                {user?.role === 'ADMIN' && <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5" style={{ color: 'var(--accent2)' }} onClick={() => setMenuOpen(false)}><LayoutDashboard size={18} /> Dashboard</Link>}
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left font-medium mt-2" style={{ color: 'var(--red)' }}><LogOut size={18} /> Sign Out</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" className="w-full py-2.5 text-center rounded-lg font-semibold border" style={{ borderColor: 'var(--bg3)' }} onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="w-full py-2.5 text-center rounded-lg font-bold" style={{ background: 'var(--accent)', color: 'white' }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
