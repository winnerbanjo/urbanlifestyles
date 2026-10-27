"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCategory } from "@/lib/nile/types";
import { nileApi } from "@/lib/nile/api";
import { ArrowRight } from "lucide-react";

export default function CollectionsPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const cats = await nileApi.getCategories();
        setCategories(cats.filter((c) => c.name !== "ALL"));
      } catch (err) {
        console.error("Failed loading categories:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="pb-6 border-b border-[#E9E7E3] mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-semibold">
            Seasonal Edits
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl text-[#171717] mt-1">
            Collections & Categories
          </h1>
          <p className="text-[13px] text-[#777777] max-w-lg mt-2 font-light">
            Every garment in our catalog is mapped into distinct thematic silhouettes.
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center text-[#777777] uppercase tracking-wider text-[12px]">
            Loading collections...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.uuid || cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col bg-white border border-[#E9E7E3] overflow-hidden"
              >
                <div className="relative aspect-[4/5] bg-[#EDEDEB] overflow-hidden">
                  {cat.imageUrl && (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-[#BDD2BF] font-semibold">
                      {cat.productCount ? `${cat.productCount} Garments` : "Collection"}
                    </span>
                    <h3 className="font-editorial text-2xl font-normal mt-0.5">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between text-[#171717]">
                  <p className="text-[12px] text-[#777777] line-clamp-1">
                    {cat.description || "Discover the collection."}
                  </p>
                  <span className="text-[11px] uppercase tracking-wider font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 ml-2">
                    <span>Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
