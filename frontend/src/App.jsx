import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Auto-loads cart when user is already logged in (e.g. page refresh)
function CartInitializer() {
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();
  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CartInitializer />
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1e293b', color: '#f1f5f9', borderRadius: '12px', border: '1px solid #334155' },
              success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
