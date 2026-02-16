"use client";

import { MainHeader } from "@/components/header/main-header";
import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, isLoading, itemCount, updateQuantity, removeFromCart } =
    useCartContext();
  const { formatPrice } = useStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shopping Cart", href: "/cart" },
  ];

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

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.sales_price || item.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Breadcrumb items={breadcrumbs} />

      <main className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-gray-500">Loading cart...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#1D349A] text-white px-8 py-3 font-semibold text-sm hover:bg-[#004f73] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white border border-gray-200">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items */}
                {items.map((item) => {
                  const price = item.sales_price || item.price || 0;
                  const lineTotal = price * item.quantity;
                  const isUpdating = updatingId === item.product_id;

                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 items-center ${isUpdating ? "opacity-50" : ""}`}
                    >
                      {/* Product */}
                      <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name || ""}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/${item.product_id}`}
                            className="text-sm font-medium text-gray-900 hover:text-[#1D349A] line-clamp-2 transition-colors"
                          >
                            {item.product_name || "Product"}
                          </Link>
                          {item.sku && (
                            <p className="text-xs text-gray-400 mt-1">
                              SKU: {item.sku}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-4 md:col-span-2 text-center">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(price)}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-4 md:col-span-2 flex items-center justify-center gap-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product_id,
                              item.quantity - 1,
                            )
                          }
                          disabled={isUpdating || item.quantity <= 1}
                          className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-white disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product_id,
                              item.quantity + 1,
                            )
                          }
                          disabled={isUpdating}
                          className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-white disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total + Remove */}
                      <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(lineTotal)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          disabled={isUpdating}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping */}
              <div className="mt-4">
                <Link
                  href="/"
                  className="text-sm text-[#1D349A] hover:underline font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white border border-gray-200 p-6 sticky top-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({itemCount})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="flex justify-between font-bold text-gray-900 text-lg">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full mt-6 bg-[#1D349A] text-white text-center py-3 font-semibold text-sm hover:bg-[#004f73] transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
