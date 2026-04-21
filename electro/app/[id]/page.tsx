"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/lib/providers/store-provider";
import { useProducts } from "@/lib/hooks";
import { getProduct } from "@/lib/actions/products";
import type { Product } from "@/lib/catalog/types";
import { ProductCard } from "../../components/features/product/ProductCard";
import { SidebarBestSellers } from "../../components/features/product/ProductSidebar";
import { Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCartDrawer } from "../../components/context/CartDrawerContext";

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const { formatPrice } = useStore();
    const { addToCart, addingProductId } = useCartContext();
    const { openCart } = useCartDrawer();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
        enabled: !!id,
    });

    const { data: related = [] } = useProducts({ status: "active", skip: 0 });

    const displayPrice = product?.sales_price || product?.price || 0;
    const discount = product?.sales_price ? Math.round(((product.price - product.sales_price) / product.price) * 100) : 0;
    const isAdding = product ? addingProductId === product.id : false;

    if (isLoading) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-secondary border-t-transparent animate-spin" style={{ borderRadius: "50%" }} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-20 text-center text-gray-400">
                <p className="text-xl font-bold">Product not found</p>
                <Link href="/search" className="text-secondary text-sm font-bold mt-4 inline-block hover:underline">
                    Browse Products
                </Link>
            </div>
        );
    }

    const relatedProducts = related
        .filter((p: Product) => p.id !== product.id)
        .slice(0, 4);

    const totalPrice = displayPrice * quantity;

    const handleAddToCart = async () => {
        if (!product) return;
        await addToCart(product.id, quantity);
        openCart();
    };

    return (
        <div className="container py-8">
            <div className="text-xs text-gray-500 mb-6 flex gap-2">
                <Link href="/" className="hover:text-secondary">Home</Link> /
                <Link href="/search" className="hover:text-secondary">Products</Link> /
                <span className="text-black font-bold">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    {/* Product Top Section */}
                    <div className="bg-white border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 shadow-sm rounded-2xl">
                        {/* Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-square w-full border border-gray-100 overflow-hidden bg-gray-50 group rounded-xl">
                                <Image
                                    src={product.images?.[selectedImage] || product.images?.[0] || ""}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                                {discount > 0 && (
                                    <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</div>
                                )}
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-4 overflow-auto pb-2">
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`w-20 h-20 border relative cursor-pointer flex-shrink-0 rounded-lg overflow-hidden ${selectedImage === i ? "border-secondary" : "border-gray-200 hover:border-gray-400"}`}
                                        >
                                            <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>

                            <div className="flex items-center gap-4 text-xs text-gray-500 border-b border-gray-100 pb-4">
                                {product.sku && <span>SKU: {product.sku}</span>}
                                <span className="w-px h-3 bg-gray-300"></span>
                                <span className="text-green-600 font-bold">In Stock</span>
                            </div>

                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-bold text-secondary">{formatPrice(displayPrice)}</span>
                                {product.sales_price && (
                                    <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(product.price)}</span>
                                )}
                            </div>

                            {product.description && (
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-gray-100 font-bold"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-12 flex items-center justify-center border-l border-r border-gray-300 font-bold text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 hover:bg-gray-100 font-bold"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    className="flex-1 bg-secondary text-white font-extrabold uppercase text-sm tracking-wide py-3 px-6 rounded-xl hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isAdding ? (
                                        <><Loader2 size={18} className="animate-spin" /> Adding...</>
                                    ) : (
                                        <><ShoppingCart size={18} /> Add to Cart — {formatPrice(totalPrice)}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description Tab */}
                    {product.description && (
                        <div className="bg-white border border-gray-200 shadow-sm mb-8 overflow-hidden rounded-2xl">
                            <div className="flex border-b border-gray-200 bg-gray-50">
                                <span className="px-6 py-4 text-sm font-bold uppercase text-primary border-t-2 border-primary bg-white">Description</span>
                            </div>
                            <div className="p-8 text-sm text-gray-600 leading-relaxed">
                                <p>{product.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-xl uppercase border-b border-gray-200 pb-4 relative">
                                <span className="border-b-2 border-primary absolute bottom-[-1px] left-0 pb-4 pr-4">Related Products</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p: Product) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8 hidden lg:block">
                    <SidebarBestSellers />
                </aside>
            </div>
        </div>
    );
}
