"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePopularProducts } from "@/lib/hooks";

export function TrendingCollection() {
    const { data: products = [] } = usePopularProducts();

    return (
        <section className="py-10 border-b border-gray-200">
            <div className="max-w-[1280px] mx-auto px-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg text-gray-900 font-display">Trending Collection</h2>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-gray-900 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-gray-900 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {products.slice(0, 3).map((p) => (
                        <Link key={p.id} href={`/product/${p.id}`} className="group block">
                            {/* Image */}
                            <div className="w-full aspect-[4/5] overflow-hidden bg-gray-100 mb-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={p.images?.[0] ?? ""}
                                    alt={p.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">{p.name}</p>
                            <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 group-hover:text-[#cc1111] transition-colors">
                                Shop now <ChevronRight className="w-3 h-3" />
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
