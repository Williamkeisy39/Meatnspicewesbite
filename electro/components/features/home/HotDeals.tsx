"use client";

import { ProductCard } from "../product/ProductCard";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { useDiscountedProducts } from "@/lib/hooks";

export function HotDeals() {
    const { data: deals = [] } = useDiscountedProducts();
    const items = deals.slice(0, 4);

    if (items.length === 0) return null;

    return (
        <section className="container mb-12">
            <div className="bg-white border border-gray-100 rounded-3xl px-6 py-8 shadow-xl relative overflow-hidden group">
                <div className="flex flex-col xl:flex-row gap-8">
                    <div className="xl:w-1/4 flex flex-col justify-between border-r border-gray-100 pr-0 xl:pr-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-red-50 text-red-600 p-2 rounded-xl">
                                    <Flame size={24} fill="currentColor" className="animate-pulse" />
                                </div>
                                <h3 className="text-3xl font-black text-black uppercase tracking-tight">Flash Sale</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">
                                Grab these premium tech items at discounted prices. Limited stock available.
                            </p>
                        </div>
                        <Link href="/search" className="w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                            View All Deals <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="xl:w-3/4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {items.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
