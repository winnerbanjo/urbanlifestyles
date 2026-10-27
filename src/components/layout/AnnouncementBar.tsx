"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/context/StoreContext";
import { Globe } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const { storeNotice } = useStore();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    { left: "FASHION IS FREEDOM", right: "WORLDWIDE SHIPPING" },
    { left: "DISCOVER THE NEW COLLECTION", right: "HAND-CRAFTED LUXURY" },
    ...(storeNotice ? [{ left: "EXCLUSIVE OFFER", right: storeNotice }] : []),
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  const activeMsg = messages[currentMessageIndex];

  return (
    <div className="bg-[#BDD2BF] text-[#171717] text-[11px] sm:text-[12px] font-medium tracking-[0.14em] py-2 px-3 border-b border-[#A9C3AE]/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center sm:gap-8 overflow-hidden">
        {/* Left segment */}
        <div className="flex-1 text-center sm:flex-initial uppercase truncate">
          <span>{activeMsg.left}</span>
        </div>

        {/* Subtle vertical divider */}
        <div className="h-3 w-px bg-[#171717]/25 mx-2 hidden sm:block" />

        {/* Right segment */}
        <div className="flex-1 text-center sm:flex-initial uppercase flex items-center justify-center gap-1.5 truncate">
          <span>{activeMsg.right}</span>
          <Globe className="w-3.5 h-3.5 inline-block opacity-80 shrink-0" />
        </div>
      </div>
    </div>
  );
};
