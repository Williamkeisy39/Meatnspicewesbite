"use client";

import { ChevronDown, ChevronRight, Grid3x3 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/lib/hooks";

export function NavBar() {
    const [showCategories, setShowCategories] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { data: categories = [] } = useCategories({ is_active: "true" });

    const navLinks = useMemo(() => {
        const links = [
            { name: "Home", href: "/" },
            { name: "Shop All", href: "/search" },
        ];
        categories.slice(0, 4).forEach((cat) => {
            links.push({ name: cat.name, href: `/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}` });
        });
        return links;
    }, [categories]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCategories(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-white border-b border-border relative z-40">
            <div className="container flex items-center justify-between h-[50px]">

                {/* Browse Categories - Dropdown Trigger */}
                <div className="relative h-full" ref={dropdownRef}>
                    <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="h-full flex items-center bg-primary px-6 cursor-pointer hover:bg-accent transition-colors min-w-[240px] shadow-md -mt-px"
                    >
                        <Grid3x3 size={16} strokeWidth={2.5} className="mr-3 text-white/80" />
                        <span className="font-extrabold uppercase tracking-wide text-[13px] text-white">Browse Categories</span>
                        <ChevronDown size={14} className={`ml-auto text-white/60 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {showCategories && (
                        <div className="absolute top-full left-0 w-[280px] bg-white shadow-elevated border border-border mt-2 py-2 z-50 animate-fade-in-up">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                                    onClick={() => setShowCategories(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:text-secondary hover:bg-secondary/5 transition-all group"
                                >
                                    <span>{cat.name}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-secondary transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="hidden lg:flex items-center h-full ml-6 gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]) && link.href !== "/search");
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`h-full flex items-center px-4 text-[13px] font-bold relative transition-all group ${isActive ? 'text-secondary' : 'text-gray-600 hover:text-secondary'}`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-secondary"></span>
                                )}
                                {!isActive && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-secondary group-hover:w-5 transition-all duration-300"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

            </div>
        </div>
    );
}
