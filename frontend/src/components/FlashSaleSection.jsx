import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Zap, Clock, ChevronRight, ShoppingCart, Heart, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FlashSaleSection = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({});
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [wishlistIds, setWishlistIds] = useState(new Set());

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const response = await API.get('/api/flash-sales');
                const activeSales = response.data.filter(sale => new Date(sale.endTime) > new Date());
                setSales(activeSales);
            } catch (error) {
                console.error("Error fetching flash sales:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
        if (user?.email) fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const res = await API.get('/api/wishlist/get', { params: { userEmail: user.email } });
            const ids = new Set((res.data?.data?.products || []).map(p => p.id));
            setWishlistIds(ids);
        } catch { }
    };

    useEffect(() => {
        if (sales.length === 0) return;

        const timer = setInterval(() => {
            const newTimeLeft = {};
            let hasExpired = false;

            sales.forEach(sale => {
                const difference = +new Date(sale.endTime) - +new Date();
                if (difference > 0) {
                    newTimeLeft[sale.id] = {
                        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                        minutes: Math.floor((difference / 1000 / 60) % 60),
                        seconds: Math.floor((difference / 1000) % 60)
                    };
                } else {
                    hasExpired = true;
                }
            });

            setTimeLeft(newTimeLeft);

            if (hasExpired) {
                setSales(prevSales => prevSales.filter(sale => new Date(sale.endTime) > new Date()));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [sales]);

    const handleNotifyMe = async (productId) => {
        let email = user?.email;
        if (!email) {
            email = prompt("Please enter your email to get notified:");
            if (!email) return;
        }

        try {
            await API.post('/api/waitlist/add', null, { params: { productId, email } });
            toast.success('Waitlist updated! We will notify you.');
        } catch {
            toast.error('Failed to update waitlist');
        }
    };

    const handleAddToCart = async (productId, e) => {
        const btn = e.currentTarget;
        btn.classList.add('confetti-active');
        setTimeout(() => btn.classList.remove('confetti-active'), 600);

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

    if (loading) {
        return (
            <section className="fs-section mb-5">
                <div className="fs-header">
                    <div className="fs-title-box">
                        <div className="skeleton-shimmer" style={{ width: '120px', height: '32px', borderRadius: '8px' }}></div>
                        <div className="skeleton-shimmer" style={{ width: '150px', height: '32px', borderRadius: '50px' }}></div>
                    </div>
                </div>
                <div className="fs-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="sk-item">
                            <div className="sk-img skeleton-shimmer"></div>
                            <div className="sk-text skeleton-shimmer" style={{ width: '80%' }}></div>
                            <div className="sk-price skeleton-shimmer"></div>
                            <div className="sk-btn skeleton-shimmer" style={{ width: '100%' }}></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (sales.length === 0) return null;

    return (
        <section className="fs-section mb-5">
            <div className="fs-bolt bolt-1"></div>
            <div className="fs-bolt bolt-2"></div>
            <div className="fs-bolt bolt-3"></div>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -468px 0; }
                    100% { background-position: 468px 0; }
                }
                .skeleton-shimmer {
                    background: #f6f7f8;
                    background-image: linear-gradient(to right, #1e293b 0%, #334155 20%, #1e293b 40%, #1e293b 100%);
                    background-repeat: no-repeat;
                    background-size: 800px 104px;
                    display: inline-block;
                    position: relative;
                    animation-duration: 1.2s;
                    animation-fill-mode: forwards;
                    animation-iteration-count: infinite;
                    animation-name: shimmer;
                    animation-timing-function: linear;
                }
                .sk-item { width: 240px; min-height: 320px; flex-shrink: 0; background: var(--bg); border: 1px solid var(--bg3); border-radius: var(--radius); padding: 12px; }
                .sk-img { width: 100%; height: 180px; border-radius: 8px; margin-bottom: 12px; }
                .sk-text { height: 16px; border-radius: 4px; margin-bottom: 8px; }
                .sk-price { height: 20px; width: 60%; border-radius: 4px; margin-bottom: 12px; }
                .sk-btn { height: 32px; border-radius: 8px; }

                .fs-section {
                    background: var(--bg2);
                    border: 1px solid var(--bg3);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                }
                .fs-bolt {
                    position: absolute;
                    width: 2px;
                    height: 60px;
                    background: linear-gradient(to bottom, transparent, var(--yellow), transparent);
                    opacity: 0;
                    filter: blur(1px);
                    pointer-events: none;
                    z-index: 1;
                }
                .bolt-1 { top: -10%; left: 20%; animation: lightning-fall 4s infinite 1s; }
                .bolt-2 { top: -20%; left: 50%; animation: lightning-fall 5s infinite 2.5s; }
                .bolt-3 { top: -15%; left: 80%; animation: lightning-fall 4.5s infinite 0.5s; }

                @keyframes lightning-fall {
                    0% { transform: translateY(-100px) rotate(25deg); opacity: 0; }
                    10% { opacity: 0.8; }
                    20% { transform: translateY(400px) rotate(25deg); opacity: 0; }
                    100% { transform: translateY(400px) rotate(25deg); opacity: 0; }
                }

                .confetti-btn {
                    position: relative;
                }
                .confetti-bit {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    opacity: 0;
                    pointer-events: none;
                }
                .confetti-active .confetti-bit {
                    animation: confetti-pop 0.6s ease-out forwards;
                }
                @keyframes confetti-pop {
                    0% { transform: translate(0, 0); opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
                }

                .fs-section::after {
                    content: '';
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    background: radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.1), transparent 50%);
                    pointer-events: none;
                }
                .fs-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 16px;
                    z-index: 2;
                    position: relative;
                }
                .fs-title-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .fs-badge {
                    background: linear-gradient(135deg, #f59e0b, #ef4444);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }
                .fs-timer {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--bg3);
                    padding: 4px 12px;
                    border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .timer-part {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .timer-num {
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--yellow);
                    min-width: 24px;
                    text-align: center;
                    transition: color 0.3s;
                }
                .timer-num.urgent {
                    color: var(--red);
                    text-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
                }
                .timer-sep {
                    color: var(--text3);
                    font-weight: bold;
                }
                .timer-sep.urgent {
                    color: var(--red);
                }
                .timer-unit-lbl {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    color: var(--text3);
                    font-weight: 600;
                }
                .fs-ending-soon-badge {
                    background: var(--red);
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 2px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    margin-left: 8px;
                    animation: glow-red 1.5s infinite;
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
                }
                @keyframes glow-red {
                    0% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); transform: scale(1); }
                    50% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.8); transform: scale(1.05); }
                    100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); transform: scale(1); }
                }
                .fs-grid {
                    display: flex;
                    gap: 16px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    scrollbar-width: thin;
                    scrollbar-color: var(--bg3) transparent;
                }
                .fs-grid::-webkit-scrollbar {
                    height: 6px;
                }
                .fs-grid::-webkit-scrollbar-thumb {
                    background: var(--bg3);
                    border-radius: 10px;
                }
                .fs-item {
                    min-width: 240px;
                    flex-shrink: 0;
                    background: var(--bg);
                    border: 1px solid var(--bg3);
                    border-radius: var(--radius);
                    padding: 12px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .fs-item:hover {
                    border-color: var(--accent);
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.2);
                }
                .fs-img-wrap {
                    position: relative;
                    height: 180px;
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                    margin-bottom: 12px;
                    cursor: pointer;
                }
                .fs-img-wrap img {
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .fs-item:hover .fs-img-wrap img {
                    transform: scale(1.15);
                }
                .fs-discount-badge {
                    position: absolute;
                    top: 8px; left: 8px;
                    background: var(--red);
                    color: white;
                    font-weight: 800;
                    font-size: 0.75rem;
                    padding: 4px 8px;
                    border-radius: 6px;
                }
                .fs-item-name {
                    font-size: 0.95rem;
                    font-weight: 600;
                    margin-bottom: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    cursor: pointer;
                }
                .fs-item-price {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .fs-price-final {
                    font-weight: 800;
                    font-size: 1.1rem;
                    color: white;
                }
                .fs-price-orig {
                    text-decoration: line-through;
                    color: var(--text3);
                    font-size: 0.85rem;
                }
                .fs-stock-info {
                    margin-bottom: 12px;
                }
                .fs-progress-container {
                    height: 6px;
                    background: var(--bg3);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 4px;
                }
                .fs-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #f59e0b, #ef4444);
                    border-radius: 10px;
                    transition: width 1s ease-in-out;
                }
                .fs-stock-text {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--text2);
                }
                .fs-stock-urgent {
                    color: #ef4444;
                    animation: pulse-red 2s infinite;
                }
                @keyframes pulse-red {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                .fs-actions {
                    display: flex;
                    gap: 8px;
                }
                .btn-fs-cart {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 8px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: 0.2s;
                }
                .btn-fs-cart:hover:not(:disabled) { 
                    background: var(--accent-hover); 
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                .btn-fs-cart:active { transform: scale(0.95); }
                .btn-fs-wish {
                    background: var(--bg3);
                    border: 1px solid var(--border);
                    color: var(--text2);
                    padding: 8px;
                    border-radius: 8px;
                    transition: 0.2s;
                }
                .btn-fs-wish.active { color: var(--red); }
                .view-all-btn {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: var(--accent2);
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: 0.2s;
                }
                .view-all-btn:hover { color: var(--accent); gap: 6px; }
            `}</style>

            <div className="fs-header">
                <div className="fs-title-box">
                    <div className="fs-badge">
                        <Zap size={18} fill="currentColor" />
                        FLASH SALE
                    </div>
                    {sales[0] && timeLeft[sales[0].id] && (
                        <div className="fs-timer">
                            <Clock size={14} className="text-muted" />
                            {(() => {
                                const t = timeLeft[sales[0].id];
                                const isUrgent = t.hours === 0 && t.minutes < 30;
                                return (
                                    <>
                                        <div className="timer-part">
                                            <span className={`timer-num ${isUrgent ? 'urgent' : ''}`}>{String(t.hours).padStart(2, '0')}</span>
                                            <span className="timer-unit-lbl">h</span>
                                        </div>
                                        <span className={`timer-sep ${isUrgent ? 'urgent' : ''}`}>:</span>
                                        <div className="timer-part">
                                            <span className={`timer-num ${isUrgent ? 'urgent' : ''}`}>{String(t.minutes).padStart(2, '0')}</span>
                                            <span className="timer-unit-lbl">m</span>
                                        </div>
                                        <span className={`timer-sep ${isUrgent ? 'urgent' : ''}`}>:</span>
                                        <div className="timer-part">
                                            <span className={`timer-num ${isUrgent ? 'urgent' : ''}`}>{String(t.seconds).padStart(2, '0')}</span>
                                            <span className="timer-unit-lbl">s</span>
                                        </div>
                                        {isUrgent && <span className="fs-ending-soon-badge">Ending Soon</span>}
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>
                <button className="view-all-btn btn-ghost" onClick={() => navigate('/products')}>
                    View All <ChevronRight size={18} />
                </button>
            </div>

            <div className="fs-grid">
                {sales.map(sale => (
                    (sale.products || []).map(product => (
                        <div key={`${sale.id}-${product.id}`} className="fs-item">
                            <div className="fs-img-wrap" onClick={() => navigate(`/product/${product.id}`)}>
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} />
                                ) : (
                                    <div className="product-img-placeholder"><Package size={40} /></div>
                                )}
                                {product.finalPrice !== null && product.finalPrice < product.price && product.finalPrice > 0 && (
                                    <span className="fs-discount-badge">
                                        -{Math.round(((product.price - product.finalPrice) / product.price) * 100)}%
                                    </span>
                                )}
                            </div>
                            <h3 className="fs-item-name" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
                            <div className="fs-item-price">
                                <div>
                                    <span className="fs-price-final">₹{(product.finalPrice !== null && product.finalPrice !== undefined) ? product.finalPrice : product.price}</span>
                                    {(product.finalPrice !== null && product.finalPrice < product.price) && (
                                        <span className="fs-price-orig ms-2">₹{product.price}</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Stock Progress Bar */}
                            <div className="fs-stock-info">
                                {(() => {
                                    const initial = product.flashSaleInitialStock || (product.stockQuantity + 10); // fallback
                                    const current = product.stockQuantity;
                                    const claimed = Math.max(5, Math.min(95, Math.round(((initial - current) / initial) * 100)));
                                    
                                    return (
                                        <>
                                            <div className="fs-progress-container">
                                                <div 
                                                    className="fs-progress-bar" 
                                                    style={{ width: `${claimed}%` }}
                                                ></div>
                                            </div>
                                            <div className="fs-stock-text">
                                                <span>{claimed}% claimed</span>
                                                {product.stockQuantity < 10 && (
                                                    <span className="fs-stock-urgent">Only {product.stockQuantity} left!</span>
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="fs-actions">
                                {product.productAvailable ? (
                                    <button 
                                        className="btn-fs-cart confetti-btn" 
                                        onClick={(e) => handleAddToCart(product.id, e)}
                                    >
                                        <ShoppingCart size={14} />
                                        Add
                                        {/* Confetti Bits */}
                                        {[...Array(6)].map((_, i) => (
                                            <span 
                                                key={i} 
                                                className="confetti-bit" 
                                                style={{ 
                                                    '--tx': `${(i - 2.5) * 20}px`, 
                                                    '--ty': `${-30 - Math.random() * 20}px`,
                                                    background: ['#ffc107', '#ff4b2b', '#6366f1', '#10b981'][i % 4],
                                                    left: '50%', top: '50%'
                                                }}
                                            />
                                        ))}
                                    </button>
                                ) : (
                                    <button 
                                        className="btn-fs-cart" 
                                        style={{ background: 'var(--bg3)', color: 'var(--text2)' }}
                                        onClick={() => handleNotifyMe(product.id)}
                                    >
                                        <Package size={14} />
                                        Notify Me
                                    </button>
                                )}
                                <button 
                                    className={`btn-fs-wish ${wishlistIds.has(product.id) ? 'active' : ''}`}
                                    onClick={() => handleWishlist(product.id)}
                                >
                                    <Heart size={16} fill={wishlistIds.has(product.id) ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                        </div>
                    ))
                ))}
                {/* Fallback if no products linked to the sale directly, show a placeholder card */}
                {sales.length > 0 && sales.every(s => !s.products || s.products.length === 0) && (
                    sales.map(sale => (
                        <div key={sale.id} className="fs-item d-flex flex-column justify-content-center align-items-center text-center p-4">
                            <Zap size={48} className="text-warning mb-3" />
                            <h4 className="fw-bold">{sale.title}</h4>
                            <p className="text-muted small mb-3">{sale.discountDescription}</p>
                            <button className="btn-primary btn-sm" onClick={() => navigate('/products')}>Browse Deals</button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default FlashSaleSection;
