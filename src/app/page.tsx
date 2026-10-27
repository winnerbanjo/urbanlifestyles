"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { NileProduct, ProductCategory } from "@/lib/nile/types";
import { nileApi } from "@/lib/nile/api";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";

export default function HomePage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [newArrivals, setNewArrivals] = useState<NileProduct[]>([]);
  const [bestsellers, setBestsellers] = useState<NileProduct[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, recentRes, bestRes] = await Promise.all([
          nileApi.getCategories(),
          nileApi.getProducts({ sortBy: "newest", limit: 4 }),
          nileApi.getProducts({ sortBy: "topSellers", limit: 4 }),
        ]);
        setCategories(cats.filter((c) => c.name !== "ALL"));
        setNewArrivals(recentRes.products);
        setBestsellers(bestRes.products);
      } catch (err) {
        console.error("Error loading homepage catalog:", err);
      }
    }
    loadData();
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Editorial Hero Section */}
        <section className="relative w-full h-[80vh] min-h-[520px] max-h-[780px] bg-[#171717] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Urbanlifestyles Luxury Fashion Campaign"
            fill
            priority
            className="object-cover object-center opacity-85 scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto">
            <div className="max-w-xl text-white space-y-3">
              <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-[#BDD2BF] font-semibold">
                High Summer & Resort 2026
              </span>
              <h1 className="font-editorial text-4xl sm:text-6xl font-light tracking-tight leading-none">
                Fashion is Freedom.
              </h1>
              <p className="text-[13px] sm:text-[14px] text-white/80 max-w-md leading-relaxed font-light">
                Sculpted tailoring, lightweight linen coordinates, and effortless contemporary silhouettes designed for elevated living.
              </p>
              <div className="pt-3 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="px-7 py-3.5 bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-200"
                >
                  Shop The Collection
                </Link>
                <Link
                  href="/category/cat-dresses"
                  className="px-7 py-3.5 border border-white/60 hover:border-white text-white text-[12px] font-medium tracking-[0.16em] uppercase backdrop-blur-xs transition-colors duration-200"
                >
                  Explore Dresses
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Shop By Category Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#777777] font-medium">
                Curated Categories
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#171717] mt-1">
                Shop by Silhouette
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-[12px] uppercase tracking-[0.14em] text-[#171717] hover:text-[#777777] flex items-center gap-1 font-medium transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.uuid || cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative aspect-[3/4] overflow-hidden bg-[#EDEDEB] block"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition-opacity" />
                <div className="absolute bottom-4 inset-x-4 flex flex-col justify-end text-white">
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium tracking-wide">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] tracking-wider text-white/80 uppercase mt-0.5">
                    {cat.productCount ? `${cat.productCount} Pieces` : "Explore Collection"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals Product Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-[#E9E7E3]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#777777] font-medium">
                Fresh Drops
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#171717] mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?sort=newest"
              className="text-[12px] uppercase tracking-[0.14em] text-[#171717] hover:text-[#777777] flex items-center gap-1 font-medium transition-colors"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.uuid} product={product} />
            ))}
          </div>
        </section>

        {/* Campaign Editorial Banner */}
        <section className="relative w-full py-24 sm:py-32 bg-[#171717] text-white overflow-hidden my-12">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
            alt="Editorial Campaign Banner"
            fill
            className="object-cover object-top opacity-35"
          />
          <div className="relative max-w-4xl mx-auto px-6 text-center space-y-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#BDD2BF] font-semibold">
              The Atelier Philosophy
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-light leading-tight">
              &ldquo;True elegance is never shouted; it is felt in the precision of the cut.&rdquo;
            </h2>
            <p className="text-[13px] sm:text-[14px] text-white/80 max-w-lg mx-auto font-light leading-relaxed">
              Every garment in our catalog is engineered to withstand changing trends, pairing architectural clean lines with timeless softness.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-block px-8 py-3.5 bg-white text-[#171717] hover:bg-[#BDD2BF] text-[12px] font-medium tracking-[0.18em] uppercase transition-colors"
              >
                Discover The Edit
              </Link>
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#777777] font-medium">
                Most Desired
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#171717] mt-1">
                Client Bestsellers
              </h2>
            </div>
            <Link
              href="/shop?sort=topSellers"
              className="text-[12px] uppercase tracking-[0.14em] text-[#171717] hover:text-[#777777] flex items-center gap-1 font-medium transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {bestsellers.map((product) => (
              <ProductCard key={product.uuid} product={product} />
            ))}
          </div>
        </section>

        {/* Brand Value Pillars */}
        <section className="border-t border-[#E9E7E3] bg-[#FAF9F6] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#BDD2BF]/20 flex items-center justify-center text-[#37533E] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#171717]">
                    Worldwide Shipping
                  </h4>
                  <p className="text-[12px] text-[#777777] mt-1 leading-relaxed">
                    Reliable door-to-door express dispatch across Nigeria and internationally.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#BDD2BF]/20 flex items-center justify-center text-[#37533E] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#171717]">
                    Bespoke Tailoring
                  </h4>
                  <p className="text-[12px] text-[#777777] mt-1 leading-relaxed">
                    Precision craftsmanship with high-grade European and African textiles.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#BDD2BF]/20 flex items-center justify-center text-[#37533E] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#171717]">
                    Secure Commerce
                  </h4>
                  <p className="text-[12px] text-[#777777] mt-1 leading-relaxed">
                    Powered by Nile Storefront API with bank-grade encrypted Paystack payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Interface */}
        <section className="bg-[#EDEDEB] py-16 sm:py-20 text-center px-4">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-semibold">
              The Urban Club
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#171717]">
              Join the Private Circle
            </h2>
            <p className="text-[13px] text-[#777777] font-light">
              Receive private invitations to seasonal drops, intimate lookbooks, and VIP trunk shows.
            </p>

            {newsletterSubmitted ? (
              <div className="p-4 bg-[#BDD2BF]/30 text-[#37533E] text-[13px] font-medium tracking-wide">
                Thank you for joining. Welcome to the Urbanlifestyles collective.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  className="flex-1 bg-white border border-[#E9E7E3] px-4 py-3 text-[12px] uppercase placeholder:tracking-wider placeholder:text-[#777777] focus:outline-none focus:border-[#171717]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#171717] hover:bg-[#BDD2BF] hover:text-[#171717] text-white text-[12px] uppercase tracking-[0.16em] font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
