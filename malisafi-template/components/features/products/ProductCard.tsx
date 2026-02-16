"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useStore } from "@/lib/providers/store-provider";
import type { Product } from "@valebytes/topduka-node";

interface ProductCardProps {
    product: Product;
    theme?: "light" | "dark";
}

export default function ProductCard({ product, theme = "light" }: ProductCardProps) {
    const { addToCart, addingProductId } = useCartContext();
    const { openCart } = useCartDrawer();
    const { formatPrice } = useStore();

    const textColor = theme === "dark" ? "text-white" : "text-black";
    const subTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
    const isAdding = addingProductId === product.id;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        await addToCart(product.id);
        openCart();
    };

    return (
        <div className="group relative border-none bg-transparent h-full flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F5] mb-4">
                {product.sales_price && product.sales_price < product.price && (
                    <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm px-2 py-1 text-black shadow-sm">
                        SALE
                    </span>
                )}

                <Link href={`/${product.id}`} className="block w-full h-full">
                    <Image
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                </Link>

                {/* Quick Add Overlay - Appears on Hover */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="absolute bottom-0 left-0 right-0 py-4 bg-white/95 backdrop-blur text-xs font-bold uppercase tracking-widest text-black 
                             translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                             hover:bg-black hover:text-white border-t border-gray-100 disabled:opacity-50"
                >
                    {isAdding ? "Adding..." : "Add to Cart"}
                </button>
            </div>

            {/* Product Details */}
            <div className="text-center mt-auto">
                <p className={`text-[10px] uppercase tracking-widest mb-2 ${subTextColor}`}>{product.categories?.[0] || ""}</p>
                <div className="group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 mb-1">
                    <Link href={`/${product.id}`}>
                        <h3 className={`text-lg font-serif leading-tight ${textColor}`}>
                            {product.name}
                        </h3>
                    </Link>
                </div>
                <div className={`text-sm font-medium font-dm-sans ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                    {product.sales_price ? (
                        <>
                            <span>{formatPrice(product.sales_price)}</span>
                            <span className="ml-2 line-through text-gray-400 text-xs">{formatPrice(product.price)}</span>
                        </>
                    ) : (
                        <span>{formatPrice(product.price)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
