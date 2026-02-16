"use client";

import { ProductCard } from "../../components/features/product/ProductCard";
import { SidebarBestSellers } from "../../components/features/product/ProductSidebar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProducts, useCategories } from "@/lib/hooks";
import { Suspense } from "react";

function SearchContent() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category") || undefined;
    const categoryName = searchParams.get("categoryName") || undefined;
    const query = searchParams.get("q") || undefined;

    const { data: products = [], isLoading } = useProducts({
        status: "active",
        skip: 0,
        category_id: categoryId,
        search_term: query,
    });
    const { data: categories = [] } = useCategories({ is_active: "true" });

    return (
        <div className="container py-8">
            <div className="text-xs text-gray-500 mb-6 flex gap-2">
                <Link href="/" className="hover:text-secondary">Home</Link> / <span className="text-black font-bold">{categoryName || query || "All Products"}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-sm uppercase mb-4 border-b border-gray-100 pb-2">Categories</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link
                                    href="/search"
                                    className={`block py-1 hover:text-secondary transition-colors font-medium ${!categoryId ? "text-secondary" : ""}`}
                                >
                                    All Products
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                                        className={`block py-1 hover:text-secondary transition-colors ${categoryId === cat.id ? "text-secondary font-bold" : ""}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <SidebarBestSellers />
                </aside>

                {/* Results Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-gray-200 rounded-2xl p-3 mb-6 flex items-center justify-between shadow-sm">
                        <span className="text-sm text-gray-500">
                            {isLoading ? "Loading..." : `Showing ${products.length} results`}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-3 border-secondary border-t-transparent animate-spin" style={{ borderRadius: "50%" }} />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-lg font-bold">No products found</p>
                            <p className="text-sm mt-2">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container py-20 text-center text-gray-400">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
