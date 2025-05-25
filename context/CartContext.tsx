"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/lib/types';
import { validatePromoCode } from '@/lib/api';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  wishlist: number[];
  addToCart: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  promoCode: string | null;
  promoDiscount: number;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTax: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedPromoCode = localStorage.getItem('promoCode');
    const savedPromoDiscount = localStorage.getItem('promoDiscount');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedPromoCode) setPromoCode(savedPromoCode);
    if (savedPromoDiscount) setPromoDiscount(Number(savedPromoDiscount));
  }, []);

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (promoCode) {
      localStorage.setItem('promoCode', promoCode);
      localStorage.setItem('promoDiscount', promoDiscount.toString());
    } else {
      localStorage.removeItem('promoCode');
      localStorage.removeItem('promoDiscount');
    }
  }, [promoCode, promoDiscount]);

  const addToCart = (
    product: Product,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => 
        item.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity, selectedColor, selectedSize }];
      }
    });
    toast.success(`Added ${quantity} ${product.title} to cart`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
    setPromoDiscount(0);
    toast.info("Cart cleared");
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        toast.info("Removed from wishlist");
        return prevWishlist.filter((id) => id !== productId);
      } else {
        toast.success("Added to wishlist");
        return [...prevWishlist, productId];
      }
    });
  };

  const applyPromoCode = (code: string) => {
    const promo = validatePromoCode(code);
    if (promo) {
      setPromoCode(code);
      setPromoDiscount(promo.discount);
      toast.success(`Promo code ${code} applied for ${promo.discount}% off`);
      return true;
    }
    toast.error(`Invalid promo code: ${code}`);
    return false;
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setPromoDiscount(0);
    toast.info("Promo code removed");
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDiscount = () => {
    const subtotal = getSubtotal();
    return (subtotal * promoDiscount) / 100;
  };

  const getTax = () => {
    const subtotalAfterDiscount = getSubtotal() - getDiscount();
    return subtotalAfterDiscount * 0.1; // 10% tax
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getTax();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        promoCode,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        getTotalItems,
        getSubtotal,
        getDiscount,
        getTax,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};