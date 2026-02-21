import { ProductCard } from "./ProductCard";
import { Product } from "@/store/useCartStore";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

const TRENDING: (Product & { badge?: string; badgeColor?: "gold" | "red" | "green" })[] = [
    {
        id: "t1",
        name: "Vintage Wash Denim Jacket",
        price: 148.00,
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80",
        category: "Outerwear",
        description: "Classic denim jacket with vintage character.",
        badge: "Trending",
        badgeColor: "red",
    },
    {
        id: "t2",
        name: "Essential White Tee",
        price: 42.00,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        category: "Men's Tops",
        description: "100% organic cotton, a wardrobe staple.",
        badge: "500+ sold",
        badgeColor: "green",
    },
    {
        id: "t3",
        name: "Silk Bias Cut Midi Dress",
        price: 225.00,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
        category: "Women's Dresses",
        description: "Flowing silk with elegant bias-cut silhouette.",
        badge: "New",
        badgeColor: "gold",
    },
    {
        id: "t4",
        name: "Wide-Leg Linen Pants",
        price: 95.00,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        category: "Women's Bottoms",
        description: "Relaxed wide-leg silhouette in pure linen.",
    },
    {
        id: "t5",
        name: "Leather Chelsea Boots",
        price: 310.00,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
        category: "Footwear",
        description: "Hand-crafted full-grain leather Chelsea boots.",
        badge: "Bestseller",
        badgeColor: "green",
    },
    {
        id: "t6",
        name: "Structured Blazer",
        price: 198.00,
        image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=800&q=80",
        category: "Outerwear",
        description: "Tailored single-button blazer in premium wool.",
        badge: "Trending",
        badgeColor: "red",
    },
];

export function TrendingProducts() {
    return (
        <section className="section-pad bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a96e] mb-3 flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5" /> Trending Now
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
                            Most Loved
                        </h2>
                        <p className="mt-3 text-neutral-500 text-sm max-w-md leading-relaxed">
                            Our community&apos;s favourite picks, week after week.
                        </p>
                    </div>
                    <Link
                        href="/trending"
                        className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[#c8a96e] transition-colors group"
                    >
                        See all
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Grid — 2 cols mobile, 3 cols desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
                    {TRENDING.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            badge={p.badge}
                            badgeColor={p.badgeColor}
                        />
                    ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-10 text-center sm:hidden">
                    <Link
                        href="/trending"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm font-semibold"
                    >
                        See All Trending <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
