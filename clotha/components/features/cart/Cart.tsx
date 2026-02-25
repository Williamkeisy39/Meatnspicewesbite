"use client";

import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import Link from "next/link";

export function Cart() {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity } = useCartContext();

  const items = cart?.items ?? [];
  const total = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={toggleCart}
      />

      {/* Cart Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[420px] bg-[#0a0a0a] shadow-2xl shadow-black flex flex-col border-l border-[#2a2a2a] animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2a2a2a] flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-3 text-white">
            <ShoppingBag className="w-5 h-5 text-[#c8a96e]" />
            Your Cart <span className="text-[#c8a96e]">({items.length})</span>
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 -mr-2 text-neutral-500 hover:text-white transition-colors hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 || !cart ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-20 h-20 bg-[#141414] border border-[#2a2a2a] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-neutral-600" />
              </div>
              <div>
                <p className="text-white font-medium text-lg">Your cart is empty</p>
                <p className="text-neutral-500 text-sm mt-2">
                  Looks like you haven&apos;t added anything yet.
                </p>
              </div>
              <button
                onClick={toggleCart}
                className="mt-4 px-8 py-3 bg-[#c8a96e] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#d4b87a] transition-all duration-300 flex items-center gap-2 group"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <div 
                  key={item.product_id} 
                  className="flex gap-4 p-3 bg-[#141414] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative w-20 h-24 bg-[#0a0a0a] overflow-hidden shrink-0">
                    <Image
                      src={item.product_image ?? ""}
                      alt={item.product_name ?? ""}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-medium text-white line-clamp-1">
                          {item.product_name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-neutral-500 hover:text-red-500 transition-colors p-1 hover:bg-[#2a2a2a]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#2a2a2a]">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              Math.max(0, item.quantity - 1),
                            )
                          }
                          className="p-2 hover:bg-[#2a2a2a] transition-colors text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-[#2a2a2a] transition-colors text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-semibold text-sm text-[#c8a96e]">
                        ${((item.price ?? 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#2a2a2a] p-6 bg-[#141414] space-y-4">
            <div className="flex items-center justify-between text-base font-medium">
              <p className="text-neutral-400">Subtotal</p>
              <p className="text-white text-xl">${(cart?.total ?? total).toFixed(2)}</p>
            </div>
            <p className="text-sm text-neutral-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/checkout"
                onClick={toggleCart}
                className="group flex items-center justify-center w-full bg-[#c8a96e] px-6 py-4 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#d4b87a] transition-all duration-300"
              >
                Checkout
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={toggleCart}
                className="w-full py-3 border border-[#2a2a2a] text-neutral-400 text-sm hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
