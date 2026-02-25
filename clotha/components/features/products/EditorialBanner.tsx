import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EditorialBanner() {
    return (
        <section className="section-pad bg-[#0f0f0f]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {/* Left — tall card */}
                    <Link
                        href="/women"
                        className="group relative rounded-3xl overflow-hidden aspect-3/4 md:aspect-auto md:min-h-[560px] block card-lift"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85"
                            alt="Women's collection"
                            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
                                Women's
                            </p>
                            <h3 className="font-display text-4xl font-bold leading-tight mb-4">
                                Effortless
                                <br />Sophistication
                            </h3>
                            <span className="inline-flex items-center gap-2 text-sm font-semibold border border-white/40 px-5 py-2.5 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                                Shop Women's <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </Link>

                    {/* Right — two stacked cards */}
                    <div className="flex flex-col gap-4 md:gap-6">
                        <Link
                            href="/men"
                            className="group relative rounded-3xl overflow-hidden flex-1 min-h-[240px] md:min-h-0 block card-lift"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85"
                                alt="Men's collection"
                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Men's</p>
                                <h3 className="font-display text-2xl font-bold mb-3">
                                    Modern Classics
                                </h3>
                                <span className="inline-flex items-center gap-2 text-xs font-semibold border border-white/40 px-4 py-2 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    Shop Men's <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </Link>

                        <Link
                            href="/accessories"
                            className="group relative rounded-3xl overflow-hidden flex-1 min-h-[240px] md:min-h-0 block card-lift"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85"
                                alt="Accessories"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-xs uppercase tracking-widest text-white/60 mb-1">
                                    Accessories
                                </p>
                                <h3 className="font-display text-2xl font-bold mb-3">
                                    The Details Matter
                                </h3>
                                <span className="inline-flex items-center gap-2 text-xs font-semibold border border-white/40 px-4 py-2 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    Explore <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
