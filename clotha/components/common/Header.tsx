"use client";

import Link from "next/link";
import {
    Search, ShoppingCart, ChevronDown, LayoutGrid, PackageSearch,
} from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCategories } from "@/lib/hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SHOP_CATEGORIES = [
    "Best Sellers",
    "Trending This Week",
    "Back In Stock",
    "New Arrivals",
    "Men's Clothings",
    "Women's Clothings",
    "Shoes & Accessories",
    "Easy Outfit",
    "Back To Work Wear",
    "The Gift Shop",
    "The Premium Weight Tee",
];

const NAV_LINKS = [
    { label: "NEW ARRIVALS", href: "/search?q=" },
    { label: "SALE", href: "/search?q=sale" },
    { label: "TRACK ORDER", href: "/track" },
    { label: "CHECKOUT", href: "/checkout" },
];

export function Header() {
    const { itemCount, toggleCart } = useCartContext();
    const { data: categories = [] } = useCategories();
    const [catOpen, setCatOpen] = useState(false);
    const [searchQ, setSearchQ] = useState("");
    const router = useRouter();

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (searchQ.trim()) router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">

            {/* ── Logo | Search (centered) | Icons ── */}
            <div className="max-w-[1280px] mx-auto px-5 h-16 grid grid-cols-3 items-center gap-4">

                {/* Col 1 — Logo (left) */}
                <Link href="/" className="font-extrabold text-2xl tracking-tight text-gray-900 font-(family-name:--font-display)">
                    Megastore
                </Link>

                {/* Col 2 — Search bar (center) */}
                <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded overflow-hidden w-full">
                    <select className="text-xs px-3 py-2.5 border-r border-gray-200 outline-none bg-white text-gray-500 shrink-0">
                        <option>All Categories</option>
                        <option>Men&apos;s</option>
                        <option>Women&apos;s</option>
                        <option>Accessories</option>
                        <option>Shoes</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                        className="flex-1 px-3 py-2.5 text-sm outline-none text-gray-900 bg-white"
                    />
                    <button type="submit" className="px-4 py-2.5 bg-[#8B5E3C] flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4 text-white" />
                    </button>
                </form>

                {/* Col 3 — Icons (right) */}
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:text-[#8B5E3C] transition-colors relative text-gray-700 flex flex-col items-center gap-0.5 group"
                        title="Cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-[9px] font-medium text-gray-400 group-hover:text-[#8B5E3C] transition-colors hidden sm:block">
                            Cart
                        </span>
                        {itemCount > 0 && (
                            <span className="absolute top-0.5 right-0 w-4 h-4 flex items-center justify-center text-white text-[9px] font-bold rounded-full bg-[#8B5E3C]">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Nav row ── */}
            <div className="border-t border-gray-200">
                <div className="max-w-[1280px] mx-auto px-5 flex items-stretch">
                    {/* Category dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setCatOpen((o) => !o)}
                            className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 h-full bg-gray-900 min-w-[200px]"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            SHOP BY CATEGORIES
                            <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${catOpen ? "rotate-180" : ""}`} />
                        </button>

                        {catOpen && (
                            <div className="absolute top-full left-0 w-52 bg-white shadow-lg z-50 border border-gray-200">
                                {(categories.length > 0 ? categories : SHOP_CATEGORIES.map((name) => ({ id: name, name, slug: name }))).map((cat) => (
                                    <Link
                                        key={typeof cat === "string" ? cat : cat.id}
                                        href={`/search?q=${encodeURIComponent(typeof cat === "string" ? cat : cat.name)}`}
                                        onClick={() => setCatOpen(false)}
                                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-50"
                                    >
                                        {typeof cat === "string" ? cat : cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Nav links */}
                    <nav className="flex items-center">
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.label}
                                href={l.href}
                                className="px-5 py-3 text-sm font-semibold transition-colors hover:text-[#8B5E3C] text-gray-900"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
