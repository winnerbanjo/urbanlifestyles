"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { NileProduct } from "@/lib/nile/types";
import { nileApi } from "@/lib/nile/api";
import { useStore } from "@/lib/context/StoreContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { formatPrice } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<NileProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await nileApi.getProducts({
          search: searchTerm.trim(),
          limit: 6,
        });
        setResults(res.products);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 top-0 bg-[#FAF9F6] shadow-xl z-10 border-b border-[#E9E7E3] animate-in slide-in-from-top duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Search Header Input */}
          <div className="relative flex items-center border-b-2 border-[#171717] pb-3">
            <Search className="w-6 h-6 text-[#171717] mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH DRESSES, SETS, TOPS..."
              className="w-full bg-transparent text-lg sm:text-2xl font-light text-[#171717] placeholder:text-[#777777] placeholder:tracking-widest focus:outline-none uppercase"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-1 text-[#777777] hover:text-[#171717] mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#171717] hover:text-[#777777] transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Results / Status */}
          <div className="py-6 min-h-60 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-[#777777] gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#37533E]" />
                <span className="text-[13px] tracking-wider uppercase">Searching catalog...</span>
              </div>
            ) : searchTerm && results.length === 0 ? (
              <div className="text-center py-12 text-[#777777]">
                <p className="text-base font-editorial text-[#171717]">No products found matching &ldquo;{searchTerm}&rdquo;</p>
                <p className="text-[12px] mt-1">Try searching for sets, dresses, or tops.</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E7E3]">
                  <span className="text-[11px] uppercase tracking-wider text-[#777777]">
                    Matching Products ({results.length})
                  </span>
                  <Link
                    href={`/shop?search=${encodeURIComponent(searchTerm)}`}
                    onClick={onClose}
                    className="text-[11px] uppercase tracking-wider text-[#171717] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>View all results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.uuid}
                      href={`/product/${product.uuid}`}
                      onClick={onClose}
                      className="group flex flex-col"
                    >
                      <div className="relative aspect-[4/5] bg-[#EDEDEB] overflow-hidden mb-2">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="text-[12px] uppercase font-medium tracking-wider text-[#171717] group-hover:text-[#777777] truncate">
                        {product.name}
                      </h4>
                      <p className="text-[12px] text-[#777777] mt-0.5">
                        {formatPrice(product.discountedPrice ?? product.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6">
                <p className="text-[11px] uppercase tracking-widest text-[#777777] mb-3">
                  Suggested Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {["LILY SET", "DRESSES", "SETS", "KLOHE DRESS", "TOPS", "BOTTOMS"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchTerm(term)}
                      className="text-[12px] uppercase px-4 py-1.5 rounded-full border border-[#E9E7E3] hover:border-[#BDD2BF] hover:bg-[#BDD2BF]/10 text-[#171717] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
