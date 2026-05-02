import { createContext, useContext, useState, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await API.get(`/api/cart/${user.email}`);
      setCart(res.data);
    } catch (e) {
      setCart(null);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user?.email) return;
    const res = await API.post('/api/cart/add', { email: user.email, productId, quantity });
    setCart(res.data);
    return res.data;
  };

  const removeFromCart = async (itemId) => {
    const res = await API.delete(`/api/cart/remove/${itemId}`);
    setCart(res.data);
    return res.data;
  };

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
