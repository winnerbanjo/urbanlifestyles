"use client";

import React from "react";
import { StoreProvider } from "@/lib/context/StoreContext";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartDrawer } from "./cart/CartDrawer";
import { QuickAddModal } from "./product/QuickAddModal";
import { WhatsAppButton } from "./layout/WhatsAppButton";
import { MobileNav } from "./layout/MobileNav";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            {children}
            <CartDrawer />
            <QuickAddModal />
            <WhatsAppButton />
            <MobileNav />
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </StoreProvider>
  );
};
