import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'No account found with this email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <KeyRound size={28} />
          </div>
          <h1>Forgot Password?</h1>
          <p>Enter your email and we'll send you a reset link</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle2 size={56} style={{ color: 'var(--success, #10b981)', margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Email Sent!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Check <strong>{email}</strong> for the password reset link. It expires in 15 minutes.
            </p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

        {!sent && (
          <p className="auth-footer">
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
        )}
      </div>
    </div>
  );
}
