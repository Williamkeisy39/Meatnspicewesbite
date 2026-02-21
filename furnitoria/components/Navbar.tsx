
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShoppingBag, Menu, X, Rocket, Search } from "lucide-react";
import { navigation } from "@/lib/data";
import SearchOverlay from "./SearchOverlay";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
                    scrolled
                        ? "bg-background/80 backdrop-blur-md border-border/40 py-3 shadow-sm"
                        : "bg-transparent py-6"
                )}
            >
                <div className="container mx-auto flex items-center justify-between px-6 md:px-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 z-50 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:bg-accent transition-colors font-serif">
                            F
                        </div>
                        <span className={cn(
                            "text-2xl font-bold tracking-tight transition-colors font-serif",
                            scrolled ? "text-foreground" : "text-foreground mix-blend-difference"
                        )}>
                            Furnitoria
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium tracking-wide transition-colors hover:text-accent",
                                    scrolled ? "text-foreground/80" : "text-foreground/90"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={cn(
                                "p-2 hover:bg-secondary/50 rounded-full transition-all",
                                scrolled ? "text-foreground" : "text-foreground"
                            )}>
                            <Search className="w-5 h-5" />
                        </button>
                        <button className={cn(
                            "relative group p-2 hover:bg-secondary/50 rounded-full transition-all",
                            scrolled ? "text-foreground" : "text-foreground"
                        )}>
                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                        </button>
                        <button className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg active:scale-95 flex items-center gap-2">
                            Sign In
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-foreground"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <button
                            className="p-2 z-50 text-foreground"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {mobileMenuOpen && (
                        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-3xl font-serif font-medium text-foreground hover:text-accent"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <button className="mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground text-lg font-medium hover:bg-primary/90 w-auto">
                                Sign In
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Navbar;
