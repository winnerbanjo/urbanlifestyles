"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");

  const isSimulated = status === "simulated";

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        {isSimulated ? (
          <div className="bg-white border border-[#BDD2BF] p-8 sm:p-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#BDD2BF]/20 flex items-center justify-center text-[#37533E] mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="font-editorial text-3xl text-[#171717]">
              Order Received
            </h1>
            <p className="text-[13px] text-[#777777] leading-relaxed">
              Your order <span className="font-semibold text-[#171717]">#{orderId || "2561"}</span> has been recorded in the Nile commerce gateway.
            </p>
            <div className="p-4 bg-[#FAF9F6] text-[12px] text-[#777777] text-left space-y-1 border border-[#E9E7E3]">
              <p><strong>Order ID:</strong> #{orderId || "2561"}</p>
              <p><strong>Channel:</strong> Headless Nile Storefront</p>
              <p><strong>Status:</strong> Processing</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E9E7E3] p-8 sm:p-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#37533E] mx-auto">
              <Clock className="w-8 h-8 animate-pulse text-[#37533E]" />
            </div>
            <h1 className="font-editorial text-3xl text-[#171717]">
              Payment Confirmation Pending
            </h1>
            <p className="text-[13px] text-[#777777] leading-relaxed">
              Thank you for completing your transaction. Nile is currently verifying payment authorization for Order <strong className="text-[#171717]">#{orderId || "—"}</strong>.
            </p>
            <p className="text-[12px] text-[#777777] leading-relaxed">
              You will receive confirmation via email once the gateway webhook validates the transaction.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            href="/account"
            className="px-7 py-3.5 bg-[#BDD2BF] text-[#171717] text-[12px] uppercase tracking-widest font-medium hover:bg-[#A9C3AE] transition-colors flex items-center justify-center gap-2"
          >
            <span>View Order History</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="px-7 py-3.5 border border-[#171717] text-[#171717] text-[12px] uppercase tracking-widest font-medium hover:bg-[#171717] hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6]" />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
