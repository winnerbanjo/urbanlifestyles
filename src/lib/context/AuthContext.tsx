"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CustomerProfile, NileOrder } from "../nile/types";
import { nileApi } from "../nile/api";

interface AuthContextType {
  token: string | null;
  customer: CustomerProfile | null;
  orders: NileOrder[];
  loading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  customer: null,
  orders: [],
  loading: false,
  sendOtp: async () => {},
  verifyOtp: async () => {},
  logout: () => {},
  refreshProfile: async () => {},
  refreshOrders: async () => {},
});

const AUTH_TOKEN_KEY = "nile_customer_access_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<NileOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerData = async (authToken: string) => {
    try {
      setLoading(true);
      const [profileData, ordersData] = await Promise.all([
        nileApi.getCustomerProfile(authToken),
        nileApi.getCustomerOrders(authToken),
      ]);
      setCustomer(profileData);
      setOrders(ordersData);
    } catch (err) {
      console.warn("Failed fetching customer profile (token may be expired):", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (savedToken) {
        setToken(savedToken);
        fetchCustomerData(savedToken);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const sendOtp = async (email: string) => {
    await nileApi.sendOtp(email);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await nileApi.verifyOtp(email, otp);
    if (res?.accessToken) {
      setToken(res.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
      }
      await fetchCustomerData(res.accessToken);
    }
  };

  const logout = () => {
    setToken(null);
    setCustomer(null);
    setOrders([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  const refreshProfile = async () => {
    if (token) {
      const p = await nileApi.getCustomerProfile(token);
      setCustomer(p);
    }
  };

  const refreshOrders = async () => {
    if (token) {
      const o = await nileApi.getCustomerOrders(token);
      setOrders(o);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        customer,
        orders,
        loading,
        sendOtp,
        verifyOtp,
        logout,
        refreshProfile,
        refreshOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
