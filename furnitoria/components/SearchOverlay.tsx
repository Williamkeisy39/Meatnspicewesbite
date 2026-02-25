
"use client";

import { useState, useEffect } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

import { useRouter } from "next/navigation";
const recentSearches = ["Velvet Sofa", "Oak Dining Table", "Minimalist Lamp", "Floor Mirror"];
const trendingSearches = ["Leather Armchair", "Marble Coffee Table", "Boucle Chair", "Rattan Bed Frame"];




export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (!query.trim()) return;
        onClose();
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-60 flex flex-col bg-background/95 backdrop-blur-xl">
                    {/* Header / Input Area */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center gap-4 p-6 border-b border-white/10"
                    >
                        <Search className="w-6 h-6 text-muted-foreground" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search thousands of products..."
                            className="flex-1 bg-transparent text-2xl md:text-4xl font-light placeholder:text-muted-foreground/50 focus:outline-none text-foreground font-serif"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                        >
                            <X className="w-6 h-6 text-foreground" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 overflow-y-auto p-6 md:p-12 container mx-auto max-w-5xl"
                    >
                        {/* Suggested / Empty State */}
                        {!query ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                                {/* Recent */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Recent Searches
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {recentSearches.map((term, i) => (
                                            <button key={i} className="text-left text-lg hover:text-accent transition-colors py-2 border-b border-dashed border-white/10 flex justify-between group">
                                                {term}
                                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Trending */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" /> Trending
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {trendingSearches.map((term, i) => (
                                            <button key={i} className="px-4 py-2 rounded-full bg-secondary/30 hover:bg-accent hover:text-white transition-colors text-sm font-medium">
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Search Results Placeholder */
                            <div className="text-center py-20">
                                <p className="text-lg text-muted-foreground">Searching for <span className="text-foreground font-semibold">"{query}"</span>...</p>
                                {/* In a real app, render results grid here */}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
