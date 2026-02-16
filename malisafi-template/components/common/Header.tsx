"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCartDrawer } from "../context/CartDrawerContext";
import { useStore } from "@/lib/providers/store-provider";
import { useCategories } from "@/lib/hooks";

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const { itemCount } = useCartContext();
    const { toggleCart } = useCartDrawer();
    const { storeName } = useStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: categories = [] } = useCategories({ is_active: "true" });

    const navLinks = useMemo(() => {
        const links = [{ name: "Shop All", href: "/search" }];
        categories.slice(0, 4).forEach((cat) => {
            links.push({ name: cat.name, href: `/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}` });
        });
        return links;
    }, [categories]);

    // Determine text color based on page and scroll state
    // If not home page, ALWAYS black. If home page, white unless scrolled.
    const isHomePage = pathname === "/";
    const isDarkText = !isHomePage || scrolled;
    const textColor = isDarkText ? "text-black" : "text-white";
    const hoverColor = isDarkText ? "hover:text-gray-600" : "hover:text-white/80";
    const borderColor = isDarkText ? "border-gray-200" : "border-transparent";
    const logoColor = isDarkText ? "text-black" : "text-white";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isDarkText
                    ? "bg-white/95 backdrop-blur-md py-4 border-b border-gray-200"
                    : "bg-transparent py-8"
                    }`}
            >
                <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 -ml-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className={`w-6 h-0.5 mb-1.5 transition-colors ${isDarkText ? 'bg-black' : 'bg-white'}`}></div>
                        <div className={`w-6 h-0.5 transition-colors ${isDarkText ? 'bg-black' : 'bg-white'}`}></div>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.slice(0, Math.ceil(navLinks.length / 2)).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-xs font-dm-sans tracking-widest uppercase font-medium nav-line transition-colors ${textColor} ${hoverColor}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Logo - Centered */}
                    <Link
                        href="/"
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-3xl lg:text-4xl tracking-tight transition-colors duration-500 ${logoColor}`}
                    >
                        {storeName}<span className="text-[#C6A87C]">.</span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.slice(Math.ceil(navLinks.length / 2)).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-xs font-dm-sans tracking-widest uppercase font-medium nav-line transition-colors ${textColor} ${hoverColor}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link href="/search" aria-label="Search">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`transition-colors ${textColor}`}
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </Link>

                            <button
                                onClick={toggleCart}
                                className="relative group"
                                aria-label="Cart"
                            >
                                <span className={`text-xs font-medium uppercase tracking-widest hidden md:inline-block mr-2 transition-colors ${textColor}`}>
                                    Cart
                                </span>
                                <span className={`align-middle transition-colors ${textColor}`}>
                                    ({itemCount})
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-white z-[60] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <span className="font-serif text-2xl text-black">{storeName}.</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-6 text-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-3xl font-serif text-black hover:text-[#C6A87C] transition-colors"
                                style={{ fontFamily: "var(--font-cormorant)" }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto text-center space-y-4">
                        <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase tracking-widest text-gray-500">
                            Cart ({itemCount})
                        </Link>
                        <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase tracking-widest text-gray-500">
                            Search
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
