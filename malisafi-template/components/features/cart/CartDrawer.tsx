"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useStore } from "@/lib/providers/store-provider";
import { Button } from "../../common/Button";

export default function CartDrawer() {
    const { cart, isLoading, itemCount, updateQuantity, removeFromCart } = useCartContext();
    const { isCartOpen, closeCart } = useCartDrawer();
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

    return (
        <div
            className={`fixed inset-0 z-[60] transition-visibility duration-500 ${isCartOpen ? "visible" : "invisible"
                }`}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full bg-white">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-xl font-serif text-black">Your Selection ({itemCount})</h2>
                        <button
                            onClick={closeCart}
                            className="p-2 text-gray-400 hover:text-black transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-sm text-gray-400">Loading...</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                                <span className="text-4xl"></span>
                                <p className="text-sm font-dm-sans">Your bag is empty.</p>
                                <Button
                                    onClick={closeCart}
                                    className="bg-black text-white hover:bg-[#C6A87C] border-none rounded-none uppercase tracking-widest text-xs py-3 px-8"
                                >
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            items.map((item) => {
                                const price = item.sales_price || item.price || 0;
                                const isUpdating = updatingId === item.product_id;
                                return (
                                    <div key={item.id} className={`flex gap-4 animate-fade-in-up ${isUpdating ? "opacity-50" : ""}`}>
                                        <div className="relative w-20 h-24 bg-gray-50 shrink-0 overflow-hidden">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name || ""}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <Link
                                                        href={`/${item.product_id}`}
                                                        onClick={closeCart}
                                                        className="text-sm font-serif text-black hover:text-[#C6A87C] line-clamp-2"
                                                    >
                                                        {item.product_name || "Product"}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemove(item.product_id)}
                                                        disabled={isUpdating}
                                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                                {item.sku && <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{item.sku}</p>}
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-gray-200">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                                        disabled={isUpdating || item.quantity <= 1}
                                                        className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                                        disabled={isUpdating}
                                                        className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="text-sm font-medium font-dm-sans text-black">
                                                    {formatPrice(price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-black">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <p className="text-xs text-gray-400 font-light text-center">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <Link href="/checkout" onClick={closeCart} className="block">
                                <Button className="w-full bg-black text-white hover:bg-[#C6A87C] border-none rounded-none py-4 text-xs font-bold uppercase tracking-widest transition-colors shadow-lg hover:shadow-xl">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
