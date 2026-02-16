"use client";

import { MainHeader } from "@/components/header/main-header";
import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { duka } from "@/lib/duka";
import { PaymentMethod } from "@valebytes/topduka-node";
import { Shield, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function CheckoutPage() {
  const { cart, isLoading, itemCount } = useCartContext();
  const { formatPrice, config } = useStore();
  const { data: paystackConfig } = useQuery({
    queryKey: ["paystack-config"],
    queryFn: () => duka.payments.getConfig(),
    staleTime: 1000 * 60 * 10,
  });
  const completeOrder = useMutation({
    mutationFn: (params: Parameters<typeof duka.cart.complete>[0]) =>
      duka.cart.complete(params),
  });
  const router = useRouter();

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

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
  ];

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
                  .mutateAsync({
                    payment_method: PaymentMethod.Paystack,
                    full_name: form.full_name,
                    email: form.email,
                    phone_number: form.phone_number,
                    address_line1: form.address_line1,
                    address_line2: form.address_line2 || undefined,
                    city: form.city,
                    state_province: form.state_province,
                    postal_code: form.postal_code,
                    country: form.country,
                  })
                  .then(() => {
                    router.push("/order-success?ref=" + response.reference);
                  });
              } else {
                setError(
                  "Payment verification failed. Please contact support.",
                );
              }
            })
            .catch(() => {
              setError("Something went wrong verifying your payment.");
            })
            .finally(() => {
              setProcessing(false);
            });
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
      await completeOrder.mutateAsync({
        payment_method: PaymentMethod.Cash,
        full_name: form.full_name,
        email: form.email,
        phone_number: form.phone_number,
        address_line1: form.address_line1,
        address_line2: form.address_line2 || undefined,
        city: form.city,
        state_province: form.state_province,
        postal_code: form.postal_code,
        country: form.country,
      });

      router.push("/order-success");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="flex items-center justify-center py-32">
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Breadcrumb items={breadcrumbs} />
        <main className="container mx-auto px-4 md:px-8 lg:px-32 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <Link href="/" className="text-[#1D349A] hover:underline font-medium">
            Continue Shopping
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Breadcrumb items={breadcrumbs} />

      <main className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Shipping + Payment */}
            <div className="flex-1 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      value={form.address_line1}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      value={form.address_line2}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state_province"
                      value={form.state_province}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={form.postal_code}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1D349A] focus:ring-1 focus:ring-[#1D349A] transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {paystackConfig?.public_key && (
                    <label
                      className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${paymentMethod === "paystack" ? "border-[#1D349A] bg-[#1D349A]/5" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value="paystack"
                        checked={paymentMethod === "paystack"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#1D349A]"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          Pay with Paystack
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Card, Bank Transfer, USSD, Mobile Money
                        </p>
                      </div>
                      <Shield className="w-5 h-5 text-green-600" />
                    </label>
                  )}

                  <label
                    className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${paymentMethod === "cash" ? "border-[#1D349A] bg-[#1D349A]/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#1D349A]"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        Cash on Delivery
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-white border border-gray-200 p-6 sticky top-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => {
                    const price = item.sales_price || item.price || 0;
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 bg-gray-100 flex-shrink-0 overflow-hidden">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 line-clamp-1">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
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
                    <span className="text-green-600">Free</span>
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
                  className="w-full mt-6 bg-[#1D349A] text-white py-3 font-semibold text-sm hover:bg-[#004f73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {processing
                    ? "Processing..."
                    : paymentMethod === "cash"
                      ? "Place Order"
                      : "Pay Now"}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Your personal data will be used to process your order and
                  support your experience.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
