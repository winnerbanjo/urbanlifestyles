"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { NileProduct, ProductCategory } from "@/lib/nile/types";
import { nileApi } from "@/lib/nile/api";
import { ChevronRight, Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const categoryId = unwrappedParams.id;

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [products, setProducts] = useState<NileProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        setLoading(true);
        const res = await nileApi.getCategoryProducts(categoryId);
        setCategory(res.category);
        setProducts(res.products);
      } catch (err) {
        console.error("Failed loading category products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-[#777777] mb-6">
          <Link href="/" className="hover:text-[#171717]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/collections" className="hover:text-[#171717]">Collections</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#171717] font-medium">{category?.name || "Category"}</span>
        </nav>

        {/* Category Header */}
        <div className="pb-6 border-b border-[#E9E7E3] mb-8">
          <h1 className="font-editorial text-3xl sm:text-5xl text-[#171717]">
            {category?.name || "Collection"}
          </h1>
          {category?.description && (
            <p className="text-[13px] text-[#777777] mt-2 max-w-xl font-light">
              {category.description}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#37533E]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="font-editorial text-2xl text-[#171717]">No products found in this category</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-[#BDD2BF] text-[#171717] text-[12px] uppercase tracking-widest font-medium"
            >
              Shop All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
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
