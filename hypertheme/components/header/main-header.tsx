"use client";

import Link from "next/link";
import { Search, MapPin, ShoppingCart, Truck } from "lucide-react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";

export function MainHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { itemCount } = useCartContext();
  const { storeName, storeLogo } = useStore();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white py-4 border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8 lg:px-32 grid grid-cols-2 md:grid-cols-3 items-center gap-4 md:gap-8">
        {/* Logo - Left */}
        <Link href="/" className="flex-shrink-0 justify-self-start">
          {storeLogo ? (
            <img
              src={storeLogo}
              alt={storeName}
              className="h-8 w-auto"
            />
          ) : (
            <div className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              {storeName}
            </div>
          )}
        </Link>

        {/* Search Bar - Center (hidden on mobile) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:block w-full max-w-xl justify-self-center"
        >
          <div className="flex w-full items-center bg-gray-100 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-[#1D349A] focus-within:bg-white transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 px-4 py-3 outline-none text-sm bg-transparent placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-5 py-3 text-gray-500 hover:text-[#1D349A] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Icons - Right */}
        <div className="flex items-center gap-4 md:gap-6 text-slate-700 justify-self-end">
          {/* Mobile Search Icon */}
          <Link
            href="/search"
            className="md:hidden flex flex-col items-center gap-1 hover:text-[#1D349A] transition-colors"
          >
            <Search className="w-6 h-6" />
          </Link>

          {/* Desktop Icons - Hidden on mobile */}
          <Link
            href="/stores"
            className="hidden md:flex flex-col items-center gap-1 hover:text-[#1D349A] transition-colors"
          >
            <MapPin className="w-6 h-6" />
            <span className="text-[10px] font-medium">Store</span>
          </Link>
          <Link
            href="/orders/track"
            className="hidden md:flex flex-col items-center gap-1 hover:text-[#1D349A] transition-colors"
          >
            <Truck className="w-6 h-6" />
            <span className="text-[10px] font-medium">Track Order</span>
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1 hover:text-[#1D349A] transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1D349A] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
            <span className="hidden md:block text-[10px] font-medium">
              Cart
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
