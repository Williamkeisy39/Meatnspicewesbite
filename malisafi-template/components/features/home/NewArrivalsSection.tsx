"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@valebytes/topduka-node";
import ProductCard from "../products/ProductCard";

interface NewArrivalsSectionProps {
    products: Product[];
}

export default function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
    return (
        <section className="bg-[#1C1C1C] text-white py-24 md:py-32 relative overflow-hidden">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-soft-light">
                <Image
                    src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1500&q=80"
                    fill
                    className="object-cover blur-3xl scale-110"
                    alt=""
                />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#C6A87C] mb-4 animate-fade-in delay-100">
                            Just Arrived
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] animate-slide-up delay-200">
                            The Latest <br /> Rituals
                        </h2>
                    </div>
                    <Link href="/search" className="group flex items-center gap-4 text-sm font-medium uppercase tracking-widest hover:text-[#C6A87C] transition-colors pb-2 border-b border-white/20 hover:border-[#C6A87C]">
                        <span>Shop All</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, i) => (
                        <div key={product.id} className="animate-fade-in-up hover-lift" style={{ animationDelay: `${i * 150}ms` }}>
                            <ProductCard product={product} theme="dark" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
