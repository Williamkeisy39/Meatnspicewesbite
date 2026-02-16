"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { Button } from "../../components/common/Button";

export default function CartPage() {
    const { cart, isLoading, itemCount, updateQuantity, removeFromCart } = useCartContext();
    const { formatPrice } = useStore();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const items = cart?.items || [];
    const subtotal = items.reduce((sum, item) => {
        const price = item.sales_price || item.price || 0;
        return sum + price * item.quantity;
    }, 0);

    const handleUpdateQuantity = async (productId: string, newQty: number) => {
        if (newQty < 1) return;
        setUpdatingId(productId);
        await updateQuantity(productId, newQty);
        setUpdatingId(null);
    };

    const handleRemove = async (productId: string) => {
        setUpdatingId(productId);
        await removeFromCart(productId);
        setUpdatingId(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-[var(--background)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-gray-200 border-t-[#C6A87C] rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[var(--background)]">
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)] mb-8 animate-fade-in">
                    <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[var(--color-accent)] font-medium">Shopping Cart</span>
                </nav>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-accent)] mb-10 animate-fade-in-up">
                    Your Cart
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-24 animate-fade-in-up">
                        <div className="text-7xl mb-6">🛒</div>
                        <h2 className="text-2xl font-serif font-bold text-[var(--color-accent)] mb-3">Your cart is empty</h2>
                        <p className="text-[var(--color-muted-foreground)] text-sm mb-8 max-w-md mx-auto">
                            Looks like you haven&apos;t added any beauty essentials to your cart yet. Start browsing our collection!
                        </p>
                        <Link href="/search">
                            <Button className="rounded-full px-8">
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-0">
                            {/* Column Headers */}
                            <div className="hidden md:grid grid-cols-[minmax(0,2fr)_1fr_1fr_auto] items-center gap-6 pb-4 border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                                <span>Product</span>
                                <span className="text-center">Quantity</span>
                                <span className="text-right">Total</span>
                                <span className="w-8" />
                            </div>

                            {items.map((item, i) => {
                                const price = item.sales_price || item.price || 0;
                                const isUpdating = updatingId === item.product_id;
                                return (
                                    <div
                                        key={item.id}
                                        className={`grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_1fr_1fr_auto] items-center gap-4 md:gap-6 py-6 border-b border-[var(--color-border)] animate-fade-in-up ${isUpdating ? "opacity-50" : ""}`}
                                        style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards', opacity: 0 }}
                                    >
                                        {/* Product Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 overflow-hidden shrink-0">
                                                {item.product_image ? (
                                                    <img src={item.product_image} alt={item.product_name || ""} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <Link href={`/${item.product_id}`}>
                                                    <h3 className="text-sm font-semibold text-[var(--color-accent)] leading-tight line-clamp-2 hover:text-[#C6A87C] transition-colors">
                                                        {item.product_name || "Product"}
                                                    </h3>
                                                </Link>
                                                {item.sku && <p className="text-xs text-[var(--color-muted-foreground)] mt-1">SKU: {item.sku}</p>}
                                                <p className="text-sm font-medium text-[var(--color-primary)] mt-1">{formatPrice(price)}</p>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center border border-[var(--color-border)] overflow-hidden">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                                    disabled={isUpdating || item.quantity <= 1}
                                                    className="w-9 h-9 flex items-center justify-center text-sm hover:bg-[var(--color-muted)] transition-colors disabled:opacity-30"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                                    disabled={isUpdating}
                                                    className="w-9 h-9 flex items-center justify-center text-sm hover:bg-[var(--color-muted)] transition-colors disabled:opacity-30"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="text-right">
                                            <p className="text-base font-semibold text-[var(--color-accent)]">
                                                {formatPrice(price * item.quantity)}
                                            </p>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => handleRemove(item.product_id)}
                                            disabled={isUpdating}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30"
                                            aria-label="Remove item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6 6 18" />
                                                <path d="m6 6 12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Continue Shopping */}
                            <div className="flex justify-between items-center pt-6">
                                <Link href="/search" className="text-sm text-[var(--color-primary)] font-medium hover:underline">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[var(--color-border)] p-6 lg:p-8 lg:sticky lg:top-28 space-y-6 animate-slide-in-right" style={{ animationFillMode: 'forwards', opacity: 0 }}>
                                <h2 className="text-lg font-serif font-bold text-[var(--color-accent)]">Order Summary</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-muted-foreground)]">Items ({itemCount})</span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-muted-foreground)]">Shipping</span>
                                        <span className="text-green-600 font-medium">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="border-t border-[var(--color-border)] pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold text-[var(--color-accent)]">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="block">
                                    <Button className="w-full rounded-full py-4 text-sm font-bold uppercase tracking-wider shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 transition-all">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Secure checkout · SSL encrypted
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
