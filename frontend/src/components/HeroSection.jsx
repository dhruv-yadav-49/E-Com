import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const FALLBACK_SLIDES = [
  {
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
    emoji: '⚡',
    title: 'Flash Deals Are Live!',
    sub: 'Up to 80% off on top brands',
    badge: 'LIMITED TIME',
    badgeColor: '#f59e0b',
    cta: 'Shop Flash Sale',
  },
  {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    emoji: '📱',
    title: 'Tech at Best Prices',
    sub: 'Smartphones, Laptops & More',
    badge: 'NEW ARRIVALS',
    badgeColor: '#10b981',
    cta: 'Explore Tech',
  },
  {
    bg: 'linear-gradient(135deg, #1a0533 0%, #3b0764 50%, #1a0533 100%)',
    emoji: '👗',
    title: "Fashion's Top Deals",
    sub: 'Min. 50% off on trending styles',
    badge: 'TRENDING',
    badgeColor: '#ec4899',
    cta: 'Shop Fashion',
  },
];

export default function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    API.get('/api/banners').then(res => setBanners(res.data || [])).catch(() => { });
  }, []);

  const slides = banners.length > 0 ? banners : null;

  useEffect(() => {
    const len = slides ? slides.length : FALLBACK_SLIDES.length;
    if (len <= 1) return;
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % len), 4500);
    return () => clearInterval(timerRef.current);
  }, [slides]);

  const len = slides ? slides.length : FALLBACK_SLIDES.length;
  const prev = () => { clearInterval(timerRef.current); setCurrent(c => (c - 1 + len) % len); };
  const next = () => { clearInterval(timerRef.current); setCurrent(c => (c + 1) % len); };

  return (
    <div className="w-full relative" style={{ height: '280px', overflow: 'hidden' }}>

      {/* ── BANNER API SLIDES ── */}
      {slides ? slides.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-all duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
        >
          {banner.imageUrl ? (
            <>
              <img src={banner.imageUrl} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.1) 60%)' }} />
            </>
          ) : (
            <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }} />
          )}
          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full">
              <div className="max-w-lg">
                {banner.title && <h1 className="text-4xl font-extrabold text-white mb-2 leading-tight">{banner.title}</h1>}
                {banner.subtitle && <p className="text-lg mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>{banner.subtitle}</p>}
                {banner.buttonText && (
                  <button
                    onClick={() => banner.buttonUrl && navigate(banner.buttonUrl)}
                    className="px-7 py-3 rounded-full font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                    style={{ background: 'var(--accent)' }}
                  >
                    {banner.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )) : FALLBACK_SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0, background: slide.bg, pointerEvents: i === current ? 'auto' : 'none' }}
        >
          {/* Decorative blobs */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: '#a78bfa' }} />
          <div className="absolute right-1/3 bottom-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: '#818cf8' }} />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between">
              {/* Left text */}
              <div className="max-w-lg">
                <span
                  className="inline-block text-xs font-extrabold tracking-widest px-3 py-1 rounded-full mb-4"
                  style={{ background: `${slide.badgeColor}22`, color: slide.badgeColor, border: `1px solid ${slide.badgeColor}44` }}
                >
                  {slide.badge}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">{slide.title}</h1>
                <p className="text-lg mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>{slide.sub}</p>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
                  style={{ background: 'var(--accent)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}
                >
                  <Zap size={16} /> {slide.cta}
                </button>
              </div>

              {/* Right emoji */}
              <div className="hidden md:flex items-center justify-center" style={{ fontSize: '120px', filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.5))' }}>
                {slide.emoji}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ── NAV BUTTONS ── */}
      {len > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ background: 'rgba(15,23,42,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ background: 'rgba(15,23,42,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ── DOTS ── */}
      {len > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {Array.from({ length: len }).map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === current ? '24px' : '8px', height: '8px', background: i === current ? 'white' : 'rgba(255,255,255,0.35)' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
