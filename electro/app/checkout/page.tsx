"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { duka } from "@/lib/duka";
import { PaymentMethod } from "@valebytes/topduka-node";
import { ShoppingBag, Loader2, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
    const { cart, isLoading, itemCount } = useCartContext();
    const { formatPrice, config } = useStore();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderRef, setOrderRef] = useState("");

    const { data: paystackConfig } = useQuery({
        queryKey: ["paystack-config"],
        queryFn: () => duka.payments.getConfig(),
        staleTime: 1000 * 60 * 10,
    });

    const completeOrder = useMutation({
        mutationFn: (params: Parameters<typeof duka.cart.complete>[0]) =>
            duka.cart.complete(params),
    });

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state_province: "",
        postal_code: "",
        country: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("paystack");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const items = cart?.items || [];
    const subtotal = items.reduce((sum, item) => {
        const price = item.sales_price || item.price || 0;
        return sum + price * item.quantity;
    }, 0);

    const vatRate = config?.vat_enabled ? config.vat_rate : 0;
    const tax = subtotal * (vatRate / 100);
    const total = subtotal + tax;
    const showTax = vatRate > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateForm = () => {
        if (!form.full_name.trim()) return "Full name is required";
        if (!form.email.trim()) return "Email is required";
        if (!form.phone_number.trim()) return "Phone number is required";
        if (!form.address_line1.trim()) return "Address is required";
        if (!form.city.trim()) return "City is required";
        if (!form.country.trim()) return "Country is required";
        return null;
    };

    const orderParams = {
        full_name: form.full_name,
        email: form.email,
        phone_number: form.phone_number,
        address_line1: form.address_line1,
        address_line2: form.address_line2 || undefined,
        city: form.city,
        state_province: form.state_province,
        postal_code: form.postal_code,
        country: form.country,
    };

    const handlePaystackInline = async () => {
        const amountInKobo = Math.round(total * 100);
        try {
            await duka.payments.payInline({
                email: form.email,
                amount: amountInKobo,
                currency: config?.currency_code?.toUpperCase() || "NGN",
                onSuccess: (response) => {
                    duka.payments
                        .verify({ reference: response.reference })
                        .then((verification) => {
                            if (verification.status === "success") {
                                return completeOrder
                                    .mutateAsync({ payment_method: PaymentMethod.Paystack, ...orderParams })
                                    .then(() => {
                                        setOrderRef(response.reference);
                                        setOrderSuccess(true);
                                        queryClient.invalidateQueries({ queryKey: ["cart"] });
                                    });
                            } else {
                                setError("Payment verification failed. Please contact support.");
                            }
                        })
                        .catch(() => setError("Something went wrong verifying your payment."))
                        .finally(() => setProcessing(false));
                },
                onClose: () => {
                    setProcessing(false);
                    setError("Payment was cancelled.");
                },
            });
        } catch {
            setError("Failed to initialize payment. Please try again.");
            setProcessing(false);
        }
    };

    const handleCashOnDelivery = async () => {
        try {
            await completeOrder.mutateAsync({ payment_method: PaymentMethod.Cash, ...orderParams });
            setOrderSuccess(true);
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        } catch {
            setError("Failed to place order. Please try again.");
            setProcessing(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (items.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        setProcessing(true);

        if (paymentMethod === "paystack") {
            await handlePaystackInline();
        } else if (paymentMethod === "cash") {
            await handleCashOnDelivery();
        }
    };

    if (orderSuccess) {
        return (
            <div className="container py-20 text-center">
                <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
                <h1 className="text-3xl font-black text-gray-900 mb-3">Order Placed Successfully!</h1>
                <p className="text-gray-500 mb-2 max-w-md mx-auto">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>
                {orderRef && (
                    <p className="text-xs text-gray-400 mb-8">Reference: {orderRef}</p>
                )}
                {!orderRef && <div className="mb-8" />}
                <button
                    onClick={() => router.push("/search")}
                    className="inline-flex items-center gap-2 bg-secondary text-white font-extrabold uppercase text-sm tracking-wide px-8 py-4 rounded-xl hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-secondary border-t-transparent animate-spin" style={{ borderRadius: "50%" }} />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container py-20 text-center">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" strokeWidth={1} />
                <h2 className="text-2xl font-black text-gray-900 mb-2">Nothing to checkout</h2>
                <p className="text-gray-500 mb-8">Add some products to your cart first.</p>
                <Link href="/search" className="inline-flex items-center gap-2 bg-secondary text-white font-extrabold uppercase text-sm tracking-wide px-8 py-4 rounded-xl hover:bg-secondary-hover transition-all">
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

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Shipping + Payment */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Information */}
                        <div className="bg-white border border-border p-6 rounded-2xl">
                            <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide mb-6 pb-3 border-b border-gray-100">
                                Shipping Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name *</label>
                                    <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone *</label>
                                    <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} required
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Address Line 1 *</label>
                                    <input type="text" name="address_line1" value={form.address_line1} onChange={handleChange} required
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Address Line 2</label>
                                    <input type="text" name="address_line2" value={form.address_line2} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">City *</label>
                                    <input type="text" name="city" value={form.city} onChange={handleChange} required
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">State / Province</label>
                                    <input type="text" name="state_province" value={form.state_province} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                                    <input type="text" name="postal_code" value={form.postal_code} onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Country *</label>
                                    <input type="text" name="country" value={form.country} onChange={handleChange} required
                                        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-secondary transition-colors bg-white rounded-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white border border-border p-6 rounded-2xl">
                            <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide mb-6 pb-3 border-b border-gray-100">
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                {paystackConfig?.public_key && (
                                    <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-all rounded-xl ${paymentMethod === "paystack" ? "border-secondary bg-secondary/5" : "border-gray-200 hover:border-gray-300"}`}>
                                        <input type="radio" name="payment_method" value="paystack" checked={paymentMethod === "paystack"}
                                            onChange={(e) => setPaymentMethod(e.target.value)} className="accent-secondary" />
                                        <div className="flex-1">
                                            <span className="font-bold text-gray-900">Pay with Paystack</span>
                                            <p className="text-xs text-gray-500 mt-0.5">Card, Bank Transfer, USSD, Mobile Money</p>
                                        </div>
                                    </label>
                                )}
                                <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-all rounded-xl ${paymentMethod === "cash" ? "border-secondary bg-secondary/5" : "border-gray-200 hover:border-gray-300"}`}>
                                    <input type="radio" name="payment_method" value="cash" checked={paymentMethod === "cash"}
                                        onChange={(e) => setPaymentMethod(e.target.value)} className="accent-secondary" />
                                    <div className="flex-1">
                                        <span className="font-bold text-gray-900">Cash on Delivery</span>
                                        <p className="text-xs text-gray-500 mt-0.5">Pay when you receive your order</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-border p-6 sticky top-32 rounded-2xl">
                            <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide mb-6 pb-3 border-b border-gray-100">
                                Order Summary
                            </h2>

                            <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                                {items.map((item) => {
                                    const price = item.sales_price || item.price || 0;
                                    return (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-14 h-14 bg-gray-100 shrink-0 overflow-hidden rounded-lg">
                                                {item.product_image && (
                                                    <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.product_name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-xs font-extrabold text-gray-900 shrink-0">
                                                {formatPrice(price * item.quantity)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span className="font-bold">{formatPrice(subtotal)}</span>
                                </div>
                                {showTax && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax ({Math.round(vatRate)}%)</span>
                                        <span className="font-bold">{formatPrice(tax)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-bold text-green-600">{formatPrice(0)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mt-3 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-extrabold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-secondary">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-6 bg-secondary text-white py-4 text-sm font-extrabold uppercase tracking-wide hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-xl"
                            >
                                {processing ? (
                                    <><Loader2 size={16} className="animate-spin" /> Processing...</>
                                ) : paymentMethod === "cash" ? "Place Order" : "Pay Now"}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-3">
                                Your personal data will be used to process your order.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
