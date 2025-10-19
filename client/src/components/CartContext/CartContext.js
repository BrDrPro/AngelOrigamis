import React, { createContext, useState, useEffect } from 'react';;

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Inicialização segura
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistência segura
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch {
      // Se der erro, ignore ou avise o usuário
    }
  }, [cart]);

  function addToCart(product) {
    setCart(prev => {
      // Se já existe, aumenta a quantidade
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Se não existe, adiciona com quantidade 1
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}