"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useStore } from "@/lib/context/StoreContext";
import { ProductVariant } from "@/lib/nile/types";

export const QuickAddModal: React.FC = () => {
  const { quickAddProduct, closeQuickAdd, addToCart } = useCart();
  const { formatPrice } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Group variants by size and color
  useEffect(() => {
    if (quickAddProduct && quickAddProduct.productVariants?.length > 0) {
      const firstVar = quickAddProduct.productVariants[0];
      setSelectedVariant(firstVar);

      const sizeAttr = firstVar.attributes.find(
        (a) => a.productAttribute.name.toLowerCase() === "size"
      );
      if (sizeAttr) setSelectedSize(sizeAttr.attribute.name);

      const colorAttr = firstVar.attributes.find(
        (a) => a.productAttribute.name.toLowerCase() === "colour" || a.productAttribute.name.toLowerCase() === "color"
      );
      if (colorAttr) setSelectedColor(colorAttr.attribute.name);
      setQuantity(1);
    }
  }, [quickAddProduct]);

  if (!quickAddProduct) return null;

  // Extract distinct sizes & colors
  const availableSizes = Array.from(
    new Set(
      quickAddProduct.productVariants?.flatMap((v) =>
        v.attributes
          .filter((a) => a.productAttribute.name.toLowerCase() === "size")
          .map((a) => a.attribute.name)
      ) || []
    )
  );

  const availableColors = Array.from(
    new Set(
      quickAddProduct.productVariants?.flatMap((v) =>
        v.attributes
          .filter(
            (a) =>
              a.productAttribute.name.toLowerCase() === "colour" ||
              a.productAttribute.name.toLowerCase() === "color"
          )
          .map((a) => a.attribute.name)
      ) || []
    )
  );

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    // Find matching variant
    const match = quickAddProduct.productVariants.find((v) => {
      const vSize = v.attributes.find((a) => a.productAttribute.name.toLowerCase() === "size")?.attribute.name;
      const vColor = v.attributes.find(
        (a) => a.productAttribute.name.toLowerCase() === "colour" || a.productAttribute.name.toLowerCase() === "color"
      )?.attribute.name;

      if (selectedColor && vColor) {
        return vSize === size && vColor === selectedColor;
      }
      return vSize === size;
    });

    if (match) setSelectedVariant(match);
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    const match = quickAddProduct.productVariants.find((v) => {
      const vSize = v.attributes.find((a) => a.productAttribute.name.toLowerCase() === "size")?.attribute.name;
      const vColor = v.attributes.find(
        (a) => a.productAttribute.name.toLowerCase() === "colour" || a.productAttribute.name.toLowerCase() === "color"
      )?.attribute.name;

      if (selectedSize && vSize) {
        return vColor === color && vSize === selectedSize;
      }
      return vColor === color;
    });

    if (match) setSelectedVariant(match);
  };

  const handleAdd = async () => {
    if (!selectedVariant && quickAddProduct.hasVariants) {
      return;
    }

    try {
      setLoading(true);
      await addToCart({
        productId: quickAddProduct.uuid,
        quantity,
        isVariant: Boolean(selectedVariant),
        variantId: selectedVariant ? selectedVariant.id : null,
      });
      closeQuickAdd();
    } catch (err) {
      console.error("Failed quick add:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentPrice = selectedVariant
    ? selectedVariant.discountedPrice ?? selectedVariant.price
    : quickAddProduct.discountedPrice ?? quickAddProduct.price;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeQuickAdd}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full sm:max-w-md bg-[#FAF9F6] rounded-t-2xl sm:rounded-2xl shadow-xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-200 p-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E9E7E3]">
          <div className="flex gap-4 items-center">
            <div className="relative w-16 h-20 bg-[#EDEDEB] shrink-0 overflow-hidden">
              <Image
                src={quickAddProduct.imageUrl}
                alt={quickAddProduct.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-[14px] uppercase tracking-wider text-[#171717]">
                {quickAddProduct.name}
              </h3>
              <p className="text-[13px] text-[#171717] mt-1 font-normal">
                {formatPrice(currentPrice)}
              </p>
              {selectedVariant && (
                <span className="text-[11px] text-[#777777] block mt-0.5">
                  SKU: {selectedVariant.sku} • {selectedVariant.quantity > 0 ? "In Stock" : "Out of stock"}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={closeQuickAdd}
            className="p-1.5 text-[#171717] hover:text-[#777777]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="py-5 space-y-4">
          {/* Colors */}
          {availableColors.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#171717] block mb-2">
                Colour: <span className="font-normal text-[#777777]">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleSelectColor(color)}
                      className={`text-[12px] uppercase px-3.5 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? "bg-[#BDD2BF] border-[#BDD2BF] text-[#171717] font-medium"
                          : "border-[#E9E7E3] text-[#171717] hover:border-[#171717]"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#171717] block mb-2">
                Size: <span className="font-normal text-[#777777]">{selectedSize}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSelectSize(size)}
                      className={`w-11 h-10 rounded-sm border flex items-center justify-center text-[12px] font-medium transition-all ${
                        isSelected
                          ? "bg-[#171717] border-[#171717] text-white"
                          : "border-[#E9E7E3] text-[#171717] hover:border-[#171717]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#171717]">
              Quantity
            </span>
            <div className="flex items-center border border-[#E9E7E3] rounded-sm bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-[#171717] hover:bg-[#FAF9F6]"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-[13px] font-medium text-[#171717] min-w-8 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 text-[#171717] hover:bg-[#FAF9F6]"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading || (quickAddProduct.hasVariants && !selectedVariant)}
            className="w-full py-3.5 bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] font-medium text-[13px] uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span>Adding to Bag...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Add to Bag • {formatPrice(currentPrice * quantity)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
