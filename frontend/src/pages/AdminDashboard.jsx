import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  TrendingUp, ShoppingBag, Users, Package,
  BarChart2, Trophy, ArrowUpRight, ShieldCheck,
  Zap, RefreshCw, UserCog, Star, Activity,
  AlertTriangle, CheckCircle, Clock, XCircle,
  Box, TrendingDown
} from 'lucide-react';

// Animated number counter
function useCountUp(target, duration = 1400, prefix = '', suffix = '') {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (target === null || target === undefined) return;
    const num = parseFloat(target);
    if (isNaN(num)) { setDisplay(String(target)); return; }
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      const fmt = num % 1 !== 0
        ? current.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : Math.floor(current).toLocaleString('en-IN');
      setDisplay(`${prefix}${fmt}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return display;
}

function StatCard({ label, rawValue, prefix = '', suffix = '', icon: Icon, color, bg, sub }) {
  const animated = useCountUp(rawValue, 1400, prefix, suffix);
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg, color }}>
        <Icon size={22} />
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value" style={{ color }}>{animated}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
      <ArrowUpRight size={16} className="stat-arrow" />
    </div>
  );
}

const STATUS_CONFIG = {
  PENDING:   { color: 'var(--yellow)', bg: 'rgba(245,158,11,.12)',  icon: Clock,        label: 'Pending'   },
  CONFIRMED: { color: 'var(--accent2)', bg: 'rgba(99,102,241,.12)', icon: CheckCircle,  label: 'Confirmed' },
  DELIVERED: { color: 'var(--green)',   bg: 'rgba(16,185,129,.12)', icon: CheckCircle,  label: 'Delivered' },
  CANCELLED: { color: 'var(--red)',     bg: 'rgba(239,68,68,.12)',   icon: XCircle,      label: 'Cancelled' },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') { navigate('/'); return; }
    fetchStats();
  }, [user]);

  const fetchStats = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const res = await API.get('/api/admin/dashboard-stats');
      setStats(res.data);
      setError('');
    } catch {
      setError('Failed to load stats.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) return (
    <div className="container"><div className="page-loading"><div className="spinner-lg" /></div></div>
  );
  if (error) return (
    <div className="container">
      <div className="empty-state">
        <BarChart2 size={48} /><h3>Could Not Load Dashboard</h3><p>{error}</p>
        <button className="btn-primary" onClick={() => fetchStats()}>Try Again</button>
      </div>
    </div>
  );

  const totalRevenue   = Number(stats?.totalRevenue ?? 0);
  const totalOrders    = Number(stats?.totalOrder ?? 0);
  const totalUsers     = Number(stats?.totalUsers ?? 0);
  const totalProducts  = Number(stats?.totalProducts ?? 0);
  const outOfStock     = Number(stats?.outOfStockProducts ?? 0);
  const lowStock       = Number(stats?.lowStockProducts ?? 0);
  const pendingOrders  = Number(stats?.pendingOrders ?? 0);
  const confirmedOrders = Number(stats?.confirmedOrders ?? 0);
  const deliveredOrders = Number(stats?.deliveredOrders ?? 0);
  const avgOrderVal    = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const topProducts    = stats?.topProduct ?? [];
  const recentOrders   = stats?.recentOrders ?? [];
  const maxQty         = topProducts.length > 0 ? topProducts[0].quantity : 1;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="adm-page">
      {/* ── Hero Banner ── */}
      <div className="adm-hero">
        <div className="adm-hero-glow" />
        <div className="adm-hero-content">
          <div>
            <p className="adm-greeting">{greeting}, {user?.fullName?.split(' ')[0] || 'Admin'} 👋</p>
            <h1 className="adm-hero-title"><BarChart2 size={30} /> Admin Dashboard</h1>
            <p className="adm-hero-sub">Real-time overview of your ShopZen store</p>
          </div>
          <div className="adm-hero-right">
            <span className="adm-badge"><ShieldCheck size={13} /> ADMIN</span>
            <button className="adm-refresh-btn" onClick={() => fetchStats(true)} disabled={refreshing}>
              <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="adm-body">

        {/* ── Row 1: Revenue + Orders + Users + Avg ── */}
        <div className="adm-stat-grid">
          <StatCard label="Total Revenue"    rawValue={totalRevenue}  prefix="₹" icon={TrendingUp} color="var(--green)"   bg="rgba(16,185,129,.15)" sub="All-time earnings" />
          <StatCard label="Total Orders"     rawValue={totalOrders}              icon={ShoppingBag} color="var(--accent2)" bg="rgba(99,102,241,.15)"  sub="Orders placed" />
          <StatCard label="Active Users"     rawValue={totalUsers}               icon={Users}       color="var(--yellow)"  bg="rgba(245,158,11,.15)"  sub="Registered accounts" />
          <StatCard label="Avg. Order Value" rawValue={avgOrderVal}   prefix="₹" icon={Activity}    color="var(--orange)"  bg="rgba(249,115,22,.15)"  sub="Revenue ÷ orders" />
        </div>

        {/* ── Row 2: Product Inventory Stats ── */}
        <div className="adm-stat-grid" style={{ marginBottom: 28 }}>
          <StatCard label="Total Products"  rawValue={totalProducts} icon={Package}      color="var(--accent2)" bg="rgba(99,102,241,.15)"  sub="In catalogue" />
          <StatCard label="Out of Stock"    rawValue={outOfStock}    icon={XCircle}       color="var(--red)"     bg="rgba(239,68,68,.15)"   sub="Needs restock" />
          <StatCard label="Low Stock"       rawValue={lowStock}      icon={AlertTriangle} color="var(--yellow)"  bg="rgba(245,158,11,.15)"  sub="Less than 10 units" />
          <StatCard label="Pending Orders"  rawValue={pendingOrders} icon={Clock}         color="var(--orange)"  bg="rgba(249,115,22,.15)"  sub="Awaiting action" />
        </div>

        {/* ── Row 3: Main Content Grid ── */}
        <div className="adm-bottom-grid">

          {/* Left: Top Products */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div className="adm-card-title">
                <Trophy size={18} style={{ color: 'var(--yellow)' }} />
                <h2>Top Selling Products</h2>
              </div>
              <span className="adm-pill">{topProducts.length} items</span>
            </div>
            {topProducts.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}><Package size={36} /><p>No sales data yet.</p></div>
            ) : (
              <div className="adm-product-list">
                {topProducts.map((p, i) => {
                  const pct = Math.max(6, (p.quantity / maxQty) * 100);
                  const medals = ['🥇', '🥈', '🥉'];
                  const colors = [
                    'linear-gradient(90deg,#10b981,#6366f1)',
                    'linear-gradient(90deg,#6366f1,#818cf8)',
                    'linear-gradient(90deg,#f59e0b,#f97316)',
                  ];
                  return (
                    <div className="adm-product-row" key={p.name}>
                      <span className="adm-rank">{medals[i] ?? `#${i + 1}`}</span>
                      <div className="adm-bar-info">
                        <div className="adm-bar-top">
                          <span className="adm-bar-name">{p.name}</span>
                          <span className="adm-bar-qty">{p.quantity} sold</span>
                        </div>
                        <div className="adm-bar-track">
                          <div className="adm-bar-fill" style={{ width: `${pct}%`, background: colors[i] ?? 'var(--bg3)', animationDelay: `${i * 100}ms` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="adm-right-col">

            {/* Order Status Breakdown */}
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-card-title">
                  <Zap size={18} style={{ color: 'var(--accent2)' }} />
                  <h2>Order Status</h2>
                </div>
              </div>
              <div className="adm-status-grid">
                {[
                  { label: 'Pending',   val: pendingOrders,   ...STATUS_CONFIG.PENDING   },
                  { label: 'Confirmed', val: confirmedOrders, ...STATUS_CONFIG.CONFIRMED },
                  { label: 'Delivered', val: deliveredOrders, ...STATUS_CONFIG.DELIVERED },
                ].map(s => (
                  <div className="adm-status-box" key={s.label} style={{ background: s.bg, borderColor: s.color + '44' }}>
                    <s.icon size={18} style={{ color: s.color }} />
                    <span className="adm-status-num" style={{ color: s.color }}>{s.val}</span>
                    <span className="adm-status-lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-card-title">
                  <Star size={18} style={{ color: 'var(--orange)' }} />
                  <h2>Quick Actions</h2>
                </div>
              </div>
              <div className="adm-actions-grid">
                <Link to="/" className="adm-action-btn"><Package size={18} /><span>View Products</span></Link>
                <Link to="/orders" className="adm-action-btn"><ShoppingBag size={18} /><span>View Orders</span></Link>
                <button className="adm-action-btn" onClick={() => fetchStats(true)}><RefreshCw size={18} /><span>Refresh</span></button>
                <Link to="/" className="adm-action-btn adm-action-accent"><UserCog size={18} /><span>Manage Store</span></Link>
              </div>
            </div>

          </div>
        </div>

        {/* ── Row 4: Recent Orders Table ── */}
        <div className="adm-card" style={{ marginTop: 24 }}>
          <div className="adm-card-header">
            <div className="adm-card-title">
              <Box size={18} style={{ color: 'var(--accent2)' }} />
              <h2>Recent Orders</h2>
            </div>
            <Link to="/orders" className="adm-pill" style={{ cursor: 'pointer', color: 'var(--accent2)' }}>View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}><ShoppingBag size={32} /><p>No orders yet.</p></div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => {
                    const cfg = STATUS_CONFIG[o.status?.toUpperCase()] ?? STATUS_CONFIG.PENDING;
                    return (
                      <tr key={o.id}>
                        <td className="adm-td-id">#{o.id}</td>
                        <td className="adm-td-email">{o.userEmail}</td>
                        <td className="adm-td-amt">₹{Number(o.totalAmount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td><span className="adm-method-badge">{o.paymentMethod ?? '—'}</span></td>
                        <td>
                          <span className="adm-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
                            {o.status ?? 'UNKNOWN'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
