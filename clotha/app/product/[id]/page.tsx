"use client";

import { use, useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useProduct, useProducts } from "@/lib/hooks";
import Link from "next/link";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart, addingProductId } = useCartContext();
  const { formatPrice } = useStore();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2a2a2a] border-t-[#c8a96e] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-neutral-400">Product not found</p>
        <Link
          href="/"
          className="text-sm underline text-neutral-500 hover:text-[#c8a96e] transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const thumbnails = product.images ?? [];
  const displayPrice = product.sales_price ?? product.price;
  const isOnSale = product.sales_price && product.sales_price < product.price;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pb-8">
      <div className="max-w-[1280px] mx-auto px-5 py-8">
        {/* Breadcrumbs */}
        <nav className={`flex items-center gap-2 text-xs text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Link href="/" className="hover:text-[#c8a96e] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/search?q=" className="hover:text-[#c8a96e] transition-colors">
            Collection
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-medium">{product.name}</span>
        </nav>

        <div ref={mainRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className={`md:col-span-1 lg:col-span-5 xl:col-span-6 flex flex-col gap-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative aspect-square bg-[#141414] overflow-hidden group">
              {thumbnails[activeImg] && (
                <Image
                  src={thumbnails[activeImg]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              )}
              {/* Sale badge */}
              {isOnSale && (
                <span className="absolute top-4 left-4 bg-[#c8a96e] text-black text-xs font-bold uppercase px-3 py-1">
                  Sale
                </span>
              )}
            </div>
            {thumbnails.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {thumbnails.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-square bg-[#141414] overflow-hidden transition-all duration-300 ${
                      activeImg === i
                        ? "ring-2 ring-[#c8a96e] ring-offset-2 ring-offset-[#0a0a0a]"
                        : "hover:opacity-80 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className={`md:col-span-1 lg:col-span-7 xl:col-span-6 flex flex-col lg:py-6 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl sm:text-3xl font-semibold text-[#c8a96e]">
                  {formatPrice(displayPrice)}
                </span>
                {isOnSale && (
                  <span className="text-lg sm:text-xl text-neutral-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-sm sm:prose-base text-neutral-400 mb-8">
              <p>{product.description}</p>
            </div>

            <div className="space-y-6 pt-8 border-t border-[#2a2a2a]">
              {/* Quantity + Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center justify-between border border-[#2a2a2a] h-14 px-4 sm:w-36 shrink-0 bg-[#141414]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product.id, quantity)}
                  disabled={addingProductId === product.id}
                  className="flex-1 h-14 bg-[#c8a96e] text-black font-medium text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#d4b87a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#c8a96e]/20"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingProductId === product.id
                    ? "Adding to Cart..."
                    : "Add to Cart"}
                </button>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`h-14 w-14 border flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isLiked 
                      ? "border-[#c8a96e] bg-[#c8a96e]/10" 
                      : "border-[#2a2a2a] hover:border-[#c8a96e]"
                  }`}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isLiked ? "fill-[#c8a96e] text-[#c8a96e]" : "text-neutral-400"}`} />
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Related Products */}
      {allProducts.filter((p) => p.id !== id).slice(0, 4).length > 0 && (
        <div className="max-w-[1280px] mx-auto px-5 mt-16 pt-12 border-t border-[#2a2a2a]">
          <h2 className="text-xl font-bold text-white mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {allProducts
              .filter((p) => p.id !== id)
              .slice(0, 4)
              .map((related, index) => (
                <Link
                  href={`/product/${related.id}`}
                  key={related.id}
                  className="group flex flex-col gap-3"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-[3/4] bg-[#141414] overflow-hidden">
                    <img
                      src={related.images?.[0] ?? ""}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#c8a96e] transition-colors">
                      {related.name}
                    </p>
                    <p className="text-sm font-semibold text-[#c8a96e]">
                      {formatPrice(related.sales_price ?? related.price)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
