"use client";

import { useCartContext } from "@/lib/providers/cart-provider";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useStore } from "@/lib/providers/store-provider";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
    const { cart, isLoading, itemCount, updateQuantity, removeFromCart } = useCartContext();
    const { isOpen, closeCart } = useCartDrawer();
    const { formatPrice } = useStore();

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-primary text-white">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} />
                        <h2 className="text-lg font-extrabold uppercase tracking-wide">Cart ({itemCount})</h2>
                    </div>
                    <button onClick={closeCart} className="p-2 hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 border-3 border-secondary border-t-transparent animate-spin" style={{ borderRadius: "50%" }} />
                        </div>
                    ) : !cart?.items?.length ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                            <ShoppingBag size={48} strokeWidth={1} />
                            <p className="text-sm font-medium">Your cart is empty</p>
                            <button onClick={closeCart} className="text-secondary text-sm font-bold hover:underline">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.product_id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-border group">
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg border border-border overflow-hidden">
                                        <Image
                                            src={item.product_image || ""}
                                            alt={item.product_name || ""}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.product_name}</h4>
                                        <p className="text-secondary font-extrabold text-sm mt-1">
                                            {formatPrice((item.sales_price || item.price || 0) * item.quantity)}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-1.5 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="px-3 text-xs font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                    className="p-1.5 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product_id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart?.items?.length ? (
                    <div className="border-t border-border px-6 py-5 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Subtotal</span>
                            <span className="text-xl font-black text-gray-900">{formatPrice(cart.total || 0)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/cart"
                                onClick={closeCart}
                                className="py-3 text-center text-sm font-extrabold uppercase tracking-wide border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-xl"
                            >
                                View Cart
                            </Link>
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="py-3 text-center text-sm font-extrabold uppercase tracking-wide bg-secondary text-white hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20 rounded-xl"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
