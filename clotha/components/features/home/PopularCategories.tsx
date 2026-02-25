"use client";

import Link from "next/link";
import { ArrowRight, Grid3X3 } from "lucide-react";
import { useCategories } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";

function CatItem({ name, image, href, index }: { name: string; image: string; href: string; index: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), index * 100);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [index]);

    return (
        <Link 
            ref={ref}
            href={href} 
            className={`group relative flex items-end overflow-hidden aspect-square transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            {/* Background Image */}
            <img 
                src={image} 
                alt={name} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500" />
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Text */}
            <div className="relative z-10 p-4 sm:p-5 w-full transform group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white text-base sm:text-lg font-semibold flex items-center gap-2">
                    {name}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </span>
            </div>
        </Link>
    );
}

function ShowMoreButton({ remaining, index }: { remaining: number; index: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), index * 100);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [index]);

    return (
        <Link 
            ref={ref}
            href="/search?q="
            className={`group relative flex flex-col items-center justify-center gap-2 overflow-hidden aspect-square border border-[#2a2a2a] bg-[#141414] hover:border-[#c8a96e] hover:bg-[#1a1a1a] transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            <div className="relative">
                <Grid3X3 className="w-10 h-10 sm:w-12 sm:h-12 text-[#c8a96e] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-[#c8a96e]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="text-center">
                <span className="text-white text-base sm:text-lg font-semibold block group-hover:text-[#c8a96e] transition-colors">
                    Show More
                </span>
                <span className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">
                    +{remaining} categories
                </span>
            </div>
        </Link>
    );
}

export function PopularCategories() {
    const { data: categories = [] } = useCategories();
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsHeaderVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    // Show 7 categories + 1 "Show More" button = 8 items (4x2 grid)
    const displayCount = 7;
    const visibleCategories = categories.slice(0, displayCount);
    const remainingCount = Math.max(0, categories.length - displayCount);
    const hasMore = categories.length > displayCount;

    return (
        <section className="py-12 sm:py-16 border-b border-[#2a2a2a] bg-[#0a0a0a]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-5">
                {/* Header */}
                <div 
                    ref={headerRef}
                    className={`flex items-center justify-between mb-8 transition-all duration-700 ${
                        isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96e] mb-2 block">Browse</span>
                        <h2 className="font-bold text-2xl sm:text-3xl text-white font-display">Popular Categories</h2>
                    </div>
                    <Link
                        href="/search?q="
                        className="text-sm font-semibold flex items-center gap-1.5 text-neutral-400 hover:text-[#c8a96e] transition-all duration-300 group"
                    >
                        Shop all 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* 4x2 Grid - 8 items total */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                    {visibleCategories.map((c, index) => (
                        <CatItem
                            key={c.id}
                            name={c.name}
                            image={(c as any).placeholder_value ?? ""}
                            href={`/search?q=${encodeURIComponent(c.name)}`}
                            index={index}
                        />
                    ))}
                    
                    {/* Show More Button - only if there are more categories */}
                    {hasMore && (
                        <ShowMoreButton remaining={remainingCount} index={visibleCategories.length} />
                    )}
                </div>
            </div>
        </section>
    );
}
