"use client";

import Link from "next/link";
import { ShoppingCart, Menu, PackageSearch, X, Search } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { itemCount, toggleCart } = useCartContext();
  const { storeName, storeLogo } = useStore();
  const router = useRouter();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchQ,     setSearchQ]     = useState("");
  const [isVisible,   setIsVisible]   = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
    else router.push("/search?q=");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    setIsVisible(true);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Main Navbar ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-[#2a2a2a]"
            : "bg-[#0a0a0a] border-b border-[#2a2a2a]"
        } ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          {/* ── Left: hamburger + logo ── */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-neutral-400 hover:text-white transition-all duration-300 hover:scale-110"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white hover:opacity-80 transition-all duration-300 group"
            >
              {storeLogo ? (
                <img src={storeLogo} alt={storeName} className="h-8 w-auto object-contain" />
              ) : (
                <span className="group-hover:gradient-text transition-all duration-300">{storeName}<span className="text-[#c8a96e]">.</span></span>
              )}
            </Link>
          </div>

          {/* ── Centre: search bar ── */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center border border-[#2a2a2a] bg-[#141414] overflow-hidden mx-auto hover:border-[#3a3a3a] focus-within:border-[#c8a96e]/50 transition-all duration-300 group">
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-white placeholder-[#6b6b6b]"
            />
            <button type="submit" className="px-4 py-2.5 bg-[#c8a96e] hover:bg-[#d4b87a] flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105">
              <Search className="w-4 h-4 text-black" />
            </button>
          </form>

          {/* ── Right: Track Order + Cart (outlined buttons) ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 border border-[#2a2a2a] text-sm font-medium text-neutral-300 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300 hover:-translate-y-0.5"
            >
              <PackageSearch className="w-4 h-4" />
              Track Order
            </Link>
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#2a2a2a] text-sm font-medium text-neutral-300 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-300 hover:-translate-y-0.5 relative group"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#c8a96e] text-black text-[10px] font-bold flex items-center justify-center animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 flex animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-80 bg-[#0a0a0a] h-full shadow-2xl shadow-black flex flex-col p-8 gap-8 animate-slide-in-right border-r border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold text-white">
                {storeName}<span className="text-[#c8a96e]">.</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-[#1a1a1a] transition-colors">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            {/* Mobile search */}
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="flex items-center border border-[#2a2a2a] bg-[#141414] overflow-hidden focus-within:border-[#c8a96e]/50 transition-colors">
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 text-sm outline-none bg-transparent text-white placeholder-[#6b6b6b]"
              />
              <button type="submit" className="px-4 py-3 bg-[#c8a96e] flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-black" />
              </button>
            </form>

            <nav className="flex flex-col gap-2">
              <Link
                href="/search?q="
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-neutral-300 hover:text-white hover:bg-[#1a1a1a] p-4 transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a96e]"
              >
                Shop All
              </Link>
              <Link
                href="/track"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-neutral-300 hover:text-white hover:bg-[#1a1a1a] p-4 transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a96e]"
              >
                Track Order
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
