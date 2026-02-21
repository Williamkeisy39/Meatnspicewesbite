"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useBestSellingProducts } from "@/lib/hooks";

export function TrendingThisWeek() {
    const { addToCart, addingProductId } = useCartContext();
    const { formatPrice } = useStore();
    const { data: products = [] } = useBestSellingProducts();

    return (
        <section className="py-10 border-b border-gray-200">
            <div className="max-w-[1280px] mx-auto px-5">
                <div className="flex gap-5">
                    {/* Editorial panel */}
                    <div className="hidden lg:flex flex-col justify-between p-6 shrink-0 w-[220px] bg-[#f5f5f0] relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-25"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=70")' }}
                        />
                        <div className="relative z-10">
                            <h2 className="font-extrabold text-2xl leading-tight text-gray-900 mb-2 font-display">
                                What Treding This Week
                            </h2>
                            <p className="text-xs text-gray-500">100% leather handmade</p>
                        </div>
                        <div className="relative z-10 mt-6">
                            <Link
                                href="/shop"
                                className="inline-block border-2 border-gray-900 text-gray-900 text-sm font-bold uppercase px-5 py-2.5 hover:bg-gray-900 hover:text-white transition-all"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="flex-1 relative">
                        <button className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 items-center justify-center shadow hover:border-gray-900 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="hidden md:flex absolute -right-4 top-1/3 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 items-center justify-center shadow hover:border-gray-900 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {products.slice(0, 4).map((p) => (
                                <div key={p.id} className="group">
                                    <Link href={`/product/${p.id}`} className="block w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={p.images?.[0] ?? ""}
                                            alt={p.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                    <p className="text-xs font-semibold leading-snug text-gray-900 mb-1 line-clamp-2">
                                        {p.name}
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 mb-2">
                                        {formatPrice(p.sales_price ?? p.price)}
                                    </p>
                                    <button
                                        onClick={() => addToCart(p.id)}
                                        disabled={addingProductId === p.id}
                                        className="w-full text-xs font-semibold uppercase tracking-wider py-2.5 border border-gray-200 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all disabled:opacity-50"
                                    >
                                        {addingProductId === p.id ? "Adding..." : "Select options"}
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
