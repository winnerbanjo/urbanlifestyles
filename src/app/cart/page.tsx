"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/lib/context/CartContext";
import { useStore } from "@/lib/context/StoreContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, itemCount } = useCart();
  const { formatPrice, store } = useStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const threshold = store.settings?.shipping?.freeShippingThreshold || 75000;
  const progressToFreeShipping = Math.min(100, (cart.total / threshold) * 100);
  const remainingForFreeShipping = Math.max(0, threshold - cart.total);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#171717] mb-2">
          Your Shopping Bag
        </h1>
        <p className="text-[12px] text-[#777777] uppercase tracking-wider mb-8">
          {itemCount} {itemCount === 1 ? "Item" : "Items"} in your bag
        </p>

        {cart.items.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E9E7E3] p-8 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EDEDEB] flex items-center justify-center text-[#777777] mx-auto">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="font-editorial text-2xl text-[#171717]">Your bag is currently empty</h2>
            <p className="text-[13px] text-[#777777]">
              Explore our new ready-to-wear drops and find your next signature piece.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-8 py-3.5 bg-[#BDD2BF] text-[#171717] text-[12px] uppercase tracking-widest font-medium hover:bg-[#A9C3AE] transition-colors"
            >
              Discover The Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free shipping banner */}
              <div className="p-4 bg-[#EBF2EC] border border-[#BDD2BF]/60 space-y-2">
                <p className="text-[12px] text-[#37533E] font-medium">
                  {remainingForFreeShipping > 0
                    ? `Add ${formatPrice(remainingForFreeShipping)} more to qualify for complimentary express shipping.`
                    : "You have unlocked complimentary nationwide and international express delivery!"}
                </p>
                <div className="w-full bg-white/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#BDD2BF] h-full" style={{ width: `${progressToFreeShipping}%` }} />
                </div>
              </div>

              <div className="bg-white border border-[#E9E7E3] divide-y divide-[#E9E7E3]">
                {cart.items.map((item) => {
                  const variantInfo = item.variant?.attributes
                    ?.map((a) => `${a.productAttribute.name}: ${a.attribute.name}`)
                    .join(" • ");

                  return (
                    <div
                      key={`${item.productId}-${item.variantID || "none"}`}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-[#EDEDEB] shrink-0 overflow-hidden">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <Link
                            href={`/product/${item.productId}`}
                            className="font-medium text-[13px] sm:text-[14px] uppercase tracking-wider text-[#171717] hover:text-[#777777]"
                          >
                            {item.product.name}
                          </Link>
                          {variantInfo && (
                            <p className="text-[11px] text-[#777777]">{variantInfo}</p>
                          )}
                          <p className="text-[13px] text-[#171717]">{formatPrice(item.price)}</p>
                        </div>
                      </div>

                      {/* Stepper & Total */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-3 sm:pt-0 border-t sm:border-0 border-[#E9E7E3]">
                        <div className="flex items-center border border-[#E9E7E3] bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                Boolean(item.variantID),
                                item.variantID
                              )
                            }
                            className="p-2 text-[#171717] hover:bg-[#FAF9F6]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-[13px] font-medium text-[#171717]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                Boolean(item.variantID),
                                item.variantID
                              )
                            }
                            className="p-2 text-[#171717] hover:bg-[#FAF9F6]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[14px] font-medium text-[#171717] min-w-[80px] text-right">
                          {formatPrice(item.price * item.quantity)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantID)}
                          className="p-2 text-[#777777] hover:text-rose-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/shop"
                  className="text-[12px] uppercase tracking-wider text-[#777777] hover:text-[#171717] underline"
                >
                  ← Continue Shopping
                </Link>

                {!confirmClear ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-[12px] uppercase tracking-wider text-[#777777] hover:text-rose-600"
                  >
                    Clear Shopping Bag
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-rose-600">Clear entire bag?</span>
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="text-[11px] font-bold text-rose-700 underline"
                    >
                      Yes, Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="text-[11px] text-[#777777]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-[#E9E7E3] p-6 space-y-5 sticky top-28">
                <h3 className="font-editorial text-2xl text-[#171717]">Order Summary</h3>

                <div className="space-y-3 text-[13px] divide-y divide-[#E9E7E3]">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[#777777]">Subtotal</span>
                    <span className="font-medium text-[#171717]">{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-[#777777]">Estimated Shipping</span>
                    <span className="text-[#171717]">{remainingForFreeShipping === 0 ? "FREE" : "Calculated at checkout"}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4">
                    <span className="text-[14px] font-medium text-[#171717]">Estimated Total</span>
                    <span className="text-xl font-light text-[#171717]">{formatPrice(cart.total)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#777777] leading-relaxed">
                  Taxes and final door-to-door delivery fees will be confirmed at checkout via Nile.
                </p>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] font-medium text-[13px] uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
