"use client";

import Link from "next/link";
import { Star, ShoppingCart, Plus, Minus, Loader2, Trash2 } from "lucide-react";
import { useStore } from "@/lib/providers/store-provider";
import { useCartContext } from "@/lib/providers/cart-provider";

interface ProductCardProps {
  id: string;
  image: string;
  brand: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
}

export function ProductCard({
  id,
  image,
  brand,
  title,
  price,
  originalPrice,
  rating = 5,
}: ProductCardProps) {
  const { formatPrice } = useStore();
  const { cart, addToCart, updateQuantity, addingProductId } = useCartContext();

  // Check if item is in cart
  const cartItem = cart?.items?.find((item) => item.product_id === id);
  const inCart = !!cartItem;
  const cartQuantity = cartItem?.quantity ?? 0;

  const isAdding = addingProductId === id;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(id, 1);
  };

  const handleIncrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      await updateQuantity(id, cartQuantity + 1);
    }
  };

  const handleDecrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartQuantity > 1) {
      await updateQuantity(id, cartQuantity - 1);
    } else if (cartItem && cartQuantity === 1) {
      await updateQuantity(id, 0); // Remove from cart
    }
  };

  return (
    <div className="group bg-white p-2 rounded-md border border-grey-300 hover:border-gray-100 relative block">
      {/* Image - Clickable */}
      <Link href={`/${id}`} className="block">
        <div className="relative aspect-square mb-2 bg-gray-50 flex items-center justify-center rounded-sm overflow-hidden group-hover:opacity-90 transition-opacity">
          {image && image !== "/placeholder" ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-gray-300">
              <span className="text-[10px]">img</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-1">
        <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
          {brand}
        </span>
        <Link href={`/${id}`}>
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-[#1D349A] transition-colors h-10 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
            />
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-1">
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="font-bold text-gray-900 text-base">
            {formatPrice(price)}
          </span>
        </div>

        {/* Cart Controls */}
        <div className="pt-2 border-t border-gray-100 mt-2">
          {isAdding ? (
            <div className="flex items-center justify-center gap-2 py-2 bg-[#1D349A]/10 rounded-md">
              <Loader2 className="w-4 h-4 animate-spin text-[#1D349A]" />
              <span className="text-sm font-medium text-[#1D349A]">
                Adding...
              </span>
            </div>
          ) : inCart ? (
            <div className="flex items-center gap-2">
              {/* Quantity Controls - Only show when in cart */}
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden flex-1">
                <button
                  onClick={handleDecrease}
                  className="px-2 py-1.5 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  {cartQuantity === 1 ? (
                    <Trash2 className="w-4 h-4 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                </button>
                <span className="flex-1 text-center text-sm font-medium text-gray-900 px-2">
                  {cartQuantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="px-2 py-1.5 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                In Cart
              </span>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full px-3 py-1.5 bg-[#1D349A] text-white rounded-md hover:bg-[#1D349A]/90 transition-colors flex items-center justify-center gap-1.5 font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
