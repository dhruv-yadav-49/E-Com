import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Package } from 'lucide-react';
import { useState } from 'react';

const URGENCY = {
  few_left: { label: '⚡ Only Few Left', color: '#ef4444' },
  selling_fast: { label: '🔥 Selling Fast', color: '#f97316' },
  top_rated: { label: '⭐ Top Rated', color: '#f59e0b' },
  trending: { label: '📈 Trending', color: '#8b5cf6' },
};

function getUrgency(product) {
  if (product.stockQuantity <= 5 && product.stockQuantity > 0) return 'few_left';
  if (product.discountPercentage >= 30) return 'selling_fast';
  if (product.stockQuantity > 0 && product.stockQuantity <= 15) return 'trending';
  return null;
}

function getStockProgress(product) {
  const initial = product.flashSaleInitialStock;
  if (!initial || initial <= 0) return null;
  return Math.max(5, Math.min(95, Math.round(((initial - product.stockQuantity) / initial) * 100)));
}

export default function ProductCardFlipkart({ product, inWishlist, onAddToCart, onWishlist, showProgress = false }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const isDiscounted = product.finalPrice && parseFloat(product.finalPrice) < parseFloat(product.price);
  const discountPct = isDiscounted
    ? Math.round(((parseFloat(product.price) - parseFloat(product.finalPrice)) / parseFloat(product.price)) * 100)
    : null;
  const urgency = getUrgency(product);
  const stockProgress = showProgress ? getStockProgress(product) : null;
  const fakeRating = (3.8 + ((product.id * 7) % 12) / 10).toFixed(1);
  const fakeReviews = (1000 + (product.id * 37 % 5000)).toLocaleString();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '190px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--bg)',
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--bg3)'}`,
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 32px rgba(99,102,241,0.2)' : '0 2px 8px rgba(0,0,0,0.15)',
        position: 'relative',
      }}
    >
      {/* ── IMAGE ── */}
      <div style={{ position: 'relative', height: '170px', background: 'var(--bg2)', overflow: 'hidden' }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
            <Package size={44} />
          </div>
        )}

        {/* Discount badge */}
        {discountPct && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#ef4444', color: 'white',
            fontSize: '11px', fontWeight: 700,
            padding: '2px 7px', borderRadius: '6px',
          }}>
            -{discountPct}%
          </span>
        )}

        {/* OOS badge */}
        {!product.productAvailable && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#64748b', color: 'white',
            fontSize: '10px', fontWeight: 600,
            padding: '2px 7px', borderRadius: '6px',
          }}>
            Out of Stock
          </span>
        )}

        {/* Urgency label */}
        {urgency && product.productAvailable && (
          <span style={{
            position: 'absolute', top: '8px', right: '8px',
            background: `${URGENCY[urgency].color}22`,
            color: URGENCY[urgency].color,
            border: `1px solid ${URGENCY[urgency].color}55`,
            fontSize: '9px', fontWeight: 700,
            padding: '2px 6px', borderRadius: '20px',
            whiteSpace: 'nowrap',
          }}>
            {URGENCY[urgency].label}
          </span>
        )}

        {/* Wishlist btn */}
        <button
          onClick={e => { e.stopPropagation(); onWishlist?.(); }}
          style={{
            position: 'absolute', bottom: '8px', right: '8px',
            width: '30px', height: '30px',
            borderRadius: '50%',
            background: inWishlist ? '#ef4444' : 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0.7)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
        >
          <Heart size={13} fill={inWishlist ? 'white' : 'none'} color="white" />
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: '10px 12px 12px' }}>
        {/* Brand */}
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', marginBottom: '3px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {product.brand || product.category?.name || 'ShopZen'}
        </p>

        {/* Name */}
        <h3 style={{
          fontSize: '13px', fontWeight: 600, color: 'var(--text)',
          marginBottom: '6px', lineHeight: '1.35',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '36px',
        }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            background: '#10b981', color: 'white',
            fontSize: '10px', fontWeight: 700,
            padding: '1px 6px', borderRadius: '4px',
          }}>
            {fakeRating} <Star size={8} fill="white" />
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text3)' }}>({fakeReviews})</span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)' }}>
            ₹{isDiscounted ? Number(product.finalPrice).toLocaleString() : Number(product.price).toLocaleString()}
          </span>
          {isDiscounted && (
            <span style={{ fontSize: '11px', color: 'var(--text3)', textDecoration: 'line-through' }}>
              ₹{Number(product.price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock progress bar */}
        {stockProgress !== null && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ height: '5px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg3)' }}>
              <div style={{
                height: '100%', borderRadius: '4px',
                width: `${stockProgress}%`,
                background: stockProgress > 70 ? '#ef4444' : '#f59e0b',
                transition: 'width 1s ease',
              }} />
            </div>
            <p style={{ fontSize: '10px', color: stockProgress > 70 ? '#ef4444' : 'var(--text3)', marginTop: '2px' }}>
              {stockProgress}% Claimed
            </p>
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={e => { e.stopPropagation(); if (product.productAvailable) onAddToCart?.(); }}
          disabled={!product.productAvailable}
          style={{
            width: '100%',
            padding: '8px 0',
            borderRadius: '10px',
            fontSize: '12px', fontWeight: 700,
            background: product.productAvailable ? 'var(--accent)' : 'var(--bg3)',
            color: product.productAvailable ? 'white' : 'var(--text3)',
            border: 'none',
            cursor: product.productAvailable ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'all 0.2s ease',
            transform: hovered && product.productAvailable ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <ShoppingCart size={13} />
          {product.productAvailable ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
