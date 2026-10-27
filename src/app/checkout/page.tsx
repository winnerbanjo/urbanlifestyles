"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useStore } from "@/lib/context/StoreContext";
import { nileApi } from "@/lib/nile/api";
import { CheckoutPayload } from "@/lib/nile/types";
import { Lock, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartId, clearCart } = useCart();
  const { formatPrice, store } = useStore();

  // Customer Contact Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery Details
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lagos");
  const [state, setState] = useState("Lagos");
  const [country] = useState("NG");
  const [shippingZone, setShippingZone] = useState("Lagos Island & Mainland");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Shipping calculation based on store settings
  const freeShippingThreshold = store.settings?.shipping?.freeShippingThreshold || 75000;
  const isFreeShipping = cart.total >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 3500;
  const grandTotal = cart.total + shippingFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const checkoutPayload: CheckoutPayload = {
        customerFullName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        customerCity: city.trim(),
        customerState: state.trim(),
        customerCountry: country,
        cartId: cartId || cart.cartId,
        currency: store.currency?.base || "NGN",
        salesChannel: "Headless",
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productPrice: item.price,
          quantity: item.quantity,
          productImage: item.product.imageUrl,
          variantName: item.variant?.attributes
            ?.map((a) => `${a.productAttribute.name}: ${a.attribute.name}`)
            .join(", ") || undefined,
        })),
        shippingFee,
        shippingAddress: `${address.trim()}, ${city.trim()}, ${state.trim()}`,
        shippingZoneName: shippingZone,
        subtotalAmount: cart.total,
        grandTotal,
      };

      // 1. Create order in Nile
      const order = await nileApi.createCheckout(checkoutPayload);
      const orderId = order.id;

      // 2. Initialize Payment
      const paymentRes = await nileApi.startPayment(orderId);

      // Clean local cart upon order initialization
      await clearCart();

      // 3. Redirect to payment gateway authorization URL
      if (paymentRes.authorizationUrl) {
        window.location.href = paymentRes.authorizationUrl;
      } else if (paymentRes.paymentLink) {
        window.location.href = paymentRes.paymentLink;
      } else {
        router.push(`/checkout/payment?orderId=${orderId}&status=pending`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initialize checkout.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-6 text-center">
        <h1 className="font-editorial text-3xl text-[#171717]">Your Cart is Empty</h1>
        <p className="text-[13px] text-[#777777] max-w-sm mt-2">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-8 py-3.5 bg-[#BDD2BF] text-[#171717] text-[12px] uppercase tracking-widest font-medium"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Checkout Minimalist Top Header */}
      <header className="border-b border-[#E9E7E3] bg-white py-4 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#777777] hover:text-[#171717]">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bag</span>
          </Link>
          <Link href="/" className="font-editorial text-2xl font-semibold tracking-tight text-[#171717]">
            {store.name || "Urbanlifestyles"}
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#37533E] font-medium">
            <Lock className="w-3.5 h-3.5 text-[#37533E]" />
            <span>Secure 256-Bit</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-[13px]">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-8">
              {/* Section 1: Customer Contact */}
              <div className="bg-white p-6 sm:p-8 border border-[#E9E7E3] space-y-5">
                <div className="border-b border-[#E9E7E3] pb-3">
                  <h2 className="font-editorial text-2xl text-[#171717]">1. Customer Details</h2>
                  <p className="text-[12px] text-[#777777] mt-0.5">Where shall we send order updates?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ada Okafor"
                      className="w-full border border-[#E9E7E3] p-3 text-[13px] focus:outline-none focus:border-[#171717]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ada@example.com"
                        className="w-full border border-[#E9E7E3] p-3 text-[13px] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 801 234 5678"
                        className="w-full border border-[#E9E7E3] p-3 text-[13px] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="bg-white p-6 sm:p-8 border border-[#E9E7E3] space-y-5">
                <div className="border-b border-[#E9E7E3] pb-3">
                  <h2 className="font-editorial text-2xl text-[#171717]">2. Delivery Address</h2>
                  <p className="text-[12px] text-[#777777] mt-0.5">Physical shipping destination for door delivery</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                      Street Address & Apt/Suite *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="14 Adeola Odeku Street, Victoria Island"
                      className="w-full border border-[#E9E7E3] p-3 text-[13px] focus:outline-none focus:border-[#171717]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-[#E9E7E3] p-3 text-[13px] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                        State / Region *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full border border-[#E9E7E3] p-3 text-[13px] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Nigeria (NG)"
                        className="w-full border border-[#E9E7E3] bg-[#FAF9F6] p-3 text-[13px] text-[#777777]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#171717] font-semibold block mb-1">
                      Shipping Zone
                    </label>
                    <select
                      value={shippingZone}
                      onChange={(e) => setShippingZone(e.target.value)}
                      className="w-full border border-[#E9E7E3] p-3 text-[13px] bg-white focus:outline-none focus:border-[#171717]"
                    >
                      <option value="Lagos Island & Mainland">Lagos Express (1-2 Days)</option>
                      <option value="Nationwide Express">Nationwide Interstate Express (2-4 Days)</option>
                      <option value="International DHL">International DHL Express (3-6 Days)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Method info */}
              <div className="bg-white p-6 sm:p-8 border border-[#E9E7E3] space-y-4">
                <div className="border-b border-[#E9E7E3] pb-3">
                  <h2 className="font-editorial text-2xl text-[#171717]">3. Payment Method</h2>
                  <p className="text-[12px] text-[#777777] mt-0.5">Authoritative Nile payment gateway</p>
                </div>
                <div className="p-4 border border-[#BDD2BF] bg-[#EBF2EC] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#37533E]" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#171717]">
                        Paystack Gateway (Cards, Transfer, Apple Pay)
                      </p>
                      <p className="text-[11px] text-[#777777]">
                        Redirects securely to complete transaction through Nile
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] uppercase font-bold text-[#37533E] tracking-wider">
                    Connected
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] font-semibold text-[13px] uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#37533E]" />
                    <span>Connecting to Nile Payment...</span>
                  </>
                ) : (
                  <span>Place Order & Pay • {formatPrice(grandTotal)}</span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E9E7E3] p-6 sm:p-8 sticky top-28 space-y-6">
              <h3 className="font-editorial text-2xl text-[#171717] border-b border-[#E9E7E3] pb-3">
                Order Summary
              </h3>

              {/* Item lines */}
              <div className="divide-y divide-[#E9E7E3] max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.variantID || "none"}`} className="py-3 flex gap-3.5 items-center">
                    <div className="relative w-16 h-20 bg-[#EDEDEB] shrink-0 overflow-hidden">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 right-1 bg-[#171717] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-medium uppercase tracking-wider text-[#171717] truncate">
                        {item.product.name}
                      </h4>
                      {item.variant?.attributes && (
                        <p className="text-[10px] text-[#777777] truncate">
                          {item.variant.attributes.map((a) => a.attribute.name).join(" / ")}
                        </p>
                      )}
                      <p className="text-[12px] text-[#171717] mt-0.5">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#E9E7E3] pt-4 space-y-2 text-[13px]">
                <div className="flex justify-between text-[#777777]">
                  <span>Subtotal</span>
                  <span className="text-[#171717] font-medium">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Shipping Fee</span>
                  <span className="text-[#171717] font-medium">
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-[#E9E7E3] text-[#171717]">
                  <span className="text-[14px] font-semibold uppercase tracking-wider">Total Due</span>
                  <span className="text-2xl font-light">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
