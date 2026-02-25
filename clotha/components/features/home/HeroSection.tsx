"use client";

import Link from "next/link";
import { useCategories } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    const { data: categories = [] } = useCategories();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section className="w-full bg-[#0a0a0a]">
            <div className="max-w-[1280px] mx-auto px-5 flex items-stretch w-full gap-0">
                {/* Sidebar */}
                <aside className={`hidden lg:flex flex-col shrink-0 bg-[#141414] border-r border-[#2a2a2a] w-[210px] transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <div className="p-4 border-b border-[#2a2a2a]">
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#c8a96e]">Categories</span>
                    </div>
                    {categories.slice(0, 8).map((cat, index) => (
                        <Link
                            key={cat.id}
                            href={`/search?q=${encodeURIComponent(cat.name)}`}
                            className="group flex items-center justify-between px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-[#1a1a1a] transition-all duration-300 border-b border-[#2a2a2a]/50"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="group-hover:translate-x-1 transition-transform duration-300">{cat.name}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[#c8a96e]" />
                        </Link>
                    ))}
                    <Link 
                        href="/search?q=" 
                        className="mt-auto p-4 text-xs font-medium text-[#c8a96e] hover:text-[#d4b87a] transition-colors flex items-center gap-2"
                    >
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </aside>

                {/* Hero banner */}
                <div className={`flex-1 relative overflow-hidden flex items-center bg-[#141414] min-h-[380px] sm:min-h-[420px] md:min-h-[480px] transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Background image with overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-right bg-no-repeat transition-transform duration-1000 hover:scale-105"
                        style={{
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1000&q=80")',
                            backgroundPosition: "right center",
                        }}
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
                    
                    {/* Animated accent line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-[#c8a96e] to-transparent opacity-50" />

                    {/* Content */}
                    <div className={`relative z-10 px-6 sm:px-10 py-12 max-w-lg transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96e] mb-4 animate-pulse">
                            New Collection
                        </p>
                        <h1 className="font-display font-bold leading-tight text-white mb-4 text-4xl sm:text-5xl md:text-6xl">
                            Elevate Your<br />
                            <span className="gradient-text">Style</span>
                        </h1>
                        <p className="text-sm text-neutral-400 mb-8 max-w-xs leading-relaxed">
                            Discover curated fashion pieces that define modern elegance. Premium quality for the discerning individual.
                        </p>
                        <Link
                            href="/search?q="
                            className="group inline-flex items-center gap-3 text-sm font-bold border-2 border-[#c8a96e] text-[#c8a96e] px-8 py-4 uppercase tracking-wider hover:bg-[#c8a96e] hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-[#c8a96e]/20"
                        >
                            Shop Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
