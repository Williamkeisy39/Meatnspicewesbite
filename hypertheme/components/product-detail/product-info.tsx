"use client";

import { Users } from "lucide-react";
import { useStore } from "@/lib/providers/store-provider";

interface ProductInfoProps {
  title: string;
  price: number;
  originalPrice?: number;
  features: string[];
  inStock: boolean;
  viewCount?: number;
  sku?: string;
  categories?: string[];
  tags?: string[];
}

export function ProductInfo({
  title,
  price,
  originalPrice,
  features,
  inStock,
  viewCount = 0,
  sku,
  categories = [],
  tags = [],
}: ProductInfoProps) {
  const { formatPrice } = useStore();

  return (
    <div className="space-y-4">
      {/* Badge */}
      <div className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded">
        Ships from Local Vendor
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        {originalPrice && (
          <span className="text-lg text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(price)}
        </span>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Features:</h3>
        <ul className="space-y-1.5">
          {features.map((feature, index) => (
            <li
              key={index}
              className="text-sm text-gray-600 flex items-start gap-2"
            >
              <span className="text-[#1D349A] mt-1">›</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stock Status */}
      <div
        className={`text-sm font-semibold ${inStock ? "text-red-600" : "text-green-600"}`}
      >
        {inStock ? "Out of stock" : "In Stock"}
      </div>

      {/* View Count */}
      {viewCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{viewCount} people are viewing this right now</span>
        </div>
      )}

      {/* Metadata */}
      {(sku || categories.length > 0 || tags.length > 0) && (
        <div className="pt-4 border-t space-y-2 text-sm">
          {sku && (
            <div>
              <span className="font-semibold">SKU: </span>
              <span className="text-gray-600">{sku}</span>
            </div>
          )}
          {categories.length > 0 && (
            <div>
              <span className="font-semibold">Categories: </span>
              <span className="text-[#1D349A]">{categories.join(", ")}</span>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <span className="font-semibold">Tag: </span>
              <span className="text-[#1D349A]">{tags.join(", ")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
