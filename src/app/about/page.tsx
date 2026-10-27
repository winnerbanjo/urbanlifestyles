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

          <div className="space-y-3">
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

        {/* Detailed Shipping & Returns Section */}
        <section id="shipping" className="scroll-mt-24 pt-8 border-t border-[#E9E7E3] space-y-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-semibold">
              Delivery Logistics & Guarantees
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#171717] mt-1">
              Shipping & Returns Policy
            </h2>
            <p className="text-[13px] text-[#777777] max-w-xl mt-2 font-light">
              Every garment is rigorously inspected in our Lagos atelier before being dispatched in signature protective packaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-[#E9E7E3] space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-[#37533E] font-semibold block">
                Lagos Express
              </span>
              <h3 className="font-editorial text-2xl text-[#171717]">24 – 48 Hours</h3>
              <p className="text-[13px] text-[#777777] leading-relaxed font-light">
                Same-day and next-day express delivery across Lagos metropolitan area. Fully tracked dispatch directly to your doorstep.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E9E7E3] space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-[#37533E] font-semibold block">
                Nationwide (Nigeria)
              </span>
              <h3 className="font-editorial text-2xl text-[#171717]">2 – 4 Business Days</h3>
              <p className="text-[13px] text-[#777777] leading-relaxed font-light">
                Tracked courier service to Abuja, Port Harcourt, Ibadan, and all 36 states across Nigeria. Tracking updates sent via email and SMS.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E9E7E3] space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-[#37533E] font-semibold block">
                Worldwide Shipping
              </span>
              <h3 className="font-editorial text-2xl text-[#171717]">3 – 7 Business Days</h3>
              <p className="text-[13px] text-[#777777] leading-relaxed font-light">
                International express transit via DHL Express or FedEx to the United Kingdom, United States, Canada, Ghana, and Europe.
              </p>
            </div>
          </div>

          {/* 7-Day Return & Exchange Promise */}
          <div className="p-8 bg-[#EBF2EC] border border-[#BDD2BF] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#37533E] font-semibold">
                  Client Satisfaction
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#171717] mt-0.5">
                  7-Day Seamless Size Exchanges
                </h3>
              </div>
              <a
                href={store.socials?.whatsappLink || "https://wa.me/2349068718414"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#171717] hover:bg-[#333333] text-white text-[11px] uppercase tracking-widest font-medium transition-colors text-center shrink-0"
              >
                Request an Exchange on WhatsApp
              </a>
            </div>
            <p className="text-[13px] text-[#37533E]/90 leading-relaxed font-light max-w-2xl">
              If an outfit does not fit as desired, we gladly offer size exchanges or store credits within 7 calendar days of delivery. Items must be unworn, unwashed, and in their original packaging with security seals intact.
            </p>
          </div>
        </section>

        {/* Detailed Sizing Guide Section */}
        <section id="sizing" className="scroll-mt-24 pt-8 border-t border-[#E9E7E3] space-y-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-semibold">
              Fit & Proportions
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#171717] mt-1">
              Atelier Size Guide (UK 8 – 20)
            </h2>
            <p className="text-[13px] text-[#777777] max-w-xl mt-2 font-light">
              Our designs are engineered true to size based on modern luxury standards. Refer to our size conversion and body measurement matrix below.
            </p>
          </div>

          <div className="overflow-x-auto border border-[#E9E7E3] bg-white">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#E9E7E3] bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#171717]">
                  <th className="p-3.5 sm:p-4 font-semibold">UK Size</th>
                  <th className="p-3.5 sm:p-4 font-semibold">US Size</th>
                  <th className="p-3.5 sm:p-4 font-semibold">EU Size</th>
                  <th className="p-3.5 sm:p-4 font-semibold">Bust (Inches / CM)</th>
                  <th className="p-3.5 sm:p-4 font-semibold">Waist (Inches / CM)</th>
                  <th className="p-3.5 sm:p-4 font-semibold">Hips (Inches / CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E7E3] text-[#777777]">
                <tr className="hover:bg-[#FAF9F6]/60">
                  <td className="p-3.5 sm:p-4 font-medium text-[#171717]">UK 8 (S)</td>
                  <td className="p-3.5 sm:p-4">US 4</td>
                  <td className="p-3.5 sm:p-4">EU 36</td>
                  <td className="p-3.5 sm:p-4">33" (84 cm)</td>
                  <td className="p-3.5 sm:p-4">26" (66 cm)</td>
                  <td className="p-3.5 sm:p-4">36" (91 cm)</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]/60">
                  <td className="p-3.5 sm:p-4 font-medium text-[#171717]">UK 10 (M)</td>
                  <td className="p-3.5 sm:p-4">US 6</td>
                  <td className="p-3.5 sm:p-4">EU 38</td>
                  <td className="p-3.5 sm:p-4">35" (89 cm)</td>
                  <td className="p-3.5 sm:p-4">28" (71 cm)</td>
                  <td className="p-3.5 sm:p-4">38" (96 cm)</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]/60">
                  <td className="p-3.5 sm:p-4 font-medium text-[#171717]">UK 12 (L)</td>
                  <td className="p-3.5 sm:p-4">US 8</td>
                  <td className="p-3.5 sm:p-4">EU 40</td>
                  <td className="p-3.5 sm:p-4">37" (94 cm)</td>
                  <td className="p-3.5 sm:p-4">30" (76 cm)</td>
                  <td className="p-3.5 sm:p-4">40" (101 cm)</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]/60">
                  <td className="p-3.5 sm:p-4 font-medium text-[#171717]">UK 14 (XL)</td>
                  <td className="p-3.5 sm:p-4">US 10</td>
                  <td className="p-3.5 sm:p-4">EU 42</td>
                  <td className="p-3.5 sm:p-4">39" (99 cm)</td>
                  <td className="p-3.5 sm:p-4">32" (81 cm)</td>
                  <td className="p-3.5 sm:p-4">42" (106 cm)</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]/60">
                  <td className="p-3.5 sm:p-4 font-medium text-[#171717]">UK 16 (2XL)</td>
                  <td className="p-3.5 sm:p-4">US 12</td>
                  <td className="p-3.5 sm:p-4">EU 44</td>
                  <td className="p-3.5 sm:p-4">41" (104 cm)</td>
                  <td className="p-3.5 sm:p-4">34" (86 cm)</td>
                  <td className="p-3.5 sm:p-4">44" (112 cm)</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]/60">
                  <td className="p-3.5 sm:p-4 font-medium text-[#171717]">UK 18 (3XL)</td>
                  <td className="p-3.5 sm:p-4">US 14</td>
                  <td className="p-3.5 sm:p-4">EU 46</td>
                  <td className="p-3.5 sm:p-4">43" (109 cm)</td>
                  <td className="p-3.5 sm:p-4">36" (91 cm)</td>
                  <td className="p-3.5 sm:p-4">46" (117 cm)</td>
                </tr>
                <tr className="hover:bg-[#FAF9F6]/60">
                  <td className="p-3.5 sm:p-4 font-medium text-[#171717]">UK 20 (4XL)</td>
                  <td className="p-3.5 sm:p-4">US 16</td>
                  <td className="p-3.5 sm:p-4">EU 48</td>
                  <td className="p-3.5 sm:p-4">45" (114 cm)</td>
                  <td className="p-3.5 sm:p-4">38" (97 cm)</td>
                  <td className="p-3.5 sm:p-4">48" (122 cm)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-[#E9E7E3] space-y-2">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#171717]">
                How to Measure
              </h4>
              <ul className="space-y-1.5 text-[12px] text-[#777777] font-light">
                <li><strong className="font-medium text-[#171717]">Bust:</strong> Measure around the fullest part of your chest with tape horizontal.</li>
                <li><strong className="font-medium text-[#171717]">Waist:</strong> Measure around your natural waistline, typically the narrowest point.</li>
                <li><strong className="font-medium text-[#171717]">Hips:</strong> Stand with feet together and measure around the widest point.</li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-[#E9E7E3] space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#171717]">
                  Need Personalized Fit Advice?
                </h4>
                <p className="text-[12px] text-[#777777] font-light mt-1">
                  Our atelier stylists are available on WhatsApp to guide you on sizing for specific dresses or matching sets before placing an order.
                </p>
              </div>
              <a
                href={store.socials?.whatsappLink || "https://wa.me/2349068718414"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#37533E] hover:underline"
              >
                Chat with Concierge Stylist →
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
