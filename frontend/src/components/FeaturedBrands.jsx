import { ChevronRight } from 'lucide-react';

const BRANDS = [
  { name: 'Samsung', emoji: '📱', tagline: 'Up to 40% Off', color: '#1428a0' },
  { name: 'boAt', emoji: '🎧', tagline: 'From ₹799', color: '#e63946' },
  { name: 'Nike', emoji: '👟', tagline: 'Min. 30% Off', color: '#1a1a1a' },
  { name: 'Apple', emoji: '🍎', tagline: 'Latest Models', color: '#555555' },
  { name: "Levi's", emoji: '👖', tagline: 'Up to 50% Off', color: '#c41e3a' },
  { name: 'Godrej', emoji: '🏠', tagline: 'Home Essentials', color: '#1b4332' },
];

export default function FeaturedBrands() {
  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', background: 'var(--bg2)', border: '1px solid var(--bg3)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--bg3)' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>✨ Featured Brands</h2>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '12px', fontWeight: 600, color: 'white',
          padding: '5px 14px', borderRadius: '20px',
          background: 'var(--accent)', border: 'none', cursor: 'pointer',
        }}>
          View All <ChevronRight size={12} />
        </button>
      </div>

      {/* Brand Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', padding: '16px' }}>
        {BRANDS.map((brand) => (
          <div
            key={brand.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px 12px',
              borderRadius: '14px',
              background: 'var(--bg)',
              border: '1px solid var(--bg3)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = brand.color; e.currentTarget.style.boxShadow = `0 8px 20px ${brand.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--bg3)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${brand.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              {brand.emoji}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>{brand.name}</p>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>{brand.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
