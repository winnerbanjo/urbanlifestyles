"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { NileProduct } from "@/lib/nile/types";
import { nileApi } from "@/lib/nile/api";
import { Search, Loader2 } from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(query);
  const [products, setProducts] = useState<NileProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputVal(query);
  }, [query]);

  useEffect(() => {
    async function search() {
      if (!inputVal.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const res = await nileApi.getProducts({
          search: inputVal.trim(),
          limit: 30,
        });
        setProducts(res.products);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [inputVal]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#171717] text-center mb-6">
            Search The Collection
          </h1>
          <div className="relative border-b-2 border-[#171717] pb-2 flex items-center">
            <Search className="w-5 h-5 text-[#777777] mr-3 shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="SEARCH SILHOUETTE, DRESS, SET..."
              className="w-full bg-transparent text-lg font-light uppercase tracking-wider text-[#171717] placeholder:text-[#777777] focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#37533E]" />
          </div>
        ) : inputVal && products.length === 0 ? (
          <div className="text-center py-16 text-[#777777]">
            <p className="text-base font-editorial text-[#171717]">
              No garments found matching &ldquo;{inputVal}&rdquo;
            </p>
            <p className="text-[12px] mt-1">Try another keyword or browse our curated collections.</p>
          </div>
        ) : products.length > 0 ? (
          <div>
            <p className="text-[12px] uppercase tracking-wider text-[#777777] mb-6">
              Found {products.length} {products.length === 1 ? "garment" : "garments"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.uuid} product={product} />
              ))}
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6]" />}>
      <SearchPageContent />
    </Suspense>
  );
}
