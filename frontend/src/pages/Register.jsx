import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (form.phoneNumber.length !== 10) {
      toast.error('Phone number must be exactly 10 digits!');
      return;
    }
    setLoading(true);
    try {
      await API.post('/api/auth/register', {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
      });
      toast.success('Account created! Please check your email to verify.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><UserPlus size={28} /></div>
          <h1>Create Account</h1>
          <p>Join ShopZen and start shopping!</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input type="text" placeholder="John Doe" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
            </div>
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phoneNumber}
                onChange={e => setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                required
                maxLength={10}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input type={showPw ? 'text' : 'password'} placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
