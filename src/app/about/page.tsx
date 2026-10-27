"use client";

import React from "react";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useStore } from "@/lib/context/StoreContext";
import { Sparkles, Truck, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  const { store } = useStore();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Top Story */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-semibold">
            Our Atelier & Ethos
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#171717] font-normal leading-tight">
            Fashion is Freedom
          </h1>
          <p className="text-[14px] text-[#777777] leading-relaxed font-light">
            {store.about ||
              "Urbanlifestyles was founded on a simple conviction: luxury should be both sculpturally precise and liberatingly effortless to wear. Every seam, pleat, and fabric is selected for timeless grace."}
          </p>
        </div>

        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full bg-[#EDEDEB] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Atelier Fashion Craftsmanship"
            fill
            className="object-cover"
          />
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[#E9E7E3]">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#BDD2BF]/20 flex items-center justify-center text-[#37533E]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-2xl text-[#171717]">Architectural Cuts</h3>
            <p className="text-[13px] text-[#777777] leading-relaxed font-light">
              We design structured silhouettes that sculpt without constraining movement, utilizing premium linens, crepe, and silk-chiffon blends.
            </p>
          </div>

          <div id="shipping" className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#BDD2BF]/20 flex items-center justify-center text-[#37533E]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-2xl text-[#171717]">Express Dispatch</h3>
            <p className="text-[13px] text-[#777777] leading-relaxed font-light">
              Orders are packaged in luxury garment cases and dispatched via tracked courier within 24 to 48 hours to destinations worldwide.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#BDD2BF]/20 flex items-center justify-center text-[#37533E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-2xl text-[#171717]">Responsible Production</h3>
            <p className="text-[13px] text-[#777777] leading-relaxed font-light">
              Limited-run capsule drops ensure minimal inventory waste and fair ethical remuneration for our atelier seamstresses and tailors.
            </p>
          </div>
        </div>

        {/* Size Guide Details */}
        <div id="sizing" className="p-8 bg-white border border-[#E9E7E3] space-y-4">
          <h3 className="font-editorial text-3xl text-[#171717]">Sizing Philosophy</h3>
          <p className="text-[13px] text-[#777777] leading-relaxed font-light">
            Our pieces are true to size according to contemporary luxury standards. For matching sets featuring elasticated waistbands or corsetry, pick your standard bust and hip measurement. For personalized fit counsel, contact our concierge on WhatsApp.
          </p>
          {store.contact?.phone && (
            <div className="pt-2">
              <span className="text-[12px] font-semibold text-[#171717]">Concierge Desk: </span>
              <a href={`tel:${store.contact.phone}`} className="text-[12px] text-[#37533E] underline">
                {store.contact.phone}
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
