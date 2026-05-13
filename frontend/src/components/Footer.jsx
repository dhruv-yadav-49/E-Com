import { useState } from 'react';
import { Zap, Mail, Phone, MapPin, Globe, MessageCircle, Share2, Play, ChevronRight, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const QUICK_LINKS = ['About Us', 'Contact Us', 'Careers', 'Press', 'Blog', 'Affiliate Program'];
const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Automotive'];
const POLICIES = ['Privacy Policy', 'Terms of Service', 'Return Policy', 'Shipping Policy'];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Subscribed to newsletter!');
      setEmail('');
    }
  };

  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bg3)' }} className="mt-8">
      {/* Newsletter Banner */}
      <div
        className="py-10 px-6"
        style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)' }}
      >
        <div className="max-w-[1248px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold text-white">Stay in the Loop 📩</h3>
            <p className="text-indigo-100 mt-1">Get exclusive deals, new arrivals, and flash sale alerts.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="flex-1 md:w-72 px-5 py-3 rounded-full outline-none text-sm"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
              style={{ background: 'white', color: 'var(--accent)' }}
            >
              <Send size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1248px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">Shop<span style={{ color: 'var(--accent2)' }}>Zen</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text3)' }}>
              Your one-stop destination for premium products at unbeatable prices. Fast delivery, easy returns.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { Icon: Globe, color: '#6366f1' },
                { Icon: MessageCircle, color: '#1da1f2' },
                { Icon: Share2, color: '#10b981' },
                { Icon: Play, color: '#ef4444' },
              ].map(({ Icon, color }, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: `${color}20`, color }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text2)' }}>Company</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(link => (
                <li key={link}>
                  <a href="#" className="text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all group" style={{ color: 'var(--text3)' }}>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text2)' }}>Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <a href="#" className="text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all group" style={{ color: 'var(--text3)' }}>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text2)' }}>Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text3)' }}>123 Commerce Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text3)' }}>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text3)' }}>support@shopzen.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t px-6 py-5" style={{ borderColor: 'var(--bg3)' }}>
        <div className="max-w-[1248px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--text3)' }}>
            © 2025 ShopZen. All rights reserved. Made with ❤️ in India.
          </p>
          <div className="flex gap-4">
            {POLICIES.map(p => (
              <a key={p} href="#" className="text-xs hover:underline" style={{ color: 'var(--text3)' }}>{p}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
