"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";

const DISPATCH_LOCATION = "VX8G+4G9, Matangi Rd, Ruiru, Kenya";
const DEFAULT_DISTANCE_KM = 18;
const BASE_FARE_KES = 150;
const PER_KM_RATE_KES = 40;

const LOCATION_DISTANCE_RULES: { keywords: string[]; distance: number }[] = [
    { keywords: ["vx8g", "matangi", "ruiru", "kimbo", "bypass"], distance: 4 },
    { keywords: ["kahawa", "githurai", "trm", "thika road", "kasarani", "clay city"], distance: 11 },
    { keywords: ["garden estate", "muthaiga", "pangani", "ngara", "parklands", "cbd", "upper hill", "westlands", "kileleshwa", "lavington"], distance: 22 },
    { keywords: ["karen", "ngong", "rongai", "syokimau", "kitengela", "ruaka", "rosslyn"], distance: 34 },
];

const pickDistanceFromInput = (input: string) => {
    if (!input) return DEFAULT_DISTANCE_KM;
    const normalized = input.toLowerCase();
    const kmMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometer|kilometre)/i);
    if (kmMatch) {
        return Math.max(1, parseFloat(kmMatch[1]));
    }

    for (const rule of LOCATION_DISTANCE_RULES) {
        if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
            return rule.distance;
        }
    }

    return DEFAULT_DISTANCE_KM;
};

export default function CartPage() {
    const { cart, isLoading, itemCount, updateQuantity, removeFromCart } = useCartContext();
    const { formatPrice, store } = useStore();
    const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
    const [deliveryDetails, setDeliveryDetails] = useState("");
    const [customerNote, setCustomerNote] = useState("");

    const whatsappNumber = store?.whatsapp || "254743467191";

    const cartTotal = cart?.total || 0;

    const { deliveryFee, estimatedDistanceKm, fareMultiplier } = useMemo(() => {
        if (deliveryMethod !== "delivery") {
            return { deliveryFee: 0, estimatedDistanceKm: 0, fareMultiplier: 1 };
        }

        const distance = pickDistanceFromInput(deliveryDetails);
        const loadMultiplier = cartTotal > 10000 ? 1.25 : cartTotal > 5000 ? 1.15 : 1;
        const fee = Math.round((BASE_FARE_KES + distance * PER_KM_RATE_KES) * loadMultiplier);

        return {
            deliveryFee: fee,
            estimatedDistanceKm: distance,
            fareMultiplier: loadMultiplier,
        };
    }, [cartTotal, deliveryDetails, deliveryMethod]);

    const orderTotal = cartTotal + deliveryFee;

    const orderMessage = useMemo(() => {
        if (!cart?.items) return "";
        const itemLines = cart.items
            .map((item) => {
                const price = item.sales_price || item.price || 0;
                return `• ${item.quantity} x ${item.product_name} (${formatPrice(price)})`;
            })
            .join("\n");

        const deliveryLine =
            deliveryMethod === "pickup"
                ? `Pickup at ${DISPATCH_LOCATION}`
                : `Deliver to: ${deliveryDetails || "(not provided)"}`;

        const deliveryFeeLine =
            deliveryMethod === "pickup"
                ? "Delivery fee: Pickup (KES 0)"
                : `Delivery fee (~${estimatedDistanceKm.toFixed(1)}km @ Uber-style rates): ${formatPrice(deliveryFee)} (multiplier x${fareMultiplier.toFixed(2)})`;

        const dispatchLine = `Dispatch hub: ${DISPATCH_LOCATION}`;

        const noteLine = customerNote ? `Notes: ${customerNote}` : "";

        return [
            `Order from ${store?.name || "Meat & Spice"}:`,
            itemLines,
            `Cart total: ${formatPrice(cartTotal)}`,
            deliveryFeeLine,
            `Grand total: ${formatPrice(orderTotal)}`,
            `Delivery option: ${deliveryMethod.toUpperCase()}`,
            deliveryLine,
            dispatchLine,
            noteLine,
        ]
            .filter(Boolean)
            .join("\n");
    }, [
        cart?.items,
        deliveryDetails,
        deliveryMethod,
        customerNote,
        formatPrice,
        cartTotal,
        store?.name,
        deliveryFee,
        estimatedDistanceKm,
        fareMultiplier,
        orderTotal,
    ]);

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    const canSend = Boolean(cart?.items?.length) && (deliveryMethod === "pickup" || deliveryDetails.trim().length > 0);

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
                                <span className="font-bold">{formatPrice(cartTotal)}</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4 flex justify-between items-center">
                            <span className="text-lg font-extrabold text-gray-900">Total</span>
                            <span className="text-2xl font-black text-secondary">{formatPrice(orderTotal)}</span>
                        </div>

                        <div className="space-y-4 border-t border-border pt-4">
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Delivery Option</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryMethod("pickup")}
                                        className={`rounded-xl border px-4 py-3 font-bold transition ${deliveryMethod === "pickup" ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-gray-600"}`}
                                    >
                                        Pickup
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryMethod("delivery")}
                                        className={`rounded-xl border px-4 py-3 font-bold transition ${deliveryMethod === "delivery" ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-gray-600"}`}
                                    >
                                        Delivery
                                    </button>
                                </div>
                            </div>

                            {deliveryMethod === "delivery" && (
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Delivery Location *</label>
                                    <textarea
                                        value={deliveryDetails}
                                        onChange={(e) => setDeliveryDetails(e.target.value)}
                                        rows={3}
                                        placeholder="e.g. VX8G+4G9, Matangi Rd, Ruiru or your exact drop-off"
                                        className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:border-secondary focus:ring-0"
                                    />
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        Dispatching from {DISPATCH_LOCATION}. We price like Uber: base {formatPrice(BASE_FARE_KES)} + {formatPrice(PER_KM_RATE_KES)} per km (auto-estimated from your note).
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Additional Notes</label>
                                <textarea
                                    value={customerNote}
                                    onChange={(e) => setCustomerNote(e.target.value)}
                                    rows={2}
                                    placeholder="Optional instructions (preferred cut, timing, etc.)"
                                    className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:border-secondary focus:ring-0"
                                />
                            </div>
                        </div>

                        <a
                            href={canSend ? whatsappLink : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-disabled={!canSend}
                            className={`block w-full py-4 text-center rounded-xl font-extrabold uppercase text-sm tracking-wide shadow-lg transition ${
                                canSend
                                    ? "bg-[#25D366] text-white hover:bg-[#1ebe5d]"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={(event) => {
                                if (!canSend) {
                                    event.preventDefault();
                                }
                            }}
                        >
                            <span className="inline-flex items-center gap-2 justify-center">
                                <MessageCircle size={18} /> Send Order via WhatsApp
                            </span>
                        </a>

                        <Link href="/search" className="block text-center text-sm text-secondary font-bold hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
