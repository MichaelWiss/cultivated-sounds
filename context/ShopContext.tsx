/**
 * Shop Context
 * 
 * Global state management for cart and UI drawer states.
 * Provides centralized control for:
 * - Cart operations (add, remove, update quantity)
 * - Drawer visibility (cart, search modals)
 * - Cart totals and item counts
 * 
 * Pattern: React Context API for global state
 * Used by: All product components, header, cart drawer
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '../types';

interface ShopContextType {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  toggleCart: () => void;
  toggleSearch: () => void;
  closeAllDrawers: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  cartTotal: number;
  cartCount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const toggleSearch = () => setIsSearchOpen(prev => !prev);
  
  const closeAllDrawers = () => {
    setIsCartOpen(false);
    setIsSearchOpen(false);
  };

  const addToCart = (product: Product, quantity: number, variant?: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.selectedVariant === variant);
      if (existingItem) {
        return prev.map(item => 
          (item.id === product.id && item.selectedVariant === variant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, cartId: `${product.id}-${Date.now()}`, quantity, selectedVariant: variant }];
    });
    setIsCartOpen(true); // Auto open cart like Dawn
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <ShopContext.Provider value={{
      isCartOpen,
      isSearchOpen,
      toggleCart,
      toggleSearch,
      closeAllDrawers,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      cartCount
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
