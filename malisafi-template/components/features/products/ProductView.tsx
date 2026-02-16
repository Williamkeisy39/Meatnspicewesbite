"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useStore } from "@/lib/providers/store-provider";
import type { Product } from "@valebytes/topduka-node";
import ProductCard from "./ProductCard";
import { useProducts } from "@/lib/hooks";

interface ProductViewProps {
    product: Product;
}

export default function ProductView({ product }: ProductViewProps) {
    const { addToCart, addingProductId } = useCartContext();
    const { openCart } = useCartDrawer();
    const { formatPrice } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const isAdding = addingProductId === product.id;

    const handleAddToCart = async () => {
        await addToCart(product.id, quantity);
        openCart();
    };

    const { data: allProducts = [] } = useProducts({ status: "active", skip: 0 });
    const relatedProducts = allProducts
        .filter((p) => p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-8 animate-fade-in">
                    <Link href="/search" className="hover:text-black transition-colors">Shop</Link>
                    <span>/</span>
                    <Link href={`/search?q=${encodeURIComponent(product.categories?.[0] || "")}`} className="hover:text-black transition-colors">{product.categories?.[0] || "All"}</Link>
                    <span>/</span>
                    <span className="text-black">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-24">
                    {/* Product Image - Sticky on Desktop */}
                    <div className="flex-1 lg:sticky lg:top-32 h-fit animate-slide-up">
                        <div className="relative w-full h-[60vh] lg:h-[75vh] bg-[#F5F5F5] overflow-hidden rounded-lg">
                            {product.sales_price && product.sales_price < product.price && (
                                <span className="absolute top-4 left-4 z-10 text-xs font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm px-3 py-1.5 text-black shadow-sm">
                                    SALE
                                </span>
                            )}
                            <Image
                                src={product.images?.[0] || ""}
                                alt={product.name}
                                fill
                                className={`object-cover object-center transition-all duration-700 ${isImageLoading ? 'scale-110 blur-xl' : 'scale-100 blur-0'}`}
                                onLoadingComplete={() => setIsImageLoading(false)}
                                priority
                            />
                        </div>
                    </div>

                    {/* Product Details - Scrollable */}
                    <div className="flex-1 lg:max-w-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <p className="text-2xl font-medium font-dm-sans text-black">
                                    ${(product.sales_price || product.price).toFixed(2)}
                                </p>
                                {product.sales_price && product.sales_price < product.price && (
                                    <p className="text-xl text-gray-400 line-through">
                                        ${product.price.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8">
                                {product.description || product.short_description || "Experience the ultimate in skincare luxury. This premium formulation is designed to nourish, rejuvenate, and restore your skin's natural radiance."}
                            </p>

                            {/* Add to Cart Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border border-gray-200 rounded-full w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    className="flex-1 px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-all hover:shadow-lg disabled:opacity-50"
                                >
                                    {isAdding ? "Adding..." : `Add to Cart - ${formatPrice((product.sales_price || product.price) * quantity)}`}
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-100">
                                <p className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-4 w-fit">Details</p>
                                <div className="py-4 text-sm text-gray-600 leading-relaxed min-h-[100px]">
                                    <p>{product.description || product.short_description || "No description available."}</p>
                                </div>
                            </div>
                        </div>

                       
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-100 pt-16">
                        <h2 className="text-3xl font-serif text-black mb-10 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
