"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
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
    const [isLoaded, setIsLoaded] = useState(false);

    const { addToCart, addingProductId } = useCartContext();
    const { formatPrice } = useStore();

    const normalizedQuery = initialQuery.trim();
    const { data: products = [], isLoading } = useProducts({
        category_id: categoryId || undefined,
        search_term: normalizedQuery || undefined,
    });

    const { data: categories = [] } = useCategories({ is_active: "true" });

    useEffect(() => {
        setIsLoaded(true);
    }, []);

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
                className={`flex items-center justify-between py-3 text-sm border-b border-[#2a2a2a] transition-colors text-left ${
                    activeCategory === "all"
                        ? "font-semibold text-[#c8a96e]"
                        : "text-neutral-400 hover:text-white"
                }`}
            >
                <span>All Products</span>
                {activeCategory === "all" && <span className="w-1.5 h-1.5 bg-[#c8a96e] shrink-0" />}
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id, cat.name)}
                    className={`flex items-center justify-between py-3 text-sm border-b border-[#2a2a2a] transition-colors text-left ${
                        activeCategory === cat.id
                            ? "font-semibold text-[#c8a96e]"
                            : "text-neutral-400 hover:text-white"
                    }`}
                >
                    <span>{cat.name}</span>
                    {activeCategory === cat.id && <span className="w-1.5 h-1.5 bg-[#c8a96e] shrink-0" />}
                </button>
            ))}
        </nav>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <div className="max-w-[1380px] mx-auto px-5 py-8">

                {/* ── Top bar: search + sort ── */}
                <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <form onSubmit={handleSearchSubmit} className="flex items-center border border-[#2a2a2a] bg-[#141414] overflow-hidden flex-1 max-w-lg focus-within:border-[#c8a96e]/50 transition-colors">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent text-white placeholder-neutral-500"
                        />
                        {query && (
                            <button type="button" onClick={() => { setQuery(""); clearFilters(); }} className="px-2 text-neutral-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <button type="submit" className="px-4 py-3 bg-[#c8a96e] hover:bg-[#d4b87a] flex items-center justify-center shrink-0 transition-colors">
                            <Search className="w-4 h-4 text-black" />
                        </button>
                    </form>

                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden flex items-center gap-2 border border-[#2a2a2a] px-4 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                    </button>

                    <div className="ml-auto flex items-center gap-2 shrink-0">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider hidden sm:block">Sort</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-xs font-bold uppercase tracking-wider bg-[#141414] border border-[#2a2a2a] text-neutral-300 px-4 py-3 outline-none focus:border-[#c8a96e] cursor-pointer hover:border-[#3a3a3a] transition-colors"
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
                    <div className={`flex items-center gap-2 mb-6 flex-wrap transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        {activeCategoryName && (
                            <span className="inline-flex items-center gap-1.5 bg-[#c8a96e] text-black text-[11px] font-bold uppercase tracking-wider px-3 py-1.5">
                                {activeCategoryName}
                                <button onClick={clearCategory} className="hover:opacity-70 transition-opacity">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {initialQuery && (
                            <span className="inline-flex items-center gap-1.5 bg-[#141414] text-neutral-300 border border-[#2a2a2a] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5">
                                &ldquo;{initialQuery}&rdquo;
                                <button onClick={clearFilters} className="hover:text-[#c8a96e] transition-colors">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <span className="text-xs text-neutral-500">{isLoading ? "" : `${sorted.length} results`}</span>
                    </div>
                )}

                <div className="flex gap-10">

                    {/* ── Sidebar (desktop) ── */}
                    <aside className={`hidden lg:block w-52 shrink-0 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <div className="sticky top-24">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c8a96e] mb-4">Categories</p>
                            <CategoryList />
                        </div>
                    </aside>

                    {/* ── Product grid ── */}
                    <div className="flex-1 min-w-0">
                        {!activeCategoryName && !initialQuery && (
                            <p className="text-xs text-neutral-500 mb-5">
                                {isLoading ? "" : <><span className="font-semibold text-white">{sorted.length}</span> products</>}
                            </p>
                        )}

                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[3/4] bg-[#141414] mb-3" />
                                        <div className="h-3 bg-[#141414] w-3/4 mb-2" />
                                        <div className="h-3 bg-[#141414] w-1/3" />
                                    </div>
                                ))}
                            </div>
                        ) : sorted.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                                {sorted.map((p, index) => (
                                    <div 
                                        key={p.id} 
                                        className={`group cursor-pointer transition-all duration-500`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="relative aspect-[3/4] bg-[#141414] overflow-hidden mb-3">
                                            <Link href={`/product/${p.id}`}>
                                                <img
                                                    src={p.images?.[0] ?? ""}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </Link>
                                            {p.sales_price && p.sales_price < p.price && (
                                                <span className="absolute top-2 left-2 bg-[#c8a96e] text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                                    SALE
                                                </span>
                                            )}
                                            <button
                                                onClick={() => addToCart(p.id)}
                                                disabled={addingProductId === p.id}
                                                className="absolute bottom-0 left-0 right-0 bg-[#c8a96e] text-black py-3 text-[11px] font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#d4b87a]"
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                {addingProductId === p.id ? "Adding..." : "Add to Cart"}
                                            </button>
                                        </div>
                                        <Link href={`/product/${p.id}`}>
                                            <h3 className="text-sm font-medium text-white line-clamp-1 mb-1 group-hover:text-[#c8a96e] transition-colors">{p.name}</h3>
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-[#c8a96e]">{formatPrice(p.sales_price ?? p.price)}</span>
                                            {p.sales_price && p.sales_price < p.price && (
                                                <span className="text-xs text-neutral-500 line-through">{formatPrice(p.price)}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center">
                                <div className="w-16 h-16 bg-[#141414] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-5">
                                    <Search className="w-6 h-6 text-neutral-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">No products found</h3>
                                <p className="text-sm text-neutral-500 mb-8">Try a different search or browse all products.</p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-[#c8a96e] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#d4b87a] transition-colors"
                                >
                                    Browse All
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Mobile sidebar drawer ── */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                        <aside className="relative ml-auto w-72 bg-[#0a0a0a] h-full flex flex-col shadow-2xl border-l border-[#2a2a2a] animate-slide-in-right">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c8a96e]">Categories</span>
                                <button onClick={() => setSidebarOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
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
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#2a2a2a] border-t-[#c8a96e] animate-spin" />
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
