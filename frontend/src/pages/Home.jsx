import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Search, ShoppingCart, Heart, Star, Filter, X, ChevronDown, Package } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    if (user?.email) fetchWishlist();
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedCategory) {
        res = await API.get('/api/products/category', { params: { category: selectedCategory, page: 0, size: 50, sortBy } });
        setProducts(res.data.content || []);
      } else {
        res = await API.get('/api/products/page', { params: { page: 0, size: 50, sortBy } });
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
    } catch {}
  };

  const fetchWishlist = async () => {
    try {
      const res = await API.get('/api/wishlist/get', { params: { userEmail: user.email } });
      const ids = new Set((res.data?.data?.products || []).map(p => p.id));
      setWishlistIds(ids);
    } catch {}
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return fetchProducts();
    try {
      const res = await API.get('/api/products/search', { params: { keyword: search } });
      setProducts(res.data);
    } catch { toast.error('Search failed'); }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
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

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop the best deals with fast delivery and easy returns</p>
          <form onSubmit={handleSearch} className="hero-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <div className="container">
        {/* Filters */}
        <div className="filters-bar">
          <div className="category-pills">
            <button
              className={`pill ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                className={`pill ${selectedCategory === c.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="sort-select">
            <ChevronDown size={16} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="id">Default</option>
              <option value="price">Price: Low to High</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h3>No products found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                inWishlist={wishlistIds.has(product.id)}
                onAddToCart={() => handleAddToCart(product.id)}
                onWishlist={() => handleWishlist(product.id)}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, inWishlist, onAddToCart, onWishlist, onClick }) {
  const isDiscounted = product.finalPrice && product.finalPrice < product.price;
  return (
    <div className="product-card">
      <div className="product-img-wrap" onClick={onClick}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-img-placeholder"><Package size={48} /></div>
        )}
        {isDiscounted && (
          <span className="badge-discount">
            -{Math.round(((product.price - product.finalPrice) / product.price) * 100)}%
          </span>
        )}
        {!product.productAvailable && <span className="badge-oos">Out of Stock</span>}
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand || product.category?.name}</p>
        <h3 className="product-name" onClick={onClick}>{product.name}</h3>
        <div className="product-price">
          {isDiscounted ? (
            <>
              <span className="price-final">₹{product.finalPrice}</span>
              <span className="price-original">₹{product.price}</span>
            </>
          ) : (
            <span className="price-final">₹{product.price}</span>
          )}
        </div>
        <div className="product-actions">
          <button
            className="btn-cart"
            onClick={onAddToCart}
            disabled={!product.productAvailable}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
          <button
            className={`btn-wishlist ${inWishlist ? 'active' : ''}`}
            onClick={onWishlist}
          >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
