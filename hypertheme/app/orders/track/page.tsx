"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { useStore } from "@/lib/providers/store-provider";
import { duka } from "@/lib/duka";
import { Package, Search, Truck, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import type { Order } from "@valebytes/topduka-node";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { icon: <Clock className="w-5 h-5" />, color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  processing: { icon: <Truck className="w-5 h-5" />, color: "text-blue-600 bg-blue-50", label: "Processing" },
  completed: { icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600 bg-green-50", label: "Completed" },
  cancelled: { icon: <XCircle className="w-5 h-5" />, color: "text-red-600 bg-red-50", label: "Cancelled" },
  refunded: { icon: <XCircle className="w-5 h-5" />, color: "text-gray-600 bg-gray-50", label: "Refunded" },
};

export default function TrackOrderPage() {
  const { formatPrice } = useStore();
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Track Order", href: "/orders/track" },
  ];

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(orderNumber, 10);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid order number");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const result = await duka.orders.track(num);
      setOrder(result);
    } catch {
      setError("Order not found. Please check the order number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const status = statusConfig[order?.status || ""] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Header */}
        <div className="mt-8 mb-8 text-center">
          <Package className="w-12 h-12 text-[#1D349A] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your order number to check the status of your order.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="max-w-md mx-auto mb-10">
          <div className="flex gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g. 1001)"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D349A] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#1D349A] text-white text-sm font-medium hover:bg-[#162a7a] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </form>

        {/* Order Result */}
        {order && (
          <div className="max-w-2xl mx-auto">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50">
              <div>
                <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 ${status.color}`}>
                {status.icon}
                <span className="text-sm font-medium">{status.label}</span>
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-3">
                        {item.product_image && (
                          <img
                            src={typeof item.product_image === "string" ? item.product_image : Array.isArray(item.product_image) ? item.product_image[0] : ""}
                            alt={item.product_name || ""}
                            className="w-12 h-12 object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.total_price || item.unit_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              {order.subtotal !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                </div>
              )}
              {order.tax_amount !== undefined && order.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900">{formatPrice(order.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
