"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  lqip?: string;
  slug?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Omit<CartItem, "quantity">, startRect?: DOMRect) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartBtnRef: React.RefObject<HTMLButtonElement | null>;
  flyingImage: { imageUrl: string; startRect: DOMRect } | null;
  setFlyingImage: (data: { imageUrl: string; startRect: DOMRect } | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [flyingImage, setFlyingImage] = useState<{ imageUrl: string; startRect: DOMRect } | null>(null);
  const cartBtnRef = useRef<HTMLButtonElement>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("limba_cart");
      if (storedCart) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("limba_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  }, [cartItems]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const addToCart = (product: Omit<CartItem, "quantity">, startRect?: DOMRect) => {
    // 1. Trigger animation if rect is provided
    if (startRect) {
      setFlyingImage({ imageUrl: product.imageUrl, startRect });
    }

    // 2. Add to cart state (with delay if animating to match flight time, or immediately?)
    // Immediate update feels snappier, but animation logic used a delay.
    // Let's do immediate state update for better UX, animation is just visual.
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    if (startRect) {
      setTimeout(() => {
        setFlyingImage(null);
        // Maybe open cart drawer slightly or shake it?
      }, 800);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartBtnRef,
        flyingImage,
        setFlyingImage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
