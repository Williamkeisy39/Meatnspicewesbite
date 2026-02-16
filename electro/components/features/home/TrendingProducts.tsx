"use client";

import { ProductCard } from "../product/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePopularProducts } from "@/lib/hooks";

export function TrendingProducts() {
    const { data: popular = [] } = usePopularProducts();
    const items = popular.slice(0, 5);

    if (items.length === 0) return null;

    return (
        <section className="container mb-10">
            <div className="bg-primary px-8 py-10 relative overflow-hidden shadow-elevated">
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-light/20 blur-[100px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-3 shadow-lg">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">Weekly Highlights</h3>
                                <p className="text-white/50 text-sm mt-1 font-medium">Curated picks trending this week</p>
                            </div>
                        </div>
                        <Link href="/search" className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 border border-white/10 transition-all">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
