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
              {store.about || "We sell premium urban outfits"}
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={`https://instagram.com/${store.socials?.instagram || "urbanlifestyles"}`}
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

              <a
                href={store.socials?.whatsappLink || "https://wa.me/2349068718414"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#E9E7E3] flex items-center justify-center text-[#171717] hover:border-[#BDD2BF] hover:bg-[#BDD2BF]/10 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.07 16.3C4.24 14.98 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.36 7.03 9.08 7.1 8.84 7.35C8.61 7.61 7.96 8.22 7.96 9.46C7.96 10.7 8.86 11.9 8.99 12.07C9.12 12.24 10.76 14.77 13.3 15.86C15.42 16.77 15.84 16.59 16.3 16.55C16.77 16.5 17.78 15.95 17.99 15.36C18.2 14.77 18.2 14.26 18.13 14.16C18.06 14.05 17.89 13.99 17.63 13.86C17.38 13.74 16.14 13.13 15.91 13.04C15.68 12.96 15.51 12.92 15.34 13.17C15.17 13.43 14.69 13.99 14.54 14.16C14.39 14.33 14.24 14.35 13.98 14.22C13.73 14.1 12.91 13.83 11.94 12.96C11.18 12.28 10.67 11.45 10.52 11.19C10.37 10.94 10.5 10.8 10.63 10.67C10.75 10.55 10.89 10.36 11.02 10.21C11.15 10.06 11.2 9.95 11.28 9.79C11.37 9.62 11.32 9.47 11.26 9.35C11.2 9.22 10.69 7.97 10.48 7.46C10.27 6.97 10.06 7.03 9.9 7.03C9.74 7.03 9.58 7.03 9.53 7.03Z" />
                </svg>
              </a>

              <a
                href={`mailto:${store.contact?.email || "urbannlifestyles@gmail.com"}`}
                className="w-9 h-9 rounded-full border border-[#E9E7E3] flex items-center justify-center text-[#171717] hover:border-[#BDD2BF] hover:bg-[#BDD2BF]/10 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
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
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#171717] shrink-0 mt-0.5" />
                <span>
                  {store.contact?.address || "Premier 3, Olayinka Abiola street"}, {store.contact?.city || "Lagos"}, {store.contact?.country || "Nigeria"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#171717] shrink-0" />
                <a
                  href={`tel:${store.contact?.phone || "+2349068718414"}`}
                  className="hover:text-[#171717] transition-colors"
                >
                  {store.contact?.phone || "+2349068718414"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#171717] shrink-0" />
                <a
                  href={`mailto:${store.contact?.email || "urbannlifestyles@gmail.com"}`}
                  className="hover:text-[#171717] transition-colors"
                >
                  {store.contact?.email || "urbannlifestyles@gmail.com"}
                </a>
              </div>
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
