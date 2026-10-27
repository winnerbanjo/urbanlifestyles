"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useStore } from "@/lib/context/StoreContext";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
  } = useCart();
  const { formatPrice, store } = useStore();

  const [confirmClear, setConfirmClear] = useState(false);

  if (!isCartDrawerOpen) return null;

  const threshold = store.settings?.shipping?.freeShippingThreshold || 75000;
  const progressToFreeShipping = Math.min(100, (cart.total / threshold) * 100);
  const remainingForFreeShipping = Math.max(0, threshold - cart.total);

  const handleClear = async () => {
    await clearCart();
    setConfirmClear(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#E9E7E3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#171717]" />
              <h2 className="font-editorial text-2xl font-semibold text-[#171717]">
                Shopping Bag
              </h2>
              <span className="text-[12px] font-medium text-[#777777] bg-[#EDEDEB] rounded-full px-2 py-0.5 ml-1">
                {itemCount}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCartDrawer}
              className="p-1.5 text-[#171717] hover:text-[#777777] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-[#EBF2EC] border-b border-[#BDD2BF]/40">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[12px] text-[#37533E] font-medium leading-tight">
                Add <span className="font-bold">{formatPrice(remainingForFreeShipping)}</span> more for free worldwide delivery!
              </p>
            ) : (
              <p className="text-[12px] text-[#37533E] font-semibold leading-tight flex items-center gap-1.5">
                🎉 Congratulations! You unlocked free shipping!
              </p>
            )}
            <div className="w-full bg-white/70 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-[#BDD2BF] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E9E7E3]">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EDEDEB] flex items-center justify-center text-[#777777] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-editorial text-xl font-medium text-[#171717]">
                  Your bag is empty
                </h3>
                <p className="text-[13px] text-[#777777] max-w-xs mt-1">
                  Explore our new ready-to-wear drops and find your next signature piece.
                </p>
                <button
                  type="button"
                  onClick={closeCartDrawer}
                  className="mt-6 px-6 py-2.5 bg-[#BDD2BF] text-[#171717] text-[12px] uppercase tracking-widest font-medium hover:bg-[#A9C3AE] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.items.map((item) => {
                const variantInfo = item.variant?.attributes?.map((a) => `${a.productAttribute.name}: ${a.attribute.name}`).join(" • ");

                return (
                  <div key={`${item.productId}-${item.variantID || "none"}`} className="py-4 flex gap-4">
                    {/* Item Image */}
                    <div className="relative w-20 h-24 bg-[#EDEDEB] shrink-0 overflow-hidden">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-[13px] uppercase tracking-wider text-[#171717]">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId, item.variantID)}
                            className="text-[#777777] hover:text-rose-600 transition-colors p-1"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {variantInfo && (
                          <p className="text-[11px] text-[#777777] mt-0.5">
                            {variantInfo}
                          </p>
                        )}

                        <p className="text-[13px] font-normal text-[#171717] mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#E9E7E3] rounded-xs bg-white">
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
                            className="p-1.5 text-[#171717] hover:bg-[#FAF9F6]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-[12px] font-medium text-[#171717]">
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
                            className="p-1.5 text-[#171717] hover:bg-[#FAF9F6]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-[13px] font-medium text-[#171717]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-[#E9E7E3] bg-[#FAF9F6] space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] uppercase tracking-wider text-[#777777]">
                  Authoritative Subtotal
                </span>
                <span className="text-lg font-medium text-[#171717]">
                  {formatPrice(cart.total)}
                </span>
              </div>
              <p className="text-[11px] text-[#777777]">
                Shipping, duties and taxes calculated at checkout.
              </p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCartDrawer}
                  className="w-full py-3.5 bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] font-medium text-[13px] uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={closeCartDrawer}
                    className="text-[11px] uppercase tracking-wider text-[#777777] hover:text-[#171717] underline underline-offset-4"
                  >
                    Continue Shopping
                  </button>

                  {!confirmClear ? (
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="text-[11px] uppercase tracking-wider text-[#777777] hover:text-rose-600 transition-colors"
                    >
                      Clear Bag
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-rose-600">Are you sure?</span>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-[10px] font-bold text-rose-700 underline"
                      >
                        Yes, Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="text-[10px] text-[#777777]"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
