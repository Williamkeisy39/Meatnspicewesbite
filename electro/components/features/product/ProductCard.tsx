"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Loader2 } from "lucide-react";
import type { Product } from "@valebytes/topduka-node";
import { useStore } from "@/lib/providers/store-provider";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCartDrawer } from "../../context/CartDrawerContext";

interface ProductCardProps {
    product: Product;
    layout?: "grid" | "list";
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
    const { formatPrice } = useStore();
    const { addToCart, addingProductId } = useCartContext();
    const { openCart } = useCartDrawer();

    const isAdding = addingProductId === product.id;
    const discount = product.sales_price ? Math.round(((product.price - product.sales_price) / product.price) * 100) : 0;
    const displayPrice = product.sales_price || product.price;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await addToCart(product.id);
        openCart();
    };

    // LIST VIEW
    if (layout === "list") {
        return (
            <div className="group flex gap-4 p-3 hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border">
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-border">
                    <Image
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                    <Link href={`/${product.id}`} className="text-sm font-bold text-gray-800 hover:text-secondary truncate transition-colors">
                        {product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-secondary font-extrabold text-sm">{formatPrice(displayPrice)}</span>
                        {product.sales_price && <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.price)}</span>}
                    </div>
                </div>
            </div>
        );
    }

    // GRID VIEW
    return (
        <div className="group relative bg-white border border-border rounded-2xl hover:border-secondary/20 hover:shadow-elevated transition-all duration-400 overflow-hidden flex flex-col h-full">

            {/* Badges */}
            {discount > 0 && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-secondary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                        <Zap size={10} fill="currentColor" /> -{discount}%
                    </span>
                </div>
            )}

            {/* Image Area */}
            <Link href={`/${product.id}`} className="relative h-[220px] w-full bg-gray-50 overflow-hidden">
                <Image
                    src={product.images?.[0] || ""}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Content */}
            <div className="p-4 pt-2 flex flex-col flex-grow">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.15em] mb-1.5">{product.categories?.[0] || ""}</span>

                <Link href={`/${product.id}`} className="text-[13px] font-bold text-gray-800 leading-snug line-clamp-2 mb-2 hover:text-secondary transition-colors">
                    {product.name}
                </Link>

                {/* Price + Cart */}
                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        {product.sales_price && (
                            <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.price)}</span>
                        )}
                        <span className="text-lg font-black text-gray-900 tracking-tight">{formatPrice(displayPrice)}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="bg-gray-100 hover:bg-secondary hover:text-white text-gray-600 rounded-xl h-10 w-10 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {isAdding ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} strokeWidth={2.5} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
