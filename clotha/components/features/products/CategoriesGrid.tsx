import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
    {
        name: "New Arrivals",
        count: "42 items",
        href: "/new",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
        wide: true,
    },
    {
        name: "Men's",
        count: "128 items",
        href: "/men",
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80",
        wide: false,
    },
    {
        name: "Women's",
        count: "215 items",
        href: "/women",
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80",
        wide: false,
    },
    {
        name: "Accessories",
        count: "56 items",
        href: "/accessories",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
        wide: false,
    },
    {
        name: "Sale",
        count: "Up to 50% off",
        href: "/sale",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
        wide: false,
        badge: "SALE",
    },
];

export function CategoriesGrid() {
    return (
        <section className="section-pad bg-[#fafaf8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a96e] mb-3">
                            Browse
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                            Shop by Category
                        </h2>
                    </div>
                    <Link
                        href="/all"
                        className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors group"
                    >
                        View all
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {/* Wide card */}
                    <Link
                        href={CATEGORIES[0].href}
                        className="group relative col-span-2 row-span-2 rounded-2xl overflow-hidden aspect-4/3 md:aspect-auto min-h-[320px] card-lift"
                    >
                        <img
                            src={CATEGORIES[0].image}
                            alt={CATEGORIES[0].name}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <p className="text-xs uppercase tracking-widest text-white/70 mb-1">
                                {CATEGORIES[0].count}
                            </p>
                            <h3 className="font-display text-3xl font-bold">
                                {CATEGORIES[0].name}
                            </h3>
                            <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium bg-white text-black px-4 py-2 rounded-full group-hover:bg-[#c8a96e] group-hover:text-white transition-all duration-300">
                                Shop now <ArrowRight className="w-3 h-3" />
                            </span>
                        </div>
                    </Link>

                    {/* Smaller cards */}
                    {CATEGORIES.slice(1).map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group relative rounded-2xl overflow-hidden aspect-square card-lift"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
                            {cat.badge && (
                                <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                                    {cat.badge}
                                </span>
                            )}
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5">
                                    {cat.count}
                                </p>
                                <h3 className="font-display text-xl font-bold">{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
