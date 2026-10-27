"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { NileProduct, NileReview, ProductVariant } from "@/lib/nile/types";
import { nileApi } from "@/lib/nile/api";
import { useStore } from "@/lib/context/StoreContext";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import {
  Heart,
  ShoppingBag,
  Check,
  Star,
  Truck,
  ShieldAlert,
  ChevronRight,
  Minus,
  Plus,
  Loader2,
  Ruler,
} from "lucide-react";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const uuid = unwrappedParams.uuid;

  const router = useRouter();
  const { formatPrice } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<NileProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<NileProduct[]>([]);
  const [reviews, setReviews] = useState<NileReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selections
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerEmail, setNewReviewerEmail] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Size Guide modal
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      try {
        setLoading(true);
        const [prodData, relatedRes, reviewsRes] = await Promise.all([
          nileApi.getProduct(uuid),
          nileApi.getProducts({ limit: 4 }),
          nileApi.getProductReviews(uuid),
        ]);

        setProduct(prodData);
        setRelatedProducts(relatedRes.products.filter((p) => p.uuid !== uuid));
        setReviews(reviewsRes.reviews);

        // Initialize variant selection if available
        if (prodData.hasVariants && prodData.productVariants?.length > 0) {
          const first = prodData.productVariants[0];
          setSelectedVariant(first);
          const sizeAttr = first.attributes.find((a) => a.productAttribute.name.toLowerCase() === "size");
          if (sizeAttr) setSelectedSize(sizeAttr.attribute.name);
          const colAttr = first.attributes.find((a) => a.productAttribute.name.toLowerCase() === "colour" || a.productAttribute.name.toLowerCase() === "color");
          if (colAttr) setSelectedColor(colAttr.attribute.name);
        }

        setQuantity(prodData.minimumOrderQuantity || 1);
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#37533E]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="font-editorial text-3xl text-[#171717]">Product Not Found</h1>
          <p className="text-[13px] text-[#777777]">
            The requested garment may have been archived or is temporarily unavailable.
          </p>
          <Link
            href="/shop"
            className="inline-block px-7 py-3 bg-[#BDD2BF] text-[#171717] text-[12px] uppercase tracking-widest font-medium"
          >
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];
  const currentPrice = selectedVariant
    ? selectedVariant.discountedPrice ?? selectedVariant.price
    : product.discountedPrice ?? product.price;
  const isDiscounted = selectedVariant
    ? selectedVariant.discountedPrice !== null && selectedVariant.discountedPrice < selectedVariant.price
    : product.discountedPrice !== null && product.discountedPrice < product.price;

  // Extract distinct sizes & colors
  const availableSizes = Array.from(
    new Set(
      product.productVariants?.flatMap((v) =>
        v.attributes
          .filter((a) => a.productAttribute.name.toLowerCase() === "size")
          .map((a) => a.attribute.name)
      ) || []
    )
  );

  const availableColors = Array.from(
    new Set(
      product.productVariants?.flatMap((v) =>
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
    const match = product.productVariants.find((v) => {
      const vSize = v.attributes.find((a) => a.productAttribute.name.toLowerCase() === "size")?.attribute.name;
      const vColor = v.attributes.find((a) => a.productAttribute.name.toLowerCase() === "colour" || a.productAttribute.name.toLowerCase() === "color")?.attribute.name;
      if (selectedColor && vColor) return vSize === size && vColor === selectedColor;
      return vSize === size;
    });
    if (match) setSelectedVariant(match);
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    const match = product.productVariants.find((v) => {
      const vSize = v.attributes.find((a) => a.productAttribute.name.toLowerCase() === "size")?.attribute.name;
      const vColor = v.attributes.find((a) => a.productAttribute.name.toLowerCase() === "colour" || a.productAttribute.name.toLowerCase() === "color")?.attribute.name;
      if (selectedSize && vSize) return vColor === color && vSize === selectedSize;
      return vColor === color;
    });
    if (match) setSelectedVariant(match);
  };

  const handleAddToBag = async () => {
    if (product.hasVariants && !selectedVariant) return;
    try {
      setIsAdding(true);
      await addToCart({
        productId: product.uuid,
        quantity,
        isVariant: Boolean(selectedVariant),
        variantId: selectedVariant ? selectedVariant.id : null,
      });
    } catch (err) {
      console.error("Failed adding product:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (product.hasVariants && !selectedVariant) return;
    try {
      setIsBuyingNow(true);
      await addToCart({
        productId: product.uuid,
        quantity,
        isVariant: Boolean(selectedVariant),
        variantId: selectedVariant ? selectedVariant.id : null,
      });
      router.push("/checkout");
    } catch (err) {
      console.error("Failed buy now:", err);
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName || !newComment) return;
    try {
      setSubmittingReview(true);
      const created = await nileApi.createReview({
        productId: product.uuid,
        reviewerName: newReviewerName,
        reviewerEmail: newReviewerEmail || "client@urbanlifestyles.ng",
        rating: newRating,
        comment: newComment,
        isVerifiedPurchase: true,
      });
      setReviews([created, ...reviews]);
      setShowReviewForm(false);
      setNewComment("");
      setNewReviewerName("");
    } catch (err) {
      console.error("Failed submitting review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-safe-nav">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-[#777777] mb-6">
          <Link href="/" className="hover:text-[#171717]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#171717]">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/shop?category=${encodeURIComponent(product.category.name)}`} className="hover:text-[#171717]">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#171717] font-medium truncate max-w-[180px]">{product.name}</span>
        </nav>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Gallery (Left Column) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 bg-[#EDEDEB] shrink-0 border transition-all ${
                      activeImageIndex === idx ? "border-[#171717]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 aspect-[4/5] bg-[#EDEDEB] overflow-hidden">
              <Image
                src={images[activeImageIndex] || product.imageUrl}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />

              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.uuid)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#171717] hover:bg-white shadow-xs transition-colors"
                aria-label={isInWishlist(product.uuid) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(product.uuid) ? "fill-[#BDD2BF] text-[#BDD2BF]" : "text-[#171717]"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Product Details (Right Column) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#777777]">
                  {product.category?.name || "Collection"}
                </span>
                {averageRating && (
                  <div className="flex items-center gap-1 text-[12px] text-[#171717]">
                    <Star className="w-3.5 h-3.5 fill-[#BDD2BF] text-[#BDD2BF]" />
                    <span className="font-semibold">{averageRating}</span>
                    <span className="text-[#777777]">({reviews.length})</span>
                  </div>
                )}
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl text-[#171717] font-normal uppercase tracking-wide mt-1">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-light text-[#171717] tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {isDiscounted && (
                  <span className="text-base text-[#777777] line-through font-light">
                    {formatPrice(selectedVariant ? selectedVariant.price : product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-[13px] sm:text-[14px] text-[#777777] leading-relaxed font-light">
              {product.description}
            </p>

            <div className="h-px bg-[#E9E7E3]" />

            {/* Colour Variant Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="font-semibold uppercase tracking-wider text-[#171717]">
                    Colour: <span className="font-normal text-[#777777]">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {availableColors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={`text-[12px] uppercase px-4 py-2 rounded-full border transition-all ${
                          isSelected
                            ? "bg-[#BDD2BF] border-[#BDD2BF] text-[#171717] font-semibold"
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

            {/* Size Variant Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="font-semibold uppercase tracking-wider text-[#171717]">
                    Size: <span className="font-normal text-[#777777]">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] uppercase tracking-wider text-[#777777] hover:text-[#171717] flex items-center gap-1 underline underline-offset-4"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSelectSize(size)}
                        className={`w-12 h-11 border flex items-center justify-center text-[13px] font-medium transition-all ${
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
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#171717]">
                Quantity
              </span>
              <div className="flex items-center border border-[#E9E7E3] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(product.minimumOrderQuantity || 1, q - 1))}
                  className="p-2.5 text-[#171717] hover:bg-[#FAF9F6]"
                  disabled={quantity <= (product.minimumOrderQuantity || 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-[13px] font-medium text-[#171717] min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-[#171717] hover:bg-[#FAF9F6]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={isAdding || product.isSoldOut}
                className="w-full py-4 bg-[#BDD2BF] hover:bg-[#A9C3AE] text-[#171717] font-medium text-[13px] uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isAdding ? (
                  <span>Adding to Bag...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {formatPrice(currentPrice * quantity)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isBuyingNow || product.isSoldOut}
                className="w-full py-4 bg-[#171717] hover:bg-black text-white font-medium text-[13px] uppercase tracking-[0.16em] transition-colors disabled:opacity-50"
              >
                {isBuyingNow ? "Processing..." : "Buy Now"}
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="space-y-3 pt-4 border-t border-[#E9E7E3] text-[12px] text-[#777777]">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#171717] shrink-0" />
                <span>Complimentary nationwide delivery on orders over ₦75,000</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-[#171717] shrink-0" />
                <span>7-day bespoke size exchanges & seamless concierge returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-20 pt-12 border-t border-[#E9E7E3]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#171717]">
                Customer Reviews
              </h3>
              <p className="text-[12px] text-[#777777] mt-1">
                Verified client feedback for {product.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 border border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white text-[11px] uppercase tracking-widest font-medium transition-colors self-start sm:self-auto"
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-10 p-6 bg-white border border-[#E9E7E3] space-y-4 max-w-xl"
            >
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#171717]">
                Submit Your Feedback
              </h4>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#777777] block mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? "fill-[#BDD2BF] text-[#BDD2BF]" : "text-[#E9E7E3]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#777777] block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewerName}
                    onChange={(e) => setNewReviewerName(e.target.value)}
                    className="w-full border border-[#E9E7E3] px-3 py-2 text-[13px] focus:outline-none focus:border-[#171717]"
                    placeholder="e.g. Ada O."
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#777777] block mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={newReviewerEmail}
                    onChange={(e) => setNewReviewerEmail(e.target.value)}
                    className="w-full border border-[#E9E7E3] px-3 py-2 text-[13px] focus:outline-none focus:border-[#171717]"
                    placeholder="ada@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#777777] block mb-1">
                  Comments & Fit Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border border-[#E9E7E3] p-3 text-[13px] focus:outline-none focus:border-[#171717]"
                  placeholder="Share details regarding sizing, drape, fabric quality..."
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-3 bg-[#171717] hover:bg-[#BDD2BF] hover:text-[#171717] text-white text-[12px] uppercase tracking-widest font-medium transition-colors disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Post Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-[13px] text-[#777777] py-6">
              There are no reviews for this product yet. Be the first to share your experience.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 border border-[#E9E7E3] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#171717]">
                      {rev.reviewerName}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? "fill-[#BDD2BF] text-[#BDD2BF]" : "text-[#E9E7E3]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[10px] uppercase tracking-wider text-[#37533E] font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                  <p className="text-[13px] text-[#777777] leading-relaxed pt-1 font-light">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E9E7E3]">
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#171717] mb-8">
              Complete The Look
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd.uuid} product={relProd} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky Mobile Add-to-Bag Bar */}
      <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,12px))] inset-x-0 z-20 lg:hidden bg-[#FAF9F6] border-t border-[#E9E7E3] p-3 shadow-md flex items-center justify-between gap-3">
        <div>
          <span className="text-[12px] font-semibold text-[#171717] block truncate max-w-[140px]">
            {product.name}
          </span>
          <span className="text-[12px] text-[#777777]">
            {formatPrice(currentPrice)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToBag}
          disabled={isAdding || product.isSoldOut}
          className="flex-1 py-2.5 bg-[#BDD2BF] text-[#171717] font-semibold text-[12px] uppercase tracking-wider rounded-none flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isAdding ? "Adding..." : "Add to Bag"}</span>
        </button>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsSizeGuideOpen(false)} />
          <div className="relative bg-[#FAF9F6] p-6 max-w-lg w-full rounded-none border border-[#E9E7E3] shadow-xl z-10 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E9E7E3] pb-3">
              <h3 className="font-editorial text-2xl text-[#171717]">Atelier Size Guide</h3>
              <button type="button" onClick={() => setIsSizeGuideOpen(false)} className="text-[#777777] hover:text-[#171717]">
                ✕
              </button>
            </div>
            <div className="text-[12px] text-[#777777] space-y-3">
              <p>Measurements are in inches. Fits true to size with tailored ease.</p>
              <table className="w-full text-left border-collapse border border-[#E9E7E3]">
                <thead>
                  <tr className="bg-[#EDEDEB] text-[#171717]">
                    <th className="p-2 border border-[#E9E7E3]">Size</th>
                    <th className="p-2 border border-[#E9E7E3]">Bust</th>
                    <th className="p-2 border border-[#E9E7E3]">Waist</th>
                    <th className="p-2 border border-[#E9E7E3]">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-[#E9E7E3] font-semibold">XS</td>
                    <td className="p-2 border border-[#E9E7E3]">32 - 33</td>
                    <td className="p-2 border border-[#E9E7E3]">24 - 25</td>
                    <td className="p-2 border border-[#E9E7E3]">34 - 35</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[#E9E7E3] font-semibold">S</td>
                    <td className="p-2 border border-[#E9E7E3]">34 - 35</td>
                    <td className="p-2 border border-[#E9E7E3]">26 - 27</td>
                    <td className="p-2 border border-[#E9E7E3]">36 - 37</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[#E9E7E3] font-semibold">M</td>
                    <td className="p-2 border border-[#E9E7E3]">36 - 37</td>
                    <td className="p-2 border border-[#E9E7E3]">28 - 29</td>
                    <td className="p-2 border border-[#E9E7E3]">38 - 40</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[#E9E7E3] font-semibold">L</td>
                    <td className="p-2 border border-[#E9E7E3]">38 - 40</td>
                    <td className="p-2 border border-[#E9E7E3]">30 - 32</td>
                    <td className="p-2 border border-[#E9E7E3]">41 - 43</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
