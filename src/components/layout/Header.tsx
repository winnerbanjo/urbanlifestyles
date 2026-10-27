"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X, Heart, User, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useStore } from "@/lib/context/StoreContext";
import { SearchModal } from "../search/SearchModal";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { store } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { label: "Shop All", href: "/shop" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Collections", href: "/collections" },
    { label: "Dresses", href: "/category/cat-dresses" },
    { label: "Sets", href: "/category/cat-sets" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E9E7E3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-[#171717] hover:text-[#777777] transition-colors focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Desktop Navigation Left */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/shop"
                className={`text-[13px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-[#777777] ${
                  pathname === "/shop" ? "text-[#171717] font-semibold border-b border-[#BDD2BF] pb-1" : "text-[#171717]"
                }`}
              >
                Shop
              </Link>
              <Link
                href="/shop?sort=newest"
                className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#171717] hover:text-[#777777] transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href="/collections"
                className={`text-[13px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-[#777777] ${
                  pathname.startsWith("/collections") ? "text-[#171717] font-semibold border-b border-[#BDD2BF] pb-1" : "text-[#171717]"
                }`}
              >
                Collections
              </Link>
              <Link
                href="/about"
                className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#171717] hover:text-[#777777] transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Brand Logo (Center) */}
            <div className="flex-1 text-center lg:flex-initial">
              <Link href="/" className="inline-flex flex-col items-center group">
                <span className="font-editorial text-2xl sm:text-3xl tracking-tight text-[#171717] font-semibold leading-none">
                  {store.name || "Urbanlifestyles"}
                </span>
                <span className="text-[9px] uppercase tracking-[0.26em] text-[#777777] font-medium mt-1">
                  Fashion is Freedom
                </span>
              </Link>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#171717] hover:text-[#777777] transition-colors focus:outline-none"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" strokeWidth={1.75} />
              </button>

              <Link
                href="/wishlist"
                className="hidden sm:inline-flex relative p-2 text-[#171717] hover:text-[#777777] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.75} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#BDD2BF] text-[#171717] text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="hidden sm:inline-flex p-2 text-[#171717] hover:text-[#777777] transition-colors"
                aria-label="Customer Account"
              >
                <User className="w-5 h-5" strokeWidth={1.75} />
              </Link>

              {/* Shopping Bag Button with count badge matching screenshot */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="relative p-2 -mr-2 text-[#171717] hover:text-[#777777] transition-colors focus:outline-none"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#BDD2BF] text-[#171717] text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-white shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF9F6] shadow-xl flex flex-col justify-between z-10 p-6 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E9E7E3]">
                <div className="flex flex-col">
                  <span className="font-editorial text-2xl text-[#171717] font-semibold leading-none">
                    {store.name || "Urbanlifestyles"}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#777777] mt-1">
                    Fashion is Freedom
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-[#171717] hover:text-[#777777]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between text-[14px] uppercase tracking-[0.14em] font-medium text-[#171717] hover:text-[#BDD2BF] py-2 border-b border-[#E9E7E3]/60 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#777777]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-6 border-t border-[#E9E7E3] space-y-3">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-[13px] uppercase tracking-[0.1em] text-[#171717] py-2"
              >
                <User className="w-4 h-4 text-[#777777]" />
                <span>Account & Orders</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-[13px] uppercase tracking-[0.1em] text-[#171717] py-2"
              >
                <Heart className="w-4 h-4 text-[#777777]" />
                <span>Saved Wishlist ({wishlistCount})</span>
              </Link>
              <div className="text-[11px] text-[#777777] pt-2">
                Currency: <span className="font-semibold text-[#171717]">NGN (₦)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
