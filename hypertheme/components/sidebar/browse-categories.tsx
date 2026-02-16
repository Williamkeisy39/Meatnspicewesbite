"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCategories } from "@/lib/hooks";

export function BrowseCategories() {
  const { data: categories = [], isLoading } = useCategories({ is_active: "true" });

  return (
    <div className="w-[280px] flex-shrink-0 bg-white border border-[#1D349A] rounded-md overflow-hidden self-start">
      <div className="bg-[#1D349A] text-white px-4 py-3 font-bold text-sm flex items-center gap-2">
        <span className="text-lg">☰</span> BROWSE CATEGORIES
      </div>
      <ul className="flex flex-col">
        {isLoading ? (
          <li className="px-4 py-3 text-sm text-gray-400 text-center">
            Loading...
          </li>
        ) : categories.length === 0 ? (
          <li className="px-4 py-3 text-sm text-gray-400 text-center">
            No categories
          </li>
        ) : (
          categories.map((category) => (
            <li
              key={category.id}
              className="border-b last:border-b-0 border-gray-100"
            >
              <Link
                href={`/search?q=${encodeURIComponent(category.name)}`}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1D349A] transition-colors group"
              >
                <span className="font-bold">{category.name}</span>
                <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#1D349A]" />
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
