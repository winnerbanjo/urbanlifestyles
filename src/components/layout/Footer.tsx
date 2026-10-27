"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const { store } = useStore();

  return (
    <footer className="bg-[#FAF9F6] border-t border-[#E9E7E3] pt-14 pb-24 lg:pb-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#E9E7E3]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-editorial text-3xl font-semibold tracking-tight text-[#171717]">
                {store.name || "Urbanlifestyles"}
              </span>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#777777] font-medium mt-1">
                Fashion is Freedom
              </p>
            </Link>
            <p className="text-[13px] text-[#777777] leading-relaxed max-w-sm">
              {store.about ||
                "Curated ready-to-wear luxury garments engineered with refined tailoring and effortless comfort. Designed for contemporary silhouettes."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 pt-2">
              {store.socials?.instagram && (
                <a
                  href={`https://instagram.com/${store.socials.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#E9E7E3] flex items-center justify-center text-[#171717] hover:border-[#BDD2BF] hover:bg-[#BDD2BF]/10 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {store.socials?.twitter && (
                <a
                  href={`https://twitter.com/${store.socials.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#E9E7E3] flex items-center justify-center text-[#171717] hover:border-[#BDD2BF] hover:bg-[#BDD2BF]/10 transition-colors"
                  aria-label="Twitter / X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {store.contact?.email && (
                <a
                  href={`mailto:${store.contact.email}`}
                  className="w-9 h-9 rounded-full border border-[#E9E7E3] flex items-center justify-center text-[#171717] hover:border-[#BDD2BF] hover:bg-[#BDD2BF]/10 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171717]">
              Collections
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#777777]">
              <li>
                <Link href="/shop" className="hover:text-[#171717] transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/category/cat-dresses" className="hover:text-[#171717] transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/category/cat-sets" className="hover:text-[#171717] transition-colors">
                  Matching Sets
                </Link>
              </li>
              <li>
                <Link href="/category/cat-tops" className="hover:text-[#171717] transition-colors">
                  Tops & Blouses
                </Link>
              </li>
              <li>
                <Link href="/category/cat-bottoms" className="hover:text-[#171717] transition-colors">
                  Bottoms & Trousers
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=newest" className="hover:text-[#171717] transition-colors">
                  New In
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171717]">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#777777]">
              <li>
                <Link href="/account" className="hover:text-[#171717] transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#171717] transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#171717] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/about#shipping" className="hover:text-[#171717] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/about#sizing" className="hover:text-[#171717] transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171717]">
              Atelier & Contact
            </h4>
            <div className="space-y-2.5 text-[13px] text-[#777777]">
              {store.contact?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#171717] shrink-0 mt-0.5" />
                  <span>
                    {store.contact.address}, {store.contact.city}
                  </span>
                </div>
              )}
              {store.contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#171717] shrink-0" />
                  <a href={`tel:${store.contact.phone}`} className="hover:text-[#171717]">
                    {store.contact.phone}
                  </a>
                </div>
              )}
              {store.contact?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#171717] shrink-0" />
                  <a href={`mailto:${store.contact.email}`} className="hover:text-[#171717]">
                    {store.contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777777] gap-4">
          <p>
            © {new Date().getFullYear()} {store.name || "Urbanlifestyles"}. Powered by Nile Storefront.
          </p>
          <div className="flex items-center space-x-6">
            <span>Secure Checkout with Paystack</span>
            <span>Worldwide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
