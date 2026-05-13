import { useNavigate } from 'react-router-dom';
import { Cpu, Shirt, Smartphone, Sparkles, Home, Zap, ShoppingBag, Bike, Dumbbell, BookOpen } from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics', icon: Cpu, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { name: 'Fashion', icon: Shirt, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { name: 'Mobiles', icon: Smartphone, color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
  { name: 'Beauty', icon: Sparkles, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { name: 'Home', icon: Home, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { name: 'Appliances', icon: Zap, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  { name: 'Bags', icon: ShoppingBag, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  { name: 'Sports', icon: Dumbbell, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { name: 'Books', icon: BookOpen, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  { name: 'Bikes', icon: Bike, color: '#84cc16', bg: 'rgba(132,204,22,0.12)' },
];

export default function CategoryGrid({ onCategorySelect }) {
  return (
    <div style={{ padding: '16px 0', marginBottom: '4px' }}>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(({ name, icon: Icon, color, bg }) => (
          <button
            key={name}
            onClick={() => onCategorySelect?.(name)}
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '16px',
              background: 'var(--bg2)',
              border: '1px solid var(--bg3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '80px',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={22} style={{ color }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
