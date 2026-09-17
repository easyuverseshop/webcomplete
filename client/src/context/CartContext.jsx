import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('easyuverse_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('easyuverse_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (project) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === project._id);
      if (exists) return prev;
      return [...prev, project];
    });
  };

  const removeFromCart = (projectId) => {
    setCart((prev) => prev.filter((item) => item._id !== projectId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
