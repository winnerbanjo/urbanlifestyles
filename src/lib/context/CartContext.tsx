"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AddToCartPayload, NileCart, NileProduct, UpdateCartItemPayload } from "../nile/types";
import { nileApi } from "../nile/api";

interface CartContextType {
  cart: NileCart;
  cartId: string | null;
  loading: boolean;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  itemCount: number;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, isVariant: boolean, variantId?: string | null) => Promise<void>;
  removeItem: (productId: string, variantId?: string | null) => Promise<void>;
  clearCart: () => Promise<void>;
  quickAddProduct: NileProduct | null;
  openQuickAdd: (product: NileProduct) => void;
  closeQuickAdd: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: { cartId: "", items: [], total: 0 },
  cartId: null,
  loading: false,
  isCartDrawerOpen: false,
  openCartDrawer: () => {},
  closeCartDrawer: () => {},
  itemCount: 0,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  quickAddProduct: null,
  openQuickAdd: () => {},
  closeQuickAdd: () => {},
});

const CART_STORAGE_KEY = "x-anonymous-cart-id";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<NileCart>({ cartId: "", items: [], total: 0 });
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [quickAddProduct, setQuickAddProduct] = useState<NileProduct | null>(null);

  const fetchAuthoritativeCart = useCallback(async (currentCartId?: string | null) => {
    try {
      setLoading(true);
      const activeId = currentCartId || (typeof window !== "undefined" ? localStorage.getItem(CART_STORAGE_KEY) : null);
      const data = await nileApi.getCart(activeId);
      
      setCart(data);
      if (data.cartId) {
        setCartId(data.cartId);
        if (typeof window !== "undefined") {
          localStorage.setItem(CART_STORAGE_KEY, data.cartId);
        }
      }
    } catch (err) {
      console.error("Error refreshing cart from Nile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedId = typeof window !== "undefined" ? localStorage.getItem(CART_STORAGE_KEY) : null;
    fetchAuthoritativeCart(savedId);
  }, [fetchAuthoritativeCart]);

  const addToCart = async (payload: AddToCartPayload) => {
    setLoading(true);
    try {
      const updatedCart = await nileApi.addToCart(cartId, payload);
      setCart(updatedCart);
      if (updatedCart.cartId && updatedCart.cartId !== cartId) {
        setCartId(updatedCart.cartId);
        if (typeof window !== "undefined") {
          localStorage.setItem(CART_STORAGE_KEY, updatedCart.cartId);
        }
      }
      setIsCartDrawerOpen(true);
    } catch (err) {
      console.error("Failed adding to cart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    isVariant: boolean,
    variantId?: string | null
  ) => {
    if (!cartId) return;
    setLoading(true);
    try {
      const payload: UpdateCartItemPayload = {
        productId,
        quantity,
        isVariant,
        variantId,
      };
      const updated = await nileApi.updateCartItem(cartId, payload);
      setCart(updated);
    } catch (err) {
      console.error("Failed updating item quantity:", err);
      await fetchAuthoritativeCart(cartId);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string, variantId?: string | null) => {
    if (!cartId) return;
    setLoading(true);
    try {
      const updated = await nileApi.removeCartItem(cartId, productId, variantId);
      setCart(updated);
    } catch (err) {
      console.error("Failed removing cart item:", err);
      await fetchAuthoritativeCart(cartId);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cartId) return;
    setLoading(true);
    try {
      const updated = await nileApi.clearCart(cartId);
      setCart(updated);
    } catch (err) {
      console.error("Failed clearing cart:", err);
      await fetchAuthoritativeCart(cartId);
    } finally {
      setLoading(false);
    }
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const openQuickAdd = (product: NileProduct) => setQuickAddProduct(product);
  const closeQuickAdd = () => setQuickAddProduct(null);

  const itemCount = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        loading,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        quickAddProduct,
        openQuickAdd,
        closeQuickAdd,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
