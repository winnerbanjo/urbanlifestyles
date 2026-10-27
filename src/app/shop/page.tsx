"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { NileProduct, ProductCategory } from "@/lib/nile/types";
import { nileApi } from "@/lib/nile/api";
import { ChevronDown, Loader2 } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategoryParam = searchParams.get("category") || "ALL";
  const activeSortParam = (searchParams.get("sort") as "newest" | "price_asc" | "price_desc" | "topSellers") || "newest";
  const searchQuery = searchParams.get("search") || "";

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<NileProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryParam);
  const [selectedSort, setSelectedSort] = useState(activeSortParam);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Sync category & sort with query params
  useEffect(() => {
    setSelectedCategory(activeCategoryParam);
  }, [activeCategoryParam]);

  useEffect(() => {
    setSelectedSort(activeSortParam);
  }, [activeSortParam]);

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await nileApi.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed loading categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products when category or sort or search changes
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let sortBy: "createdAt" | "updatedAt" | "price" | "newest" | "topSellers" = "newest";
        let sortOrder: "asc" | "desc" = "desc";

        if (selectedSort === "price_asc") {
          sortBy = "price";
          sortOrder = "asc";
        } else if (selectedSort === "price_desc") {
          sortBy = "price";
          sortOrder = "desc";
        } else if (selectedSort === "topSellers") {
          sortBy = "topSellers";
          sortOrder = "desc";
        } else {
          sortBy = "newest";
          sortOrder = "desc";
        }

        const res = await nileApi.getProducts({
          category: selectedCategory === "ALL" ? undefined : selectedCategory,
          search: searchQuery || undefined,
          sortBy,
          sortOrder,
          limit: 30,
        });

        setProducts(res.products);
      } catch (err) {
        console.error("Failed loading shop products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory, selectedSort, searchQuery]);

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    const params = new URLSearchParams(searchParams.toString());
    if (catName === "ALL") {
      params.delete("category");
    } else {
      params.set("category", catName);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (sortKey: "newest" | "price_asc" | "price_desc" | "topSellers") => {
    setSelectedSort(sortKey);
    setIsSortDropdownOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortKey);
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const sortLabels = {
    newest: "Newest",
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low",
    topSellers: "Best Selling",
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        {/* Subheader matching reference:
            SHOP ALL                                      Sort ⌄
            with thin horizontal divider below
        */}
        <div className="flex items-center justify-between py-2 sm:py-3">
          <div className="relative inline-block">
            <h1 className="font-editorial text-xl sm:text-2xl font-medium tracking-[0.1em] uppercase text-[#171717]">
              {selectedCategory === "ALL" ? "SHOP ALL" : selectedCategory}
            </h1>
            {/* Subtle sage-green underline accent matching reference screenshot */}
            <div className="h-0.5 w-12 bg-[#BDD2BF] mt-1" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-normal tracking-wide text-[#171717] hover:text-[#777777] transition-colors py-1 px-2"
              aria-expanded={isSortDropdownOpen}
              aria-label="Sort products"
            >
              <span>Sort</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSortDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isSortDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsSortDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-[#FAF9F6] border border-[#E9E7E3] shadow-lg rounded-none z-30 py-1 divide-y divide-[#E9E7E3]/60 animate-in fade-in zoom-in-95 duration-150">
                  {(["newest", "price_asc", "price_desc", "topSellers"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSortChange(key)}
                      className={`w-full text-left px-4 py-2.5 text-[12px] uppercase tracking-wider transition-colors flex items-center justify-between ${
                        selectedSort === key
                          ? "bg-[#BDD2BF]/20 text-[#171717] font-semibold"
                          : "text-[#777777] hover:bg-[#FAF9F6] hover:text-[#171717]"
                      }`}
                    >
                      <span>{sortLabels[key]}</span>
                      {selectedSort === key && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#37533E]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Thin horizontal divider matching reference */}
        <div className="w-full h-px bg-[#E9E7E3] mb-4 sm:mb-6" />

        {/* Horizontal Scrollable Category Pills matching reference:
            ALL   DRESSES   SETS   TOPS   BOTTOMS   NEW IN
            Selected category has sage-green background (#BDD2BF).
            Unselected categories use thin light border.
        */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          <div className="flex items-center gap-2.5 min-w-max pb-1">
            {categories.map((cat) => {
              const isSelected =
                selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                (selectedCategory === "ALL" && cat.name === "ALL");

              return (
                <button
                  key={cat.uuid || cat.name}
                  type="button"
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`text-[11px] sm:text-[12px] font-medium tracking-[0.14em] uppercase px-5 py-2 rounded-full transition-all duration-200 ${
                    isSelected
                      ? "bg-[#BDD2BF] text-[#171717] font-semibold shadow-2xs"
                      : "bg-transparent text-[#171717] border border-[#E9E7E3] hover:border-[#BDD2BF] hover:bg-[#BDD2BF]/10"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Query indicator if present */}
        {searchQuery && (
          <div className="mb-4 flex items-center justify-between bg-[#EDEDEB] px-3.5 py-2 text-[12px] text-[#171717]">
            <span>
              Showing results for &ldquo;<strong>{searchQuery}</strong>&rdquo;
            </span>
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("search");
                router.push(`/shop?${params.toString()}`);
              }}
              className="text-[#777777] hover:text-[#171717] underline uppercase tracking-wider text-[11px]"
            >
              Clear
            </button>
          </div>
        )}

        {/* Product Grid:
            Exactly 2 columns on mobile (approx 10-14px gap).
            3 columns on tablet.
            4 columns on large desktop.
        */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="animate-pulse flex flex-col">
                <div className="aspect-[4/5] bg-[#EDEDEB] w-full" />
                <div className="pt-2.5 space-y-1.5">
                  <div className="h-3 bg-[#EDEDEB] w-3/4" />
                  <div className="h-3 bg-[#EDEDEB] w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <h2 className="font-editorial text-2xl text-[#171717]">No products found</h2>
            <p className="text-[13px] text-[#777777]">
              There are currently no items available in this category.
            </p>
            <button
              type="button"
              onClick={() => handleCategoryClick("ALL")}
              className="mt-4 px-6 py-2.5 bg-[#BDD2BF] text-[#171717] text-[12px] uppercase tracking-widest font-medium hover:bg-[#A9C3AE]"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {products.map((product, idx) => (
              <ProductCard key={product.uuid} product={product} priority={idx < 4} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#37533E]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
