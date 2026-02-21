"use client";

import { use, useState } from "react";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-gray-500">Product not found</p>
        <Link
          href="/"
          className="text-sm underline text-gray-400 hover:text-black"
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
    <div className="bg-white min-h-screen pb-8">
      <div className="max-w-[1280px] mx-auto px-5 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/search?q=" className="hover:text-black">
            Collection
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="md:col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            <div className="relative aspect-[3/4] md:aspect-[4/5] max-h-[500px] bg-gray-100 rounded-2xl overflow-hidden">
              {thumbnails[activeImg] && (
                <Image
                  src={thumbnails[activeImg]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            {thumbnails.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
                {thumbnails.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all duration-200 ${
                      activeImg === i
                        ? "ring-2 ring-black ring-offset-2"
                        : "hover:opacity-80"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="md:col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col lg:py-6">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  {formatPrice(displayPrice)}
                </span>
                {isOnSale && (
                  <span className="text-lg sm:text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-sm sm:prose-base text-gray-600 mb-8">
              <p>{product.description}</p>
            </div>

            <div className="space-y-6 pt-8 border-t border-gray-100">
              {/* Quantity + Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between border border-gray-200 rounded-md h-14 px-4 sm:w-32 shrink-0 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product.id, quantity)}
                  disabled={addingProductId === product.id}
                  className="flex-1 h-14 bg-black text-white font-medium text-sm sm:text-base rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingProductId === product.id
                    ? "Adding to Cart..."
                    : "Add to Cart"}
                </button>
                <button className="h-14 w-14 border border-gray-200 rounded-md flex items-center justify-center hover:border-black hover:bg-gray-50 transition-colors group shrink-0 bg-white">
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </button>
              </div>
            </div>

            {/* Features/Utility */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-gray-100">
              <div className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Free Delivery
                  </p>
                  <p className="text-sm text-gray-500">On orders over $300</p>
                </div>
              </div>
              <div className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Easy Returns</p>
                  <p className="text-sm text-gray-500">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Secure Payment
                  </p>
                  <p className="text-sm text-gray-500">100% secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {allProducts.filter((p) => p.id !== id).slice(0, 4).length > 0 && (
        <div className="max-w-[1280px] mx-auto px-5 mt-16 pt-12 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {allProducts
              .filter((p) => p.id !== id)
              .slice(0, 4)
              .map((related) => (
                <Link
                  href={`/product/${related.id}`}
                  key={related.id}
                  className="group flex flex-col gap-3"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={related.images?.[0] ?? ""}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {related.name}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
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
