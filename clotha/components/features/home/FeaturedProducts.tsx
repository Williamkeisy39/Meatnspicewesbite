"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Heart } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useProducts } from "@/lib/hooks";
import { useState } from "react";

export function FeaturedProducts() {
    const { addToCart, addingProductId } = useCartContext();
    const { formatPrice } = useStore();
    const { data: products = [] } = useProducts();
    const [liked, setLiked] = useState<Record<string, boolean>>({});

    return (
        <section className="py-10 border-b border-gray-200">
            <div className="max-w-[1280px] mx-auto px-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg text-gray-900 font-display">Featured Products</h2>
                    <Link
                        href="/shop"
                        className="text-xs font-semibold flex items-center gap-1 text-gray-500 hover:text-[#cc1111] transition-colors"
                    >
                        Shop all categories <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {products.map((p) => (
                        <div key={p.id} className="group relative">
                            {/* Sale badge */}
                            {p.sales_price && p.sales_price < p.price && (
                                <span className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase px-2 py-0.5 bg-[#cc1111] text-white">
                                    SALE
                                </span>
                            )}

                            {/* Wishlist */}
                            <button
                                onClick={() => setLiked((l) => ({ ...l, [p.id]: !l[p.id] }))}
                                className="absolute top-2 right-2 z-10 w-7 h-7 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                            >
                                <Heart
                                    className={`w-3.5 h-3.5 ${liked[p.id] ? "fill-[#cc1111] text-[#cc1111]" : "text-gray-400"}`}
                                />
                            </button>

                            {/* Image */}
                            <Link href={`/product/${p.id}`} className="block w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={p.images?.[0] ?? ""}
                                    alt={p.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                            </Link>

                            {/* Info */}
                            <p className="text-xs font-semibold leading-snug text-gray-900 line-clamp-2 mb-1.5">{p.name}</p>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-bold text-gray-900">{formatPrice(p.sales_price ?? p.price)}</span>
                                {p.sales_price && p.sales_price < p.price && (
                                    <span className="text-xs line-through text-gray-400">{formatPrice(p.price)}</span>
                                )}
                            </div>

                            {/* Add to cart — appears on hover */}
                            <button
                                onClick={() => addToCart(p.id)}
                                disabled={addingProductId === p.id}
                                className="w-full text-[11px] font-bold uppercase tracking-wider py-2 border border-gray-900 text-gray-900 flex items-center justify-center gap-1.5 hover:bg-gray-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            >
                                <ShoppingCart className="w-3 h-3" />
                                {addingProductId === p.id ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
