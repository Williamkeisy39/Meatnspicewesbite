"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { duka } from "@/lib/duka";
import { PaymentMethod } from "@valebytes/topduka-node";
import { Lock, ChevronLeft } from "lucide-react";

export default function CheckoutPage() {
  const { cart, isLoading, itemCount } = useCartContext();
  const { formatPrice, config } = useStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

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

  const { data: paystackConfig } = useQuery({
    queryKey: ["paystack-config"],
    queryFn: () => duka.payments.getConfig(),
    staleTime: 1000 * 60 * 10,
  });

  const completeOrder = useMutation({
    mutationFn: (params: Parameters<typeof duka.cart.complete>[0]) =>
      duka.cart.complete(params),
  });

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

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
    const amountInKobo = Math.round(subtotal * 100);
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
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    if (items.length === 0) { setError("Your cart is empty."); return; }
    setProcessing(true);
    if (paymentMethod === "paystack") {
      await handlePaystackInline();
    } else {
      await handleCashOnDelivery();
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 shadow-sm max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
            {orderRef && <p className="text-xs font-mono text-gray-400 mt-1">Ref: {orderRef}</p>}
            <p className="text-gray-500 mt-2 text-sm">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>
          <button
            onClick={() => router.push("/search?q=")}
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="text-5xl">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-500 text-sm">Add some products to your cart first.</p>
          <Link href="/search?q=" className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to store
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Shipping + Payment */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping Information */}
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name *</label>
                    <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone *</label>
                    <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} required
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Address Line 1 *</label>
                    <input type="text" name="address_line1" value={form.address_line1} onChange={handleChange} required
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Address Line 2</label>
                    <input type="text" name="address_line2" value={form.address_line2} onChange={handleChange}
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">City *</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} required
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">State / Province</label>
                    <input type="text" name="state_province" value={form.state_province} onChange={handleChange}
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                    <input type="text" name="postal_code" value={form.postal_code} onChange={handleChange}
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Country *</label>
                    <input type="text" name="country" value={form.country} onChange={handleChange} required
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center justify-between">
                  Payment Method <Lock className="w-4 h-4 text-gray-400" />
                </h2>
                <div className="space-y-3">
                  {paystackConfig?.public_key && (
                    <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${paymentMethod === "paystack" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="payment_method" value="paystack" checked={paymentMethod === "paystack"}
                        onChange={(e) => setPaymentMethod(e.target.value)} className="accent-black" />
                      <div className="flex-1">
                        <span className="font-semibold text-sm text-gray-900">Pay with Paystack</span>
                        <p className="text-xs text-gray-500 mt-0.5">Card, Bank Transfer, USSD, Mobile Money</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                    </label>
                  )}
                  <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${paymentMethod === "cash" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="payment_method" value="cash" checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)} className="accent-black" />
                    <div className="flex-1">
                      <span className="font-semibold text-sm text-gray-900">Cash on Delivery</span>
                      <p className="text-xs text-gray-500 mt-0.5">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 p-6 lg:sticky lg:top-24">
                <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => {
                    const price = item.price ?? 0;
                    return (
                      <div key={item.product_id} className="flex gap-3">
                        <div className="w-14 h-14 bg-gray-100 shrink-0 overflow-hidden">
                          {item.product_image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.product_name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-semibold text-gray-900 shrink-0">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({itemCount})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-3 pt-3">
                  <div className="flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full mt-6 bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {processing ? "Processing..." : paymentMethod === "cash" ? "Place Order" : "Pay Now"}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Your personal data will be used to process your order.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
