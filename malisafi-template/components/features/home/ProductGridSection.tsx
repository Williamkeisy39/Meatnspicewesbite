"use client";

import Image from "next/image";
import Link from "next/link";
import ProductCard from "../products/ProductCard";
import type { Product } from "@valebytes/topduka-node";

// Minimal Product Grid - just whitespace and products
interface ProductGridSectionProps {
    title: string;
    subtitle?: string;
    products: Product[];
}

export default function ProductGridSection({ title, subtitle, products }: ProductGridSectionProps) {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    {subtitle && (
                        <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#C6A87C] mb-4">
                            {subtitle}
                        </span>
                    )}
                    <h2 className="text-4xl md:text-5xl font-serif text-black leading-tight">
                        {title}
                    </h2>
                    <div className="w-16 h-px bg-black/10 mx-auto mt-8" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product, i) => (
                        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/search" className="inline-block border-b border-black pb-1 text-xs font-bold uppercase tracking-widest hover:text-[#C6A87C] hover:border-[#C6A87C] transition-colors">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}
