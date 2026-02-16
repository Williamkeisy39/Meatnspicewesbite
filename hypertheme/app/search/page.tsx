"use client";

import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchSort } from "@/components/search/search-sort";
import { ProductCard } from "@/components/products/product-card";
import { useProducts } from "@/lib/hooks";
import type { Product } from "@valebytes/topduka-node";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Filter,
  X,
  Search,
  PackageOpen,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

function mapProduct(p: Product) {
  return {
    id: p.id,
    image: p.images?.[0] || "",
    brand: p.categories?.[0] || "",
    title: p.name,
    price: p.sales_price || p.price,
    originalPrice: p.sales_price ? p.price : undefined,
    rating: p.rating || 5,
  };
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("category") || "";
  const categoryName = searchParams.get("categoryName") || "";
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: results = [], isLoading } = useProducts({
    category_id: categoryId || undefined,
    search_term: query || undefined,
    status: "active",
  });

  const mapped = results.map(mapProduct);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Mall", href: "/search?q=" },
    {
      label: categoryId
        ? categoryName || "Category"
        : query
          ? `Search results for "${query}"`
          : "All Products",
      href: `/search?${searchParams.toString()}`,
    },
  ];

  const clearFilters = () => {
    router.push("/search?q=");
  };

  const hasActiveFilters = query || categoryId;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
          <Breadcrumb items={breadcrumbs} />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {categoryId ? (
                  categoryName || "Category"
                ) : query ? (
                  <>Search results for &quot;{query}&quot;</>
                ) : (
                  "All Products"
                )}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isLoading ? (
                  "Loading products..."
                ) : (
                  <>
                    {mapped.length} product{mapped.length !== 1 ? "s" : ""}{" "}
                    found
                  </>
                )}
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#1D349A] rounded-full" />
              )}
            </button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {query && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1D349A]/10 text-[#1D349A] text-sm rounded-full">
                  <Search className="w-3 h-3" />
                  &quot;{query}&quot;
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.delete("q");
                      router.push(`/search?${params.toString()}`);
                    }}
                    className="hover:bg-[#1D349A]/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryId && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1D349A]/10 text-[#1D349A] text-sm rounded-full">
                  <Filter className="w-3 h-3" />
                  {categoryName || "Category"}
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.delete("category");
                      params.delete("categoryName");
                      router.push(`/search?${params.toString()}`);
                    }}
                    className="hover:bg-[#1D349A]/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-[#1D349A] underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filters Drawer */}
          {showMobileFilters && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="absolute right-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <SearchFilters />
              </div>
            </div>
          )}

          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <SearchFilters />
          </aside>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-500 hidden sm:block">
                Showing {mapped.length} result{mapped.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500">Sort by:</span>
                <SearchSort />
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : mapped.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <PackageOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                  {query
                    ? `We couldn&apos;t find any products matching &quot;${query}&quot;. Try a different search term or browse our categories.`
                    : "No products available in this category. Check out our other categories."}
                </p>
                <div className="flex gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                  <Link
                    href="/"
                    className="px-4 py-2 bg-[#1D349A] text-white rounded-lg text-sm font-medium hover:bg-[#1D349A]/90 transition-colors"
                  >
                    Browse all products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mapped.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
