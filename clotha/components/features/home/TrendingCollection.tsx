"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { usePopularProducts } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";

export function TrendingCollection() {
    const { data: products = [] } = usePopularProducts();
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
                {/* Header */}
                <div className={`flex items-center justify-between mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96e] mb-2 block">Trending</span>
                        <h2 className="font-bold text-2xl sm:text-3xl text-white font-display">Trending Collection</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center border border-[#2a2a2a] text-neutral-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300 hover:scale-105">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center border border-[#2a2a2a] text-neutral-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300 hover:scale-105">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {products.slice(0, 3).map((p, index) => (
                        <Link 
                            key={p.id} 
                            href={`/product/${p.id}`} 
                            className={`group block transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Image */}
                            <div className="w-full aspect-[4/5] overflow-hidden bg-[#141414] mb-4 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={p.images?.[0] ?? ""}
                                    alt={p.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {/* Quick view button */}
                                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="flex items-center justify-center gap-2 bg-white text-black py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#c8a96e] transition-colors">
                                        Quick View <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-white mb-1 group-hover:text-[#c8a96e] transition-colors duration-300">{p.name}</p>
                            <p className="text-xs font-medium text-neutral-500 flex items-center gap-1 group-hover:text-[#c8a96e] transition-colors">
                                Shop now <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
