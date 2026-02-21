"use client";

import Link from "next/link";
import { ShoppingCart, Menu, User, X, Search } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/search?q=" },
  { label: "Men",         href: "/search?q=men"  },
  { label: "Women",       href: "/search?q=women" },
  { label: "Accessories", href: "/search?q=accessories" },
  { label: "Sale",        href: "/search?q=sale", accent: true },
];

export function Navbar() {
  const { itemCount, toggleCart } = useCartContext();
  const { storeName, storeLogo } = useStore();
  const router = useRouter();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchQ,     setSearchQ]     = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
    else router.push("/search?q=");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Main Navbar ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200"
            : "bg-white border-b border-neutral-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          {/* ── Left: hamburger + logo ── */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 text-neutral-600 hover:text-black transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-black"
            >
              {storeLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={storeLogo} alt={storeName} className="h-8 w-auto object-contain" />
              ) : (
                <span>{storeName}<span className="text-[#c8a96e]">.</span></span>
              )}
            </Link>
          </div>

          {/* ── Centre: search bar ── */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center border border-gray-200 overflow-hidden">
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-sm outline-none bg-white text-gray-900"
            />
            <button type="submit" className="px-3 py-2 bg-black flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* ── Right: desktop nav + icons ── */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-sm font-medium transition-colors group ${
                    l.accent
                      ? "text-red-500 hover:text-red-600"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  {l.label}
                  {!l.accent && (
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button
                className="hidden sm:flex p-2 text-neutral-600 hover:text-black transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={toggleCart}
                className="p-2 text-neutral-600 hover:text-black transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#c8a96e] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-80 bg-white h-full shadow-2xl flex flex-col p-8 gap-8 animate-slide-right">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold">
                {storeName}<span className="text-[#c8a96e]">.</span>
              </span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            {/* Mobile search */}
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="flex items-center border border-gray-200 overflow-hidden">
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-2.5 text-sm outline-none bg-white text-gray-900"
              />
              <button type="submit" className="px-3 py-2.5 bg-black flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-white" />
              </button>
            </form>

            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-medium ${
                    l.accent ? "text-red-500" : "text-neutral-800 hover:text-black"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-8 border-t border-neutral-100">
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>Account</span>
                <User className="w-4 h-4" />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
