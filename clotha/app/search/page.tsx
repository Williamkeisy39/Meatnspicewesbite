"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShoppingCart, Search, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useProducts, useCategories } from "@/lib/hooks";

function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("q") || "";
    const categoryId = searchParams.get("category") || "";

    const [query, setQuery] = useState(initialQuery);
    const [sortBy, setSortBy] = useState("featured");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { addToCart, addingProductId } = useCartContext();
    const { formatPrice } = useStore();

    const normalizedQuery = initialQuery.trim();
    const { data: products = [], isLoading } = useProducts({
        category_id: categoryId || undefined,
        search_term: normalizedQuery || undefined,
    });

    const { data: categories = [] } = useCategories({ is_active: "true" });

    const sorted = useMemo(() => {
        const list = [...products];
        switch (sortBy) {
            case "price-asc": return list.sort((a, b) => a.price - b.price);
            case "price-desc": return list.sort((a, b) => b.price - a.price);
            case "name": return list.sort((a, b) => a.name.localeCompare(b.name));
            default: return list;
        }
    }, [products, sortBy]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (categoryId) params.set("category", categoryId);
        const nextQuery = params.toString();
        router.push(nextQuery ? `/search?${nextQuery}` : "/search");
    };

    const handleCategoryClick = (id: string, name: string) => {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        params.set("category", id);
        params.set("categoryName", name);
        router.push(`/search?${params.toString()}`);
        setSidebarOpen(false);
    };

    const clearCategory = () => {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        const qs = params.toString();
        router.push(qs ? `/search?${qs}` : "/search");
        setSidebarOpen(false);
    };

    const clearFilters = () => {
        setQuery("");
        setSortBy("featured");
        router.push("/search");
    };

    const activeCategory = categoryId || "all";
    const activeCategoryName = searchParams.get("categoryName") || "";

    const CategoryList = () => (
        <nav className="flex flex-col">
            <button
                onClick={clearCategory}
                className={`flex items-center justify-between py-2.5 text-sm border-b border-gray-100 transition-colors text-left ${
                    activeCategory === "all"
                        ? "font-bold text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                }`}
            >
                <span>All Products</span>
                {activeCategory === "all" && <span className="w-1.5 h-1.5 bg-black shrink-0" />}
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id, cat.name)}
                    className={`flex items-center justify-between py-2.5 text-sm border-b border-gray-100 transition-colors text-left ${
                        activeCategory === cat.id
                            ? "font-bold text-gray-900"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <span>{cat.name}</span>
                    {activeCategory === cat.id && <span className="w-1.5 h-1.5 bg-black shrink-0" />}
                </button>
            ))}
        </nav>
    );

    return (
        <div className="max-w-[1380px] mx-auto px-5 py-8">

            {/* ── Top bar: search + sort ── */}
            <div className="flex items-center gap-3 mb-8">
                <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-200 overflow-hidden flex-1 max-w-lg">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-900"
                    />
                    {query && (
                        <button type="button" onClick={() => { setQuery(""); clearFilters(); }} className="px-2 text-gray-400 hover:text-black">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button type="submit" className="px-4 py-2.5 bg-black flex items-center justify-center shrink-0">
                        <Search className="w-3.5 h-3.5 text-white" />
                    </button>
                </form>

                {/* Mobile filter toggle */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-2 border border-gray-200 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-700 hover:border-black hover:text-black transition-colors"
                >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filter
                </button>

                <div className="ml-auto flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 uppercase tracking-wider hidden sm:block">Sort</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 px-3 py-2.5 outline-none focus:border-black cursor-pointer"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name">Name A–Z</option>
                    </select>
                </div>
            </div>

            {/* ── Active filter chips ── */}
            {(activeCategoryName || initialQuery) && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    {activeCategoryName && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1">
                            {activeCategoryName}
                            <button onClick={clearCategory} className="hover:opacity-70 transition-opacity">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {initialQuery && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1">
                            &ldquo;{initialQuery}&rdquo;
                            <button onClick={clearFilters} className="hover:opacity-70 transition-opacity">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    <span className="text-xs text-gray-400">{isLoading ? "" : `${sorted.length} results`}</span>
                </div>
            )}

            <div className="flex gap-10">

                {/* ── Sidebar (desktop) ── */}
                <aside className="hidden lg:block w-52 shrink-0">
                    <div className="sticky top-24">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">Categories</p>
                        <CategoryList />
                    </div>
                </aside>

                {/* ── Product grid ── */}
                <div className="flex-1 min-w-0">
                    {!activeCategoryName && !initialQuery && (
                        <p className="text-xs text-gray-400 mb-5">
                            {isLoading ? "" : <><span className="font-semibold text-gray-700">{sorted.length}</span> products</>}
                        </p>
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[3/4] bg-gray-100 mb-3" />
                                    <div className="h-3 bg-gray-100 w-3/4 mb-2" />
                                    <div className="h-3 bg-gray-100 w-1/3" />
                                </div>
                            ))}
                        </div>
                    ) : sorted.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                            {sorted.map((p) => (
                                <div key={p.id} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                                        <Link href={`/product/${p.id}`}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={p.images?.[0] ?? ""}
                                                alt={p.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </Link>
                                        {p.sales_price && p.sales_price < p.price && (
                                            <span className="absolute top-2 left-2 bg-[#cc1111] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                                SALE
                                            </span>
                                        )}
                                        <button
                                            onClick={() => addToCart(p.id)}
                                            disabled={addingProductId === p.id}
                                            className="absolute bottom-0 left-0 right-0 bg-black text-white py-2.5 text-[11px] font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            {addingProductId === p.id ? "Adding..." : "Add to Cart"}
                                        </button>
                                    </div>
                                    <Link href={`/product/${p.id}`}>
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:underline">{p.name}</h3>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#cc1111]">{formatPrice(p.sales_price ?? p.price)}</span>
                                        {p.sales_price && p.sales_price < p.price && (
                                            <span className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-14 h-14 bg-gray-100 flex items-center justify-center mx-auto mb-5">
                                <Search className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                            <p className="text-sm text-gray-500 mb-8">Try a different search or browse all products.</p>
                            <button
                                onClick={clearFilters}
                                className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Browse All
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Mobile sidebar drawer ── */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative ml-auto w-72 bg-white h-full flex flex-col shadow-xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900">Categories</span>
                            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            <CategoryList />
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-black animate-spin" />
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
