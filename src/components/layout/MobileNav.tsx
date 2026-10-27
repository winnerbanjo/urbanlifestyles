"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Layers, Heart, User } from "lucide-react";
import { useWishlist } from "@/lib/context/WishlistContext";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();

  // Hide mobile nav during checkout to ensure zero distraction
  if (pathname.startsWith("/checkout")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Shop",
      href: "/shop",
      icon: LayoutGrid,
      isActive: pathname === "/shop" || pathname.startsWith("/product/"),
    },
    {
      label: "Collections",
      href: "/collections",
      icon: Layers,
      isActive: pathname.startsWith("/collections") || pathname.startsWith("/category/"),
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      isActive: pathname === "/wishlist",
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      label: "Account",
      href: "/account",
      icon: User,
      isActive: pathname.startsWith("/account"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#E9E7E3] pb-[env(safe-area-inset-bottom,12px)] transition-all"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                active ? "text-[#37533E]" : "text-[#777777] hover:text-[#171717]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? "scale-110 stroke-[2.25] text-[#37533E]" : "stroke-[1.5]"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#BDD2BF] text-[#171717] text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-wider uppercase font-medium ${
                  active ? "text-[#171717] font-semibold" : "text-[#777777]"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-[#BDD2BF] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
