"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/context/AuthContext";
import { useStore } from "@/lib/context/StoreContext";
import { User, Package, LogOut, CheckCircle2, Clock } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { token, customer, orders, logout, loading } = useAuth();
  const { formatPrice } = useStore();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/account/login");
    }
  }, [token, loading, router]);

  if (loading || !customer) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#777777] uppercase tracking-wider">Loading account...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#E9E7E3] gap-4">
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#171717]">
              Customer Dashboard
            </h1>
            <p className="text-[13px] text-[#777777] mt-1">
              Welcome back, {customer.fullName || customer.email}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#E9E7E3] bg-white hover:border-[#171717] text-[12px] uppercase tracking-wider text-[#171717] self-start sm:self-auto transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Profile Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E9E7E3] p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E9E7E3]">
                <div className="w-10 h-10 rounded-full bg-[#BDD2BF]/20 flex items-center justify-center text-[#37533E]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-[#171717] uppercase tracking-wider">
                    Client Profile
                  </h3>
                  <span className="text-[11px] text-[#777777]">Authenticated via Nile</span>
                </div>
              </div>

              <div className="space-y-3 text-[13px]">
                <div>
                  <span className="text-[11px] text-[#777777] uppercase tracking-wider block">Email</span>
                  <span className="text-[#171717] font-medium">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div>
                    <span className="text-[11px] text-[#777777] uppercase tracking-wider block">Phone</span>
                    <span className="text-[#171717] font-medium">{customer.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-[11px] text-[#777777] uppercase tracking-wider block">Member Since</span>
                  <span className="text-[#171717] font-medium">
                    {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#EBF2EC] border border-[#BDD2BF]/60 space-y-2">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#37533E]">
                Concierge Assistance
              </h4>
              <p className="text-[12px] text-[#37533E]/80 leading-relaxed">
                Need tailoring revisions, custom adjustments, or urgent delivery queries? Our personal shoppers are on call.
              </p>
            </div>
          </div>

          {/* Orders History (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl text-[#171717] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#37533E]" />
                <span>Order History ({orders.length})</span>
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-[#E9E7E3] p-12 text-center space-y-3">
                <p className="font-editorial text-xl text-[#171717]">No previous orders found</p>
                <p className="text-[12px] text-[#777777]">
                  Any orders placed with this account will automatically sync here.
                </p>
                <Link
                  href="/shop"
                  className="inline-block mt-3 px-6 py-2.5 bg-[#BDD2BF] text-[#171717] text-[11px] uppercase tracking-widest font-medium"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isPaid = order.paymentStatus === "PAID";

                  return (
                    <div key={order.id} className="bg-white border border-[#E9E7E3] p-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9E7E3] pb-4">
                        <div>
                          <span className="text-[11px] text-[#777777] uppercase tracking-wider block">
                            Order Reference
                          </span>
                          <span className="text-[14px] font-semibold text-[#171717]">
                            #{order.id}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#777777] uppercase tracking-wider block">
                            Date Placed
                          </span>
                          <span className="text-[12px] text-[#171717]">
                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#777777] uppercase tracking-wider block">
                            Total Due
                          </span>
                          <span className="text-[13px] font-medium text-[#171717]">
                            {formatPrice(order.grandTotal)}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                              isPaid
                                ? "bg-[#EBF2EC] text-[#37533E] border border-[#BDD2BF]"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{order.paymentStatus}</span>
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-[13px]">
                            <div>
                              <span className="font-medium text-[#171717]">{item.productName}</span>
                              <span className="text-[#777777] ml-2">× {item.quantity}</span>
                              {item.variantName && (
                                <p className="text-[11px] text-[#777777]">{item.variantName}</p>
                              )}
                            </div>
                            <span className="text-[#171717]">
                              {formatPrice(item.productPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address */}
                      {order.shippingAddress && (
                        <div className="pt-2 border-t border-[#E9E7E3] text-[11px] text-[#777777]">
                          <span>Shipping to: </span>
                          <span className="text-[#171717] font-medium">{order.shippingAddress}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
