import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Package, SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';

import HeroSection from '../components/HeroSection';
import FlashSaleSection from '../components/FlashSaleSection';
import ProductSection from '../components/ProductSection';
import CategoryGrid from '../components/CategoryGrid';
import OfferStrip from '../components/OfferStrip';
import FeaturedBrands from '../components/FeaturedBrands';
import Footer from '../components/Footer';
import ProductCardFlipkart from '../components/ProductCardFlipkart';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const urlSearch = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    if (user?.email) fetchWishlist();
  }, [user]);

  useEffect(() => {
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlSearch]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedCategory) {
        res = await API.get('/api/products/category', { params: { category: selectedCategory, page: 0, size: 60, sortBy } });
        setProducts(res.data.content || []);
      } else {
        res = await API.get('/api/products/page', { params: { page: 0, size: 60, sortBy } });
        setProducts(res.data.content || []);
      }
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/api/categories');
      setCategories(res.data);
    } catch { }
  };

  const fetchWishlist = async () => {
    try {
      const res = await API.get('/api/wishlist/get', { params: { userEmail: user.email } });
      const ids = new Set((res.data?.data?.products || []).map(p => p.id));
      setWishlistIds(ids);
    } catch { }
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
        setWishlistIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
        toast.success('Removed from wishlist');
      } else {
        await API.post(`/api/wishlist/add/${productId}`, null, { params: { userEmail: user.email } });
        setWishlistIds(prev => new Set([...prev, productId]));
        toast.success('Added to wishlist!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wishlist action failed');
    }
  };

  const filtered = useMemo(() =>
    products.filter(p =>
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [products, searchQuery]);

  const suggestedProducts = useMemo(() => products.slice(0, 20), [products]);
  const discountedProducts = useMemo(() => [...products].filter(p => (p.discountPercentage || 0) >= 10).slice(0, 20), [products]);
  const latestProducts = useMemo(() => [...products].reverse().slice(0, 20), [products]);
  const homeDecorProducts = useMemo(() =>
    products.filter(p => p.category?.name?.toLowerCase().includes('home') || p.category?.name?.toLowerCase().includes('decor')).slice(0, 20),
    [products]);

  const isSearching = searchQuery.trim().length > 0;

  // Page wrapper styles
  const pageStyle = { background: 'var(--bg)', minHeight: '100vh' };

  // Shared centered container style
  const containerStyle = {
    maxWidth: '1248px',
    width: '100%',
    margin: '0 auto',
    padding: '0 16px',
  };

  return (
    <div style={pageStyle}>
      {/* ── HERO BANNER ── */}
      <HeroSection />

      {/* ── MAIN CONTENT ── */}
      <div style={containerStyle}>

        {/* Category Icon Grid */}
        <CategoryGrid onCategorySelect={cat => { setSelectedCategory(cat); setSearchQuery(''); }} />

        {/* Offer Strip */}
        <OfferStrip />

        {/* Flash Sale */}
        <div style={{ marginBottom: '16px' }}>
          <FlashSaleSection />
        </div>

        {/* ── FILTER BAR ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '14px',
            background: 'var(--bg2)',
            border: '1px solid var(--bg3)',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '160px', maxWidth: '320px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter products..."
              style={{
                width: '100%',
                paddingLeft: '32px',
                paddingRight: searchQuery ? '32px' : '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '13px',
                borderRadius: '10px',
                outline: 'none',
                background: 'var(--bg3)',
                color: 'var(--text)',
                border: '1px solid transparent',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', flex: '1 1 auto', scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedCategory('')}
              style={{
                flexShrink: 0, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                background: !selectedCategory ? 'var(--accent)' : 'var(--bg3)',
                color: !selectedCategory ? 'white' : 'var(--text2)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              All
            </button>
            {categories.slice(0, 8).map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                style={{
                  flexShrink: 0, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  background: selectedCategory === c.name ? 'var(--accent)' : 'var(--bg3)',
                  color: selectedCategory === c.name ? 'white' : 'var(--text2)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <SlidersHorizontal size={14} style={{ color: 'var(--text3)' }} />
            <div style={{ position: 'relative' }}>
              <ChevronDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  paddingLeft: '10px', paddingRight: '28px', paddingTop: '7px', paddingBottom: '7px',
                  fontSize: '12px', borderRadius: '10px', appearance: 'none', outline: 'none',
                  background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--bg3)', cursor: 'pointer',
                }}
              >
                <option value="id">Default</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── SEARCH RESULTS ── */}
        {isSearching ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                Results for <span style={{ color: 'var(--accent)' }}>"{searchQuery}"</span>{' '}
                <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text3)' }}>({filtered.length} items)</span>
              </h2>
              <button onClick={() => setSearchQuery('')} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Clear
              </button>
            </div>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <ProductGrid products={filtered} wishlistIds={wishlistIds} onAddToCart={handleAddToCart} onWishlist={handleWishlist} />
            )}
          </div>
        ) : (
          /* ── HOMEPAGE SECTIONS ── */
          <>
            <ProductSection
              title="🛍️ Suggested For You"
              products={loading ? [] : suggestedProducts}
              loading={loading}
              wishlistIds={wishlistIds}
              onWishlistUpdate={fetchWishlist}
            />

            <ProductSection
              title="🔥 Fashion's Top Deals"
              products={loading ? [] : discountedProducts}
              loading={loading}
              accentColor="#ef4444"
              wishlistIds={wishlistIds}
              onWishlistUpdate={fetchWishlist}
            />

            <FeaturedBrands />

            <ProductSection
              title="⭐ In The Spotlight"
              products={loading ? [] : latestProducts}
              loading={loading}
              accentColor="#6366f1"
              wishlistIds={wishlistIds}
              onWishlistUpdate={fetchWishlist}
            />

            {homeDecorProducts.length > 0 && (
              <ProductSection
                title="🏠 Home Decor & Furnishing"
                products={homeDecorProducts}
                loading={loading}
                accentColor="#10b981"
                wishlistIds={wishlistIds}
                onWishlistUpdate={fetchWishlist}
              />
            )}

            {/* ── ALL PRODUCTS GRID ── */}
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--bg2)',
                border: '1px solid var(--bg3)',
                marginBottom: '16px',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid var(--bg3)',
              }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>📦 All Products</h2>
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>{filtered.length} products</span>
              </div>
              <div style={{ padding: '16px' }}>
                {loading ? (
                  <SkeletonGrid />
                ) : filtered.length === 0 ? (
                  <EmptyState />
                ) : (
                  <ProductGrid products={filtered} wishlistIds={wishlistIds} onAddToCart={handleAddToCart} onWishlist={handleWishlist} />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

function ProductGrid({ products, wishlistIds, onAddToCart, onWishlist }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
      gap: '12px',
    }}>
      {products.map(product => (
        <ProductCardFlipkart
          key={product.id}
          product={product}
          inWishlist={wishlistIds.has(product.id)}
          onAddToCart={() => onAddToCart(product.id)}
          onWishlist={() => onWishlist(product.id)}
        />
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '12px' }}>
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--bg)', border: '1px solid var(--bg3)' }}>
          <div style={{ height: '170px', background: 'var(--bg3)' }} />
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ height: '10px', width: '50%', borderRadius: '6px', background: 'var(--bg3)' }} />
            <div style={{ height: '14px', borderRadius: '6px', background: 'var(--bg3)' }} />
            <div style={{ height: '32px', borderRadius: '10px', background: 'var(--bg3)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <Package size={56} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--text3)' }} />
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>No products found</h3>
      <p style={{ fontSize: '14px', color: 'var(--text3)' }}>Try a different search or category</p>
    </div>
  );
}
