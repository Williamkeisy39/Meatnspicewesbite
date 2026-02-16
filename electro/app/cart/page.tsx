"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
    const { cart, isLoading, itemCount, updateQuantity, removeFromCart } = useCartContext();
    const { formatPrice } = useStore();

    if (isLoading) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-secondary border-t-transparent animate-spin" style={{ borderRadius: "50%" }} />
            </div>
        );
    }

    if (!cart?.items?.length) {
        return (
            <div className="container py-20 text-center">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" strokeWidth={1} />
                <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link href="/search" className="inline-flex items-center gap-2 bg-secondary text-white font-extrabold uppercase text-sm tracking-wide px-8 py-4 rounded-xl hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20">
                    Start Shopping <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-primary text-white text-xs font-extrabold uppercase tracking-wider rounded-xl">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Total</div>
                    </div>

                    {cart.items.map((item) => {
                        const price = item.sales_price || item.price || 0;
                        return (
                            <div key={item.product_id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border border-border p-4 md:px-6 rounded-xl">
                                {/* Product */}
                                <div className="md:col-span-6 flex items-center gap-4">
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 border border-border overflow-hidden rounded-lg">
                                        <Image src={item.product_image || ""} alt={item.product_name || ""} fill className="object-contain p-2" />
                                    </div>
                                    <div className="min-w-0">
                                        <Link href={`/${item.product_id}`} className="text-sm font-bold text-gray-900 hover:text-secondary transition-colors line-clamp-2">
                                            {item.product_name}
                                        </Link>
                                        {item.sku && <p className="text-xs text-gray-400 mt-1">SKU: {item.sku}</p>}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="md:col-span-2 text-center">
                                    <span className="text-sm font-bold text-gray-700">{formatPrice(price)}</span>
                                </div>

                                {/* Quantity */}
                                <div className="md:col-span-2 flex items-center justify-center gap-2">
                                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="p-2 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="px-4 text-sm font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product_id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Total */}
                                <div className="md:col-span-2 text-right">
                                    <span className="text-sm font-extrabold text-gray-900">{formatPrice(price * item.quantity)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-border p-6 sticky top-32 space-y-6 rounded-2xl">
                        <h3 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide">Order Summary</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Items ({itemCount})</span>
                                <span className="font-bold">{formatPrice(cart.total || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-bold text-green-600">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4 flex justify-between items-center">
                            <span className="text-lg font-extrabold text-gray-900">Total</span>
                            <span className="text-2xl font-black text-secondary">{formatPrice(cart.total || 0)}</span>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full py-4 text-center bg-secondary text-white font-extrabold uppercase text-sm tracking-wide hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20 rounded-xl"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link href="/search" className="block text-center text-sm text-secondary font-bold hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
