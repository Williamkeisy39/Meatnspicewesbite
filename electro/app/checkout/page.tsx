"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";

type DeliveryMethod = "pickup" | "delivery";

export default function CheckoutPage() {
    const { cart, isLoading, itemCount } = useCartContext();
    const { formatPrice, store } = useStore();
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        deliveryMethod: "pickup" as DeliveryMethod,
        location: "",
        notes: "",
    });
    const [status, setStatus] = useState<{ error?: string; success?: string }>({});
    const whatsappNumber = store?.whatsapp || "254743467191";
    const cartTotal = cart?.total || 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const message = useMemo(() => {
        if (!cart?.items?.length) return "";
        const lines = cart.items
            .map((item) => {
                const price = item.sales_price || item.price || 0;
                return `• ${item.quantity} x ${item.product_name} (${formatPrice(price)})`;
            })
            .join("\n");

        const deliveryLine =
            form.deliveryMethod === "pickup"
                ? "Pickup at store"
                : `Deliver to: ${form.location || "(address not provided)"}`;

        return [
            `New order from ${form.fullName}`,
            `Phone: ${form.phone}`,
            form.email ? `Email: ${form.email}` : "",
            lines,
            `Total: ${formatPrice(cartTotal)}`,
            `Delivery option: ${form.deliveryMethod.toUpperCase()}`,
            deliveryLine,
            form.notes ? `Notes: ${form.notes}` : "",
        ]
            .filter(Boolean)
            .join("\n");
    }, [cart?.items, cartTotal, form, formatPrice]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus({});

        if (!cart?.items?.length) {
            setStatus({ error: "Your cart is empty. Add items before checking out." });
            return;
        }

        if (!form.fullName.trim()) {
            setStatus({ error: "Please provide your full name." });
            return;
        }
        if (!form.phone.trim()) {
            setStatus({ error: "Please provide a phone number." });
            return;
        }
        if (form.deliveryMethod === "delivery" && !form.location.trim()) {
            setStatus({ error: "Please provide a delivery location." });
            return;
        }

        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
        setStatus({ success: "WhatsApp opened in a new tab. Kindly confirm the order there." });
    };

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
                <h2 className="text-2xl font-black text-gray-900 mb-2">Nothing to checkout</h2>
                <p className="text-gray-500 mb-8">Add some products to your cart first.</p>
                <Link
                    href="/search"
                    className="inline-flex items-center gap-2 bg-secondary text-white font-extrabold uppercase text-sm tracking-wide px-8 py-4 rounded-xl hover:bg-secondary-hover transition-all"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="text-xs text-gray-500 mb-6 flex gap-2">
                <Link href="/" className="hover:text-secondary">Home</Link> /
                <Link href="/cart" className="hover:text-secondary">Cart</Link> /
                <span className="text-black font-bold">Checkout</span>
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-border p-6 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide">Customer Details</h2>
                            <p className="text-xs text-gray-400">No payment required — we confirm via WhatsApp.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 block">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-secondary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 block">Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-secondary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 block">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-secondary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Delivery Option</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <button
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, deliveryMethod: "pickup" }))}
                                    className={`rounded-xl border px-4 py-3 font-bold transition ${form.deliveryMethod === "pickup" ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-gray-600"}`}
                                >
                                    Pickup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, deliveryMethod: "delivery" }))}
                                    className={`rounded-xl border px-4 py-3 font-bold transition ${form.deliveryMethod === "delivery" ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-gray-600"}`}
                                >
                                    Delivery
                                </button>
                            </div>
                        </div>

                        {form.deliveryMethod === "delivery" && (
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 block">Delivery Location *</label>
                                <textarea
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-secondary focus:outline-none"
                                    placeholder="Estate, street, building, directions"
                                />
                            </div>
                        )}

                        {form.deliveryMethod === "pickup" && (
                            <div className="text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                                Pickup orders are collected at our shop in Nairobi. We'll confirm timing over WhatsApp.
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 block">Notes</label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-secondary focus:outline-none"
                                placeholder="Preferred cuts, delivery window, etc."
                            />
                        </div>
                    </div>

                    {status.error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{status.error}</div>
                    )}
                    {status.success && (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{status.success}</div>
                    )}

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold uppercase text-sm tracking-wide px-8 py-4 rounded-xl hover:bg-[#1ebe5d] transition-all shadow-lg shadow-[#25D366]/20"
                    >
                        <MessageCircle size={18} /> Send Order via WhatsApp
                    </button>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white border border-border p-6 sticky top-32 rounded-2xl space-y-4">
                        <h3 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide">Order Summary</h3>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                            {cart?.items?.map((item) => {
                                const price = item.sales_price || item.price || 0;
                                return (
                                    <div key={item.product_id} className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{item.product_name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{formatPrice(price * item.quantity)}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-border pt-4 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Items ({itemCount})</span>
                                <span className="font-bold">{formatPrice(cartTotal)}</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4 flex justify-between items-center">
                            <span className="text-lg font-extrabold text-gray-900">Total</span>
                            <span className="text-2xl font-black text-secondary">{formatPrice(cartTotal)}</span>
                        </div>

                        <Link href="/cart" className="block text-center text-sm text-secondary font-bold hover:underline">
                            Modify Cart
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
