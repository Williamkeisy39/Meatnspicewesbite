"use client";

import { useState } from "react";
import { useCategories } from "@/lib/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/providers/store-provider";

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([0, 652700]);
  const { data: categories = [], isLoading } = useCategories({ is_active: "true" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useStore();

  const handleCategoryClick = (category: { id: string; name: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category.id);
    params.set("categoryName", category.name);
    params.delete("q");
    router.push(`/search?${params.toString()}`);
  };

  const currentQuery = searchParams.get("q") || "";

  return (
    <div className="w-64 bg-white border border-gray-200 rounded-md p-4 space-y-6">
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <h3 className="font-bold text-gray-900">Filters</h3>
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Price</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="652700"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D349A]"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>— {formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 pb-2">Product Categories</h4>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-sm text-gray-400 text-center py-2">
              Loading...
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => handleCategoryClick({ id: category.id, name: category.name })}
                  className={`w-full flex items-center py-1.5 px-2 text-sm rounded transition-colors ${
                    searchParams.get("category") === category.id
                      ? "bg-[#1D349A]/10 text-[#1D349A] font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{category.name}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
