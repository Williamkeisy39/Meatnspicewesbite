"use client";

import { ShoppingBag, Search, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/providers/store-provider";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useCategories } from "@/lib/hooks";
import type { Category } from "@/lib/catalog/types";

export function MainHeader() {
    const { storeName, formatPrice } = useStore();
    const { itemCount, cart } = useCartContext();
    const { toggleCart } = useCartDrawer();
    const [searchQuery, setSearchQuery] = useState("");
    const [moreOpen, setMoreOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { data: categories = [] } = useCategories({ is_active: "true" });

    const visibleCategories = categories.slice(0, 4);
    const overflowCategories = categories.slice(4);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileSearchOpen(false);
            setMobileMenuOpen(false);
        }
    };

    const closeMobile = () => {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
            <div className="container flex items-center justify-between gap-4 h-14">

                {/* Logo */}
                <Link href="/" className="flex-shrink-0 group flex items-center gap-2 min-w-fit">
                    <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-border group-hover:scale-105 transition-transform bg-white">
                        <Image
                            src="/meatnspiceicon.png"
                            alt={storeName}
                            fill
                            className="object-cover"
                            sizes="32px"
                        />
                    </div>
                    <span className="text-base font-bold text-gray-900 tracking-tight">{storeName}</span>
                </Link>

                {/* Nav Links */}
                <nav className="hidden lg:flex items-center gap-0.5">
                    <Link href="/" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg transition-colors">
                        Home
                    </Link>
                    <Link href="/search" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg transition-colors">
                        Shop
                    </Link>
                    {visibleCategories.map((cat: Category) => (
                        <Link
                            key={cat.id}
                            href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                    {overflowCategories.length > 0 && (
                        <div className="relative" ref={moreRef}>
                            <button
                                onClick={() => setMoreOpen(!moreOpen)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                            >
                                More <ChevronDown size={14} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                            </button>
                            {moreOpen && (
                                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 animate-fade-in-up">
                                    {overflowCategories.map((cat: Category) => (
                                        <Link
                                            key={cat.id}
                                            href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                                            onClick={() => setMoreOpen(false)}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                {/* Right side: Search + Cart */}
                <div className="flex items-center gap-2">
                    <form onSubmit={handleSearch} className="hidden md:flex">
                        <div className="relative flex items-center w-56 bg-gray-100/70 rounded-lg h-9 focus-within:bg-white focus-within:ring-1 focus-within:ring-secondary/30 transition-all duration-200">
                            <Search size={14} className="ml-3 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 px-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none h-full text-sm"
                            />
                        </div>
                    </form>

                    {/* Mobile search toggle */}
                    <button
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100/70 hover:bg-gray-100 transition-colors"
                        aria-label="Search"
                    >
                        <Search size={16} className="text-gray-600" />
                    </button>

                    <button
                        onClick={toggleCart}
                        className="relative flex items-center gap-2 h-9 pl-3 pr-3.5 rounded-lg bg-gray-100/70 hover:bg-gray-100 transition-colors group"
                    >
                        <ShoppingBag size={18} strokeWidth={2} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                {itemCount}
                            </span>
                        )}
                        <span className="hidden md:inline text-sm font-medium text-gray-600">{formatPrice(cart?.total || 0)}</span>
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100/70 hover:bg-gray-100 transition-colors"
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X size={18} className="text-gray-600" /> : <Menu size={18} className="text-gray-600" />}
                    </button>
                </div>

            </div>

            {/* Mobile search bar */}
            {mobileSearchOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
                    <form onSubmit={handleSearch}>
                        <div className="relative flex items-center bg-gray-100/70 rounded-lg h-10 focus-within:bg-white focus-within:ring-1 focus-within:ring-secondary/30 transition-all">
                            <Search size={16} className="ml-3 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                autoFocus
                                className="flex-1 px-3 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none h-full text-sm"
                            />
                        </div>
                    </form>
                </div>
            )}

            {/* Mobile menu drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-3.5rem)] overflow-y-auto">
                    <nav className="flex flex-col py-2">
                        <Link href="/" onClick={closeMobile} className="px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Home
                        </Link>
                        <Link href="/search" onClick={closeMobile} className="px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Shop All
                        </Link>
                        {categories.length > 0 && (
                            <div className="px-5 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                Categories
                            </div>
                        )}
                        {categories.map((cat: Category) => (
                            <Link
                                key={cat.id}
                                href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                                onClick={closeMobile}
                                className="px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
