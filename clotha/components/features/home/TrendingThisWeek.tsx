"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useBestSellingProducts } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";

export function TrendingThisWeek() {
    const { addToCart, addingProductId } = useCartContext();
    const { formatPrice } = useStore();
    const { data: products = [] } = useBestSellingProducts();
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
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 border-b border-[#2a2a2a] bg-[#0a0a0a]">
            <div className="max-w-[1280px] mx-auto px-5">
                <div className="flex gap-6">
                    {/* Editorial panel */}
                    <div className={`hidden lg:flex flex-col justify-between p-8 shrink-0 w-[260px] bg-[#141414] relative overflow-hidden border border-[#2a2a2a] transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                        <div className="absolute inset-0 bg-cover bg-center opacity-10"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=70")' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#141414]/50 to-[#141414]" />
                        
                        <div className="relative z-10">
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96e] mb-4 block">Best Sellers</span>
                            <h2 className="font-bold text-3xl leading-tight text-white mb-3 font-display">
                                Trending This Week
                            </h2>
                            <p className="text-sm text-neutral-500">Curated selection of our most popular items</p>
                        </div>
                        <div className="relative z-10 mt-8">
                            <Link
                                href="/search?q="
                                className="group inline-flex items-center gap-2 border-2 border-[#c8a96e] text-[#c8a96e] text-sm font-bold uppercase px-6 py-3 hover:bg-[#c8a96e] hover:text-black transition-all duration-300"
                            >
                                Shop Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="flex-1 relative">
                        {/* Section header for mobile */}
                        <div className="lg:hidden mb-6">
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96e] mb-2 block">Best Sellers</span>
                            <h2 className="font-bold text-2xl text-white font-display">Trending This Week</h2>
                        </div>

                        <button className="hidden md:flex absolute -left-3 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-[#141414] border border-[#2a2a2a] items-center justify-center text-neutral-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300 hover:scale-105">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="hidden md:flex absolute -right-3 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-[#141414] border border-[#2a2a2a] items-center justify-center text-neutral-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300 hover:scale-105">
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                            {products.slice(0, 4).map((p, index) => (
                                <div 
                                    key={p.id} 
                                    className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <Link href={`/product/${p.id}`} className="block w-full aspect-[3/4] overflow-hidden bg-[#141414] mb-3 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={p.images?.[0] ?? ""}
                                            alt={p.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </Link>
                                    <p className="text-xs font-medium leading-snug text-white mb-1 line-clamp-2 group-hover:text-[#c8a96e] transition-colors">
                                        {p.name}
                                    </p>
                                    <p className="text-sm font-bold text-[#c8a96e] mb-3">
                                        {formatPrice(p.sales_price ?? p.price)}
                                    </p>
                                    <button
                                        onClick={() => addToCart(p.id)}
                                        disabled={addingProductId === p.id}
                                        className="w-full text-xs font-semibold uppercase tracking-wider py-3 border border-[#2a2a2a] text-neutral-300 hover:bg-[#c8a96e] hover:text-black hover:border-[#c8a96e] transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:shadow-[#c8a96e]/20"
                                    >
                                        {addingProductId === p.id ? "Adding..." : "Add to Cart"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
