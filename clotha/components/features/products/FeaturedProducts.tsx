import { ProductCard } from "./ProductCard";
import { Product } from "@/store/useCartStore";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const NEW_ARRIVALS: (Product & { badge?: string; badgeColor?: "gold" | "red" | "green" })[] = [
  {
    id: "1",
    name: "Relaxed Cotton Linen Shirt",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b36fb?w=800&q=80",
    category: "Men's Tops",
    description: "Breathable linen-cotton blend, relaxed fit.",
    badge: "New",
    badgeColor: "gold",
  },
  {
    id: "2",
    name: "High-Waist Tailored Trousers",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    category: "Women's Bottoms",
    description: "Structured high-waist trousers in a neutral tone.",
    badge: "New",
    badgeColor: "gold",
  },
  {
    id: "3",
    name: "Oversized Merino Sweater",
    price: 145.00,
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80",
    category: "Knitwear",
    description: "Super-soft 100% merino wool in boxy silhouette.",
  },
  {
    id: "4",
    name: "Minimal Leather Tote",
    price: 195.00,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    category: "Accessories",
    description: "Full-grain leather tote with interior pockets.",
    badge: "Bestseller",
    badgeColor: "green",
  },
];

export function FeaturedProducts() {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a96e] mb-3">
              Just Landed
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
              New Arrivals
            </h2>
            <p className="mt-3 text-neutral-500 max-w-md text-sm leading-relaxed">
              The latest additions to our collection — premium basics elevated for 2026.
            </p>
          </div>
          <Link
            href="/new"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[#c8a96e] transition-colors group underline-offset-4 hover:underline"
          >
            Shop all
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {NEW_ARRIVALS.map((p) => (
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
            href="/new"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm font-semibold"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
