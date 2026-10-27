"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { NileProduct } from "@/lib/nile/types";
import { nileApi } from "@/lib/nile/api";
import { useWishlist } from "@/lib/context/WishlistContext";
import { Heart, Info, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<NileProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      setLoading(true);
      try {
        if (wishlistIds.length === 0) {
          setProducts([]);
          return;
        }

        // Fetch products matching saved wishlist IDs
        const res = await nileApi.getProducts({ limit: 100 });
        const matched = res.products.filter((p) => wishlistIds.includes(p.uuid));
        setProducts(matched);
      } catch (err) {
        console.error("Failed loading wishlist items:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E7E3]">
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#171717]">
              Saved Pieces
            </h1>
            <p className="text-[12px] text-[#777777] uppercase tracking-wider mt-1">
              {wishlistIds.length} {wishlistIds.length === 1 ? "Item" : "Items"} in your personal wishlist
            </p>
          </div>
        </div>

        {/* Device specific disclaimer as explicitly required */}
        <div className="mt-4 p-4 bg-[#EBF2EC] border border-[#BDD2BF]/60 text-[12px] text-[#37533E] flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Device-Specific Wishlist:</strong> Your saved items are securely preserved on this browser. To keep them synchronized across multiple devices, place an order or sign into your account.
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center text-[#777777] text-[13px] uppercase tracking-wider">
            Loading saved pieces...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EDEDEB] flex items-center justify-center text-[#777777] mx-auto">
              <Heart className="w-7 h-7 opacity-60" />
            </div>
            <h2 className="font-editorial text-2xl text-[#171717]">
              No saved items yet
            </h2>
            <p className="text-[13px] text-[#777777]">
              Tap the heart icon on any garment to save it for later review or special occasions.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#BDD2BF] text-[#171717] text-[12px] uppercase tracking-widest font-medium hover:bg-[#A9C3AE] transition-colors"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 pt-8">
            {products.map((product) => (
              <ProductCard key={product.uuid} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
