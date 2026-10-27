"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (uuid: string) => boolean;
  toggleWishlist: (uuid: string) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  isInWishlist: () => false,
  toggleWishlist: () => {},
  wishlistCount: 0,
});

const WISHLIST_STORAGE_KEY = "urbanlifestyles_wishlist_ids";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          setWishlistIds(JSON.parse(stored));
        }
      } catch (err) {
        console.warn("Failed reading wishlist:", err);
      }
      setInitialized(true);
    }
  }, []);

  const toggleWishlist = (uuid: string) => {
    setWishlistIds((prev) => {
      let updated: string[];
      if (prev.includes(uuid)) {
        updated = prev.filter((id) => id !== uuid);
      } else {
        updated = [...prev, uuid];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const isInWishlist = (uuid: string) => wishlistIds.includes(uuid);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
