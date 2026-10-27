"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { NileProduct } from "@/lib/nile/types";
import { useStore } from "@/lib/context/StoreContext";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";

interface ProductCardProps {
  product: NileProduct;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { formatPrice } = useStore();
  const { addToCart, openQuickAdd } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Swatch state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : [product.imageUrl];

  const currentImage = images[selectedImageIndex] || product.imageUrl;

  const inWishlist = isInWishlist(product.uuid);

  // Extract color swatches from product attributes
  const colorAttribute = product.attributesValues?.filter(
    (attr) => attr.productAttribute.name.toLowerCase() === "colour" || attr.productAttribute.name.toLowerCase() === "color"
  );

  const handleBagClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has variants, open the quick-add drawer so the user can select size & color
    if (product.hasVariants && product.productVariants && product.productVariants.length > 0) {
      openQuickAdd(product);
      return;
    }

    // Simple product without variants: add directly
    try {
      setIsAdding(true);
      await addToCart({
        productId: product.uuid,
        quantity: 1,
        isVariant: false,
      });
    } catch (err) {
      console.error("Failed adding simple product to bag:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.uuid);
  };

  const priceToDisplay = product.discountedPrice ?? product.price;
  const isDiscounted = product.discountedPrice !== null && product.discountedPrice < product.price;

  return (
    <article className="group flex flex-col relative w-full text-left select-none">
      {/* Product Image Container with exact 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EDEDEB] rounded-none">
        <Link href={`/product/${product.uuid}`} className="block w-full h-full relative" aria-label={`View ${product.name}`}>
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Top Badges (Preorder / Sold Out) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
          {product.isSoldOut && (
            <span className="bg-[#171717] text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5">
              Sold Out
            </span>
          )}
          {product.isPreorder && !product.isSoldOut && (
            <span className="bg-[#BDD2BF] text-[#171717] text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5">
              Pre-order
            </span>
          )}
          {isDiscounted && !product.isSoldOut && (
            <span className="bg-[#BDD2BF] text-[#171717] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-[#171717] hover:bg-white transition-colors duration-150"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? "fill-[#BDD2BF] text-[#BDD2BF]" : "text-[#171717]/80"
            }`}
          />
        </button>

        {/* Floating Circular Add to Bag Button (Bottom Right) matching screenshot */}
        <button
          type="button"
          onClick={handleBagClick}
          disabled={product.isSoldOut || isAdding}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-2.5 right-2.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] flex items-center justify-center shadow-xs transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.75]" />
        </button>
      </div>

      {/* Product Information directly below image */}
      <div className="pt-2.5 pb-2">
        {/* Title and Swatches Row */}
        <div className="flex items-center justify-between gap-1.5">
          <Link
            href={`/product/${product.uuid}`}
            className="font-medium text-[12px] sm:text-[13px] tracking-[0.08em] uppercase text-[#171717] hover:text-[#777777] transition-colors truncate"
          >
            {product.name}
          </Link>

          {/* Color Swatch Dots matching screenshot */}
          {colorAttribute && colorAttribute.length > 0 && (
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {colorAttribute.map((attr, idx) => {
                const hex = attr.attribute.hexColor || (idx === 0 ? "#BDD2BF" : idx === 1 ? "#D6C7E8" : "#FAF7F2");
                const isSelected = selectedImageIndex === idx;

                return (
                  <button
                    key={`${attr.attribute.name}-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (images[idx]) {
                        setSelectedImageIndex(idx);
                      }
                    }}
                    title={attr.attribute.name}
                    aria-label={`Select color ${attr.attribute.name}`}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border transition-transform ${
                      isSelected ? "scale-115 border-[#171717]" : "border-black/20 hover:scale-110"
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Price beneath title */}
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-[12px] sm:text-[13px] font-normal text-[#171717] tracking-tight">
            {formatPrice(priceToDisplay)}
          </span>
          {isDiscounted && (
            <span className="text-[11px] text-[#777777] line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
