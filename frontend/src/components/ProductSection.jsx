import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCardFlipkart from './ProductCardFlipkart';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductSection({
  title,
  products = [],
  loading = false,
  accentColor = null,
  showProgress = false,
  wishlistIds = new Set(),
  onWishlistUpdate,
}) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 440, behavior: 'smooth' });
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async (productId) => {
    if (!user?.email) { navigate('/login'); return; }
    try {
      if (wishlistIds.has(productId)) {
        await API.delete(`/api/wishlist/remove/${productId}`, { params: { userEmail: user.email } });
        toast.success('Removed from wishlist');
      } else {
        await API.post(`/api/wishlist/add/${productId}`, null, { params: { userEmail: user.email } });
        toast.success('Added to wishlist!');
      }
      onWishlistUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wishlist action failed');
    }
  };

  if (!loading && products.length === 0) return null;

  return (
    <div
      className="rounded-2xl mb-4"
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--bg3)',
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background: accentColor
            ? `linear-gradient(90deg, ${accentColor}cc, ${accentColor}44 60%, transparent)`
            : 'transparent',
          borderBottom: '1px solid var(--bg3)',
        }}
      >
        <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105 flex-shrink-0"
          style={{ background: accentColor || 'var(--accent)', color: 'white' }}
        >
          View All <ChevronRight size={12} />
        </button>
      </div>

      {/* Cards Scroll Area */}
      <div className="relative px-2 py-4">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--bg2), transparent)' }} />
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--bg2), transparent)' }} />

        {/* Scroll container */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            overflowY: 'visible',
            paddingBottom: '4px',
            paddingLeft: '8px',
            paddingRight: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : products.map(product => (
              <ProductCardFlipkart
                key={product.id}
                product={product}
                inWishlist={wishlistIds.has(product.id)}
                onAddToCart={() => handleAddToCart(product.id)}
                onWishlist={() => handleWishlist(product.id)}
                showProgress={showProgress}
              />
            ))
          }
        </div>

        {/* Scroll Buttons */}
        {!loading && products.length > 4 && (
          <>
            <button
              onClick={() => scroll(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-xl z-20 transition-all hover:scale-110"
              style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--bg3)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-xl z-20 transition-all hover:scale-110"
              style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--bg3)' }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        flexShrink: 0,
        width: '190px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--bg)',
        border: '1px solid var(--bg3)',
      }}
    >
      <div style={{ height: '170px', background: 'var(--bg3)', animation: 'pulse 2s infinite' }} />
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '10px', width: '50%', borderRadius: '6px', background: 'var(--bg3)' }} />
        <div style={{ height: '14px', borderRadius: '6px', background: 'var(--bg3)' }} />
        <div style={{ height: '14px', width: '70%', borderRadius: '6px', background: 'var(--bg3)' }} />
        <div style={{ height: '32px', borderRadius: '10px', background: 'var(--bg3)' }} />
      </div>
    </div>
  );
}
