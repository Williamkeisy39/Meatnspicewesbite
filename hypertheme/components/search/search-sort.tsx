"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function SearchSort() {
  const [sortBy, setSortBy] = useState("relevance");

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Sort by</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded px-3 py-1.5 pr-8 text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1D349A] cursor-pointer"
        >
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating">Rating</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
