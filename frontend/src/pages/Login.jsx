import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/api/auth/login', form);
      const data = res.data.data; // { accessToken, email, role, userId }
      const userData = {
        email: data.email,
        role: data.role,
        userId: data.userId,
        fullName: data.email, // fallback until profile API
      };
      login(userData, data.accessToken);
      await fetchCart();
      toast.success(`Welcome back, ${data.email}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><LogIn size={28} /></div>
          <h1>Welcome Back</h1>
          <p>Sign in to your ShopZen account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
