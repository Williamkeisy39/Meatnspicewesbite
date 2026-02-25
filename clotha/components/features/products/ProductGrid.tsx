"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Heart } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useState, useEffect, useRef } from "react";
import type { Product } from "@valebytes/topduka-node";

interface ProductGridProps {
    products: Product[];
    title: string;
    subtitle?: string;
    viewAllHref?: string;
    columns?: 2 | 3 | 4 | 6;
    rows?: number;
    showViewAll?: boolean;
}

export function ProductGrid({
    products,
    title,
    subtitle,
    viewAllHref = "/search?q=",
    columns = 4,
    rows = 2,
    showViewAll = true,
}: ProductGridProps) {
    const { addToCart, addingProductId } = useCartContext();
    const { formatPrice } = useStore();
    const [liked, setLiked] = useState<Record<string, boolean>>({});
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.05 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const maxItems = columns * rows;
    const displayProducts = products.slice(0, maxItems);

    const getGridCols = () => {
        switch (columns) {
            case 2: return "grid-cols-2";
            case 3: return "grid-cols-2 sm:grid-cols-3";
            case 4: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
            case 6: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
            default: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
        }
    };

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 border-b border-[#2a2a2a] bg-[#0a0a0a]">
            <div className="max-w-[1280px] mx-auto px-5">
                {/* Header */}
                <div className={`flex items-center justify-between mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div>
                        {subtitle && (
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96e] mb-2 block">{subtitle}</span>
                        )}
                        <h2 className="font-bold text-2xl sm:text-3xl text-white font-display">{title}</h2>
                    </div>
                    {showViewAll && (
                        <Link
                            href={viewAllHref}
                            className="text-sm font-semibold flex items-center gap-1.5 text-neutral-400 hover:text-[#c8a96e] transition-all duration-300 group"
                        >
                            View all 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {/* Grid */}
                <div className={`grid ${getGridCols()} gap-5`}>
                    {displayProducts.map((p, index) => (
                        <div 
                            key={p.id} 
                            className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            {/* Sale badge */}
                            {p.sales_price && p.sales_price < p.price && (
                                <span className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase px-2 py-1 bg-[#c8a96e] text-black">
                                    SALE
                                </span>
                            )}

                            {/* Wishlist */}
                            <button
                                onClick={() => setLiked((l) => ({ ...l, [p.id]: !l[p.id] }))}
                                className="absolute top-2 right-2 z-10 w-8 h-8 bg-[#0a0a0a]/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-[#2a2a2a] hover:border-[#c8a96e] hover:bg-[#141414]"
                            >
                                <Heart
                                    className={`w-4 h-4 transition-colors ${liked[p.id] ? "fill-[#c8a96e] text-[#c8a96e]" : "text-neutral-400"}`}
                                />
                            </button>

                            {/* Image */}
                            <Link href={`/product/${p.id}`} className="block w-full aspect-[3/4] overflow-hidden bg-[#141414] mb-3 relative">
                                <img
                                    src={p.images?.[0] ?? ""}
                                    alt={p.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Link>

                            {/* Info */}
                            <p className="text-xs font-medium leading-snug text-white line-clamp-2 mb-1.5 group-hover:text-[#c8a96e] transition-colors">{p.name}</p>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-bold text-[#c8a96e]">{formatPrice(p.sales_price ?? p.price)}</span>
                                {p.sales_price && p.sales_price < p.price && (
                                    <span className="text-xs line-through text-neutral-500">{formatPrice(p.price)}</span>
                                )}
                            </div>

                            {/* Add to cart — appears on hover */}
                            <button
                                onClick={() => addToCart(p.id)}
                                disabled={addingProductId === p.id}
                                className="w-full text-[11px] font-bold uppercase tracking-wider py-2.5 border border-[#2a2a2a] text-neutral-300 flex items-center justify-center gap-1.5 hover:bg-[#c8a96e] hover:text-black hover:border-[#c8a96e] transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 hover:shadow-lg hover:shadow-[#c8a96e]/20"
                            >
                                <ShoppingCart className="w-3 h-3" />
                                {addingProductId === p.id ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
