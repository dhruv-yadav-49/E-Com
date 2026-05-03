import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams]            = useSearchParams();
  const token                     = searchParams.get('token');
  const navigate                  = useNavigate();
  const [newPassword, setNew]     = useState('');
  const [confirmPw, setConfirm]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--error, #ef4444)', marginBottom: '1rem' }}>Invalid Link</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            This reset link is invalid or has already been used.
          </p>
          <Link to="/forgot-password" className="btn-primary" style={{ textDecoration: 'none' }}>
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPw) {
      toast.error('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await API.post('/api/auth/reset-password', { token, newPassword });
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <ShieldCheck size={28} />
          </div>
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={e => setNew(e.target.value)}
                required
                autoFocus
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPw}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>
            {confirmPw && newPassword !== confirmPw && (
              <p style={{ color: 'var(--error, #ef4444)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading || newPassword !== confirmPw}
          >
            {loading ? <span className="spinner" /> : 'Reset Password'}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
