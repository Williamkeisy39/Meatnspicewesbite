"use client";

import Link from "next/link";
import { useCategories } from "@/lib/hooks";
import { Truck, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function NavMenu() {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useCategories({ is_active: "true" });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAllCategories(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show All Categories dropdown with all categories
  const hasCategories = categories.length > 0;

  return (
    <nav className="hidden md:block bg-white border-b border-gray-100">
      <div className="container mx-auto px-32">
        <div className="flex items-center gap-8 py-3">
          {/* All Categories Dropdown - First */}
          {hasCategories && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#1D349A] transition-colors whitespace-nowrap"
              >
                All Categories
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showAllCategories ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showAllCategories && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/search?q=${encodeURIComponent(category.name)}`}
                      onClick={() => setShowAllCategories(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1D349A] transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Next 6 Categories */}
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/search?q=${encodeURIComponent(category.name)}`}
              className="text-sm font-medium text-slate-700 hover:text-[#1D349A] transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}

          {/* Track Order */}
          <Link
            href="/orders/track"
            className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#1D349A] transition-colors ml-auto"
          >
            <Truck className="w-4 h-4" />
            Track Order
          </Link>

          {/* On Sale - Highlighted */}
          <Link
            href="/search?q=sale"
            className="flex items-center gap-1 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            On Sale
            <span className="flex gap-0.5">
              <span className="text-red-400">+</span>
              <span className="text-red-400">+</span>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
