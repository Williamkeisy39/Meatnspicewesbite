"use client";

import Link from "next/link";
import { useCategories } from "@/lib/hooks";

export function HeroSection() {
    const { data: categories = [] } = useCategories();

    return (
        <section className="w-full bg-gray-50 min-h-[340px] flex">
            <div className="max-w-[1280px] mx-auto px-5 flex items-stretch w-full gap-0">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col shrink-0 bg-white border-r border-gray-200 w-[210px]">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/search?q=${encodeURIComponent(cat.name)}`}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-800 hover:text-[#cc1111] hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </aside>

                {/* Hero banner */}
                <div className="flex-1 relative overflow-hidden flex items-center bg-[#f0eeeb]">
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-right bg-no-repeat"
                        style={{
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1000&q=80")',
                            backgroundPosition: "right center",
                        }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f0eeeb] via-[#f0eeeb]/80 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 px-10 py-12 max-w-lg">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                            New Arrivals
                        </p>
                        <h1 className="font-extrabold leading-tight text-gray-900 mb-3 text-4xl sm:text-5xl">
                            The Purl Knit<br />Cardigan
                        </h1>
                        <p className="text-sm text-gray-500 mb-6 max-w-xs">
                            Here is your chance to upgrade your wardrobe with a variation.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block text-sm font-bold border-2 border-gray-900 text-gray-900 px-7 py-3 uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all"
                        >
                            Shop the Look
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
