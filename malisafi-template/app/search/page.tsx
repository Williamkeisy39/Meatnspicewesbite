"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "../../components/features/products/ProductCard";
import { useProducts, useCategories } from "@/lib/hooks";

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("q") || "";
    const categoryId = searchParams.get("category") || "";
    const categoryName = searchParams.get("categoryName") || "";

    const [query, setQuery] = useState(initialQuery);
    const [sortBy, setSortBy] = useState("featured");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

    const { data: products = [], isLoading } = useProducts({
        category_id: categoryId || undefined,
        search_term: query || undefined,
        status: "active",
    });
    const { data: categories = [] } = useCategories({ is_active: "true" });

    const filteredProducts = useMemo(() => {
        let results = products;

        results = results.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        switch (sortBy) {
            case "price-asc":
                results = [...results].sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                results = [...results].sort((a, b) => b.price - a.price);
                break;
            case "name":
                results = [...results].sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        return results;
    }, [products, priceRange, sortBy]);

    // Handlers
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        router.push(`/search?${params.toString()}`);
    };

    const handleCategoryClick = (cat: { id: string; name: string }) => {
        const params = new URLSearchParams();
        params.set("category", cat.id);
        params.set("categoryName", cat.name);
        router.push(`/search?${params.toString()}`);
    };

    const clearFilters = () => {
        setQuery("");
        setPriceRange([0, 500]);
        setSortBy("featured");
        router.push("/search");
    };

    const activeCategory = categoryId || "All";

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-6 lg:px-12">

                {/* Header Section */}
                <div className="flex flex-col items-center mb-10 animate-slide-up">
                    <p className="text-xs font-bold tracking-luxury text-(--color-accent) mb-4 uppercase">
                        Search & Filter
                    </p>
                    <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-8 text-center">
                        Find Your Essentials
                    </h1>

                    {/* Large Search Input */}
                    <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="w-full bg-transparent border-b border-(--color-border) py-4 text-xl md:text-2xl font-serif placeholder:text-(--color-muted-foreground) focus:outline-none focus:border-(--color-accent) transition-colors text-center"
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-(--color-muted-foreground) hover:text-(--color-accent) transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            {/* Filters Toolbar - Static */}
            <div className="w-full border-b border-(--color-border) mb-10 animate-fade-in delay-100">
                <div className="container mx-auto px-6 lg:px-12 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        {/* Category Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                            <button
                                onClick={clearFilters}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 border ${activeCategory === "All"
                                    ? "bg-(--color-primary) text-white border-(--color-primary)"
                                    : "bg-transparent border-(--color-border) text-(--color-muted-foreground) hover:border-(--color-primary) hover:text-(--color-foreground)"
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick({ id: cat.id, name: cat.name })}
                                    className={`whitespace-nowrap px-5 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 border ${activeCategory === cat.id
                                        ? "bg-(--color-primary) text-white border-(--color-primary)"
                                        : "bg-transparent border-(--color-border) text-(--color-muted-foreground) hover:border-(--color-primary) hover:text-(--color-foreground)"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Right Side Controls */}
                        <div className="flex items-center gap-6 w-full md:w-auto justify-end">

                            {/* Price Toggle */}
                            <div className="relative group">
                                <button
                                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-(--color-accent) transition-colors py-2"
                                >
                                    <span>Price</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </button>

                                {/* Price Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-(--color-border) p-6 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="flex justify-between text-xs mb-4 font-medium">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={500}
                                        step={10}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-(--color-primary)"
                                    />
                                    <div className="mt-4 text-center">
                                        <p className="text-xs text-(--color-muted-foreground)">Max Price: <span className="text-foreground font-bold">${priceRange[1]}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-px h-4 bg-(--color-border)"></div>

                            {/* Sort Dropdown */}
                            <div className="relative flex items-center">
                                <span className="text-xs text-(--color-muted-foreground) mr-2 hidden sm:inline">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-(--color-accent) transition-colors pr-2 text-right appearance-none"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-asc">Low to High</option>
                                    <option value="price-desc">High to Low</option>
                                    <option value="name">Name A-Z</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12">
                {/* Results Info */}
                <div className="flex justify-between items-end mb-8 animate-fade-in delay-200">
                    <p className="text-sm font-serif text-(--color-muted-foreground)">
                        Showing <span className="text-foreground font-semibold">{filteredProducts.length}</span> results
                        {query && <span> for &ldquo;{query}&rdquo;</span>}
                    </p>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-32 animate-fade-in text-center">
                        <div className="w-24 h-24 rounded-full bg-(--color-secondary) flex items-center justify-center mb-6 text-(--color-muted-foreground)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-serif text-foreground mb-3">No matches found</h3>
                        <p className="text-(--color-muted-foreground) mb-8 max-w-md">
                            We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-8 py-3 bg-(--color-primary) text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-(--color-accent) transition-all duration-300"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-(--color-border) border-t-(--color-accent) rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-(--color-muted-foreground)">Loading Collection...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
