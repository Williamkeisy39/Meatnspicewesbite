import Link from "next/link";
import Image from "next/image";
import { Button } from "../../common/Button";

interface PromoSectionProps {
    variant: "primary" | "secondary";
}

export default function PromoSection({ variant }: PromoSectionProps) {
    if (variant === "primary") {
        return (
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1600&q=80"
                        alt="Ritual Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
                    <span className="block text-xs font-dm-sans font-bold tracking-[0.3em] uppercase mb-6 animate-fade-in">
                        Limited Edition
                    </span>
                    <h2 className="text-5xl md:text-7xl font-serif leading-tight mb-8 animate-slide-up delay-200">
                        The Gold Standard <br /> of Hydration
                    </h2>
                    <p className="text-lg font-light opacity-90 mb-10 max-w-xl mx-auto animate-slide-up delay-300">
                        Infused with 24k gold flakes and rare botanical oils, our new serum redefines luminosity.
                    </p>
                    <Link href="/search?category=serums">
                        <button className="px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#C6A87C] hover:text-white transition-colors animate-scale-image delay-500">
                            Shop The Collection
                        </button>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-[#F5F3EF]">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="w-full lg:w-1/2 relative h-[600px]">
                        <div className="absolute inset-0 bg-gray-200 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80"
                                alt="Serum Detail"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                            />
                        </div>
                        {/* Decorative Offset Border */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full border border-black/10 -z-10" />
                    </div>

                    <div className="w-full lg:w-1/2 space-y-8">
                        <span className="text-xs font-bold text-[#C6A87C] uppercase tracking-[0.2em]">
                            Our Philosophy
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-black leading-tight">
                            Beauty that goes <br /> beyond the surface.
                        </h2>
                        <div className="space-y-6 text-gray-600 font-light leading-relaxed">
                            <p>
                                We believe in the power of intention. Every ingredient is chosen not just for its efficacy, but for its source. Sustainable, ethical, and pure.
                            </p>
                            <p>
                                Our formulas are free from parabens, sulfates, and synthetic fragrances. Just clean, potent botanicals that work in harmony with your skin.
                            </p>
                        </div>

                        <div className="pt-8">
                            <Link href="/about" className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#C6A87C] hover:border-[#C6A87C] transition-colors">
                                <span>Read Our Story</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
