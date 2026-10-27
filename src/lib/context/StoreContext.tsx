"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { NileStore } from "../nile/types";
import { nileApi } from "../nile/api";
import { MOCK_STORE } from "../nile/mock-data";

interface StoreContextType {
  store: NileStore;
  loading: boolean;
  currencyCode: string;
  formatPrice: (amount: number) => string;
  whatsappLink: string | null;
  storeNotice: string | null;
  refreshStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType>({
  store: MOCK_STORE,
  loading: true,
  currencyCode: "NGN",
  formatPrice: (amt) => `₦ ${amt.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
  whatsappLink: MOCK_STORE.socials.whatsappLink,
  storeNotice: MOCK_STORE.settings.storeNotice,
  refreshStore: async () => {},
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [store, setStore] = useState<NileStore>(MOCK_STORE);
  const [loading, setLoading] = useState(true);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const data = await nileApi.getStore();
      setStore(data);
    } catch (err) {
      console.warn("Using default store branding:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const currencyCode = store.currency?.base || "NGN";

  const formatPrice = (amount: number): string => {
    const symbol = currencyCode === "NGN" ? "₦" : "$";
    const formatted = Math.abs(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol} ${formatted}`;
  };

  const whatsappLink = store.socials?.whatsappLink || null;
  const storeNotice = store.settings?.storeNotice || "FASHION IS FREEDOM • WORLDWIDE SHIPPING";

  return (
    <StoreContext.Provider
      value={{
        store,
        loading,
        currencyCode,
        formatPrice,
        whatsappLink,
        storeNotice,
        refreshStore: fetchStoreData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
