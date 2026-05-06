import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import {
  TrendingUp, ShoppingBag, Users, Package,
  BarChart2, Trophy, ArrowUpRight, ShieldCheck,
  Zap, RefreshCw, UserCog, Star, Activity,
  AlertTriangle, CheckCircle, Clock, XCircle,
  Box, TrendingDown
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

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

const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [pendingReturns, setPendingReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') { navigate('/'); return; }
    fetchData();
  }, [user]);

  const fetchData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const [statsRes, analyticsRes, returnsRes] = await Promise.all([
        API.get('/api/admin/dashboard-stats'),
        API.get('/api/admin/analytics'),
        API.get('/api/returns-request/pending')
      ]);
      setStats(statsRes.data);
      if (analyticsRes.data && analyticsRes.data.data) {
        setAnalytics(analyticsRes.data.data);
      }
      setPendingReturns(returnsRes.data || []);
      setError('');
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApproveReturn = async (id) => {
    try {
      await API.post(`/api/returns-request/approve/${id}`, null, { params: { note: 'Approved by admin' } });
      toast.success('Return approved!');
      fetchData(true);
    } catch { toast.error('Failed to approve'); }
  };

  const handleRejectReturn = async (id) => {
    try {
      await API.post(`/api/returns-request/reject/${id}`, null, { params: { note: 'Rejected by admin' } });
      toast.success('Return rejected!');
      fetchData(true);
    } catch { toast.error('Failed to reject'); }
  };

  if (loading) return (
    <div className="container"><div className="page-loading"><div className="spinner-lg" /></div></div>
  );
  if (error) return (
    <div className="container">
      <div className="empty-state">
        <BarChart2 size={48} /><h3>Could Not Load Dashboard</h3><p>{error}</p>
        <button className="btn-primary" onClick={() => fetchData()}>Try Again</button>
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

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg2)', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: 'var(--text1)' }}>{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, display: 'inline-block' }}></span>
              {entry.name}: {prefix}{Number(entry.value).toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
            <button className="adm-refresh-btn" onClick={() => fetchData(true)} disabled={refreshing}>
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

        {/* ── Analytics Charts ── */}
        {analytics && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} style={{ color: 'var(--green)' }}/> Analytics Overview
            </h2>
            <div className="adm-bottom-grid">
              {/* Revenue Chart */}
              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-title">
                    <Activity size={18} style={{ color: 'var(--green)' }} />
                    <h2>Monthly Revenue</h2>
                  </div>
                </div>
                <div style={{ width: '100%', height: 300, padding: '10px 0' }}>
                  <ResponsiveContainer>
                    <AreaChart data={analytics.monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="month" stroke="var(--text2)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value >= 1000 ? value/1000 + 'k' : value}`} />
                      <RechartsTooltip content={<CustomTooltip prefix="₹" />} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--green)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-title">
                    <Users size={18} style={{ color: 'var(--accent2)' }} />
                    <h2>New Users (Last 6 Months)</h2>
                  </div>
                </div>
                <div style={{ width: '100%', height: 300, padding: '10px 0' }}>
                  <ResponsiveContainer>
                    <BarChart data={analytics.newUsersByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="month" stroke="var(--text2)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text2)" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg3)' }} />
                      <Bar dataKey="users" name="New Users" fill="var(--accent2)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Sales Pie Chart */}
              <div className="adm-card" style={{ gridColumn: '1 / -1' }}>
                <div className="adm-card-header">
                  <div className="adm-card-title">
                    <Package size={18} style={{ color: 'var(--yellow)' }} />
                    <h2>Sales by Category</h2>
                  </div>
                </div>
                <div style={{ width: '100%', height: 350, padding: '10px 0' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={analytics.salesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={130}
                        paddingAngle={5}
                        dataKey="revenue"
                        nameKey="category"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {analytics.salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="var(--bg)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip prefix="₹" />} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--text1)' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

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
                <button className="adm-action-btn" onClick={() => fetchData(true)}><RefreshCw size={18} /><span>Refresh</span></button>
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

        {/* ── Row 5: Pending Returns Table ── */}
        <div className="adm-card" style={{ marginTop: 24 }}>
          <div className="adm-card-header">
            <div className="adm-card-title">
              <RefreshCw size={18} style={{ color: 'var(--yellow)' }} />
              <h2>Pending Returns</h2>
            </div>
            <span className="adm-pill">{pendingReturns.length} Requests</span>
          </div>
          {pendingReturns.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}><CheckCircle size={32} style={{color:'var(--green)'}}/><p>No pending returns!</p></div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Req ID</th>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Reason</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReturns.map(r => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>#{r.orderId}</td>
                      <td>{r.userEmail}</td>
                      <td>{r.reason}</td>
                      <td>{r.type}</td>
                      <td>
                        <button className="btn-primary" style={{marginRight: '8px', padding: '4px 8px', fontSize: '12px'}} onClick={() => handleApproveReturn(r.id)}>Approve</button>
                        <button className="btn-secondary" style={{padding: '4px 8px', fontSize: '12px'}} onClick={() => handleRejectReturn(r.id)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
