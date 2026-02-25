"use client";

import Image from "next/image";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { Product, useCartStore } from "@/store/useCartStore";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  badge?: string;
  badgeColor?: "gold" | "red" | "green";
}

export function ProductCard({
  product,
  badge,
  badgeColor = "gold",
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [liked, setLiked] = useState(false);

  const badgeStyles = {
    gold: "bg-[#c8a96e] text-white",
    red: "bg-red-500 text-white",
    green: "bg-emerald-500 text-white",
  };

  return (
    <div className="group flex flex-col gap-3">
      {/* Image container */}
      <div className="relative aspect-3/4 overflow-hidden bg-neutral-100 rounded-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${badgeStyles[badgeColor]}`}
          >
            {badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setLiked((l) => !l)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-neutral-500"}`}
          />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => addItem(product)}
            className="w-full bg-black text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#c8a96e] transition-colors duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-1 space-y-1.5">
        {product.category && (
          <p className="text-[11px] text-[#c8a96e] font-semibold uppercase tracking-wider">
            {product.category}
          </p>
        )}
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-neutral-900 text-sm leading-snug line-clamp-2 flex-1 pr-2">
            {product.name}
          </h3>
          <span className="font-bold text-sm text-neutral-900 whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((s) => (
            <Star key={s} className="w-3 h-3 fill-[#c8a96e] text-[#c8a96e]" />
          ))}
          <Star className="w-3 h-3 fill-neutral-200 text-neutral-200" />
          <span className="text-[10px] text-neutral-400 ml-1">(42)</span>
        </div>
      </div>
    </div>
  );
}
