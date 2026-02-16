import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#1a1a1a]">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 select-none">
                <Image
                    src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2574&auto=format&fit=crop"
                    alt="Luxury Skincare"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 text-center text-white pt-20">
                <span className="inline-block mb-4 text-xs font-dm-sans font-bold tracking-[0.3em] uppercase opacity-80 animate-fade-in delay-200">
                    Est. 2024 · Nairobi
                </span>

                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] mb-8 mix-blend-difference animate-slide-up delay-300">
                    Pure <span className="italic text-[#C6A87C]">Form</span> <br />
                    & Ritual
                </h1>

                <p className="max-w-md mx-auto text-sm md:text-base font-dm-sans font-light tracking-wide opacity-80 mb-12 animate-slide-up delay-500">
                    Discover a curated collection of nature's most potent botanicals,
                    crafted for the modern purist. Experience beauty in its most essential form.
                </p>

                <div className="flex items-center justify-center animate-fade-in delay-700">
                    <Link
                        href="/search"
                        className="group relative px-8 py-3 overflow-hidden rounded-full bg-white text-black transition-all hover:bg-[#C6A87C] hover:text-white"
                    >
                        <span className="relative z-10 text-xs font-bold uppercase tracking-widest">Shop Collection</span>
                    </Link>
                </div>
            </div>

            {/* Floating Elements / Marquee */}
            <div className="absolute bottom-0 left-0 w-full border-t border-white/10 py-4 bg-black/20 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center gap-12 whitespace-nowrap animate-marquee opacity-70">
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="flex items-center gap-4 text-xs font-dm-sans uppercase tracking-[0.2em] text-white/60">
                            <span>Organic Ingredients</span>
                            <span className="h-1 w-1 rounded-full bg-[#C6A87C]" />
                            <span>Cruelty Free</span>
                            <span className="h-1 w-1 rounded-full bg-[#C6A87C]" />
                            <span>Sustainable Packaging</span>
                            <span className="h-1 w-1 rounded-full bg-[#C6A87C]" />
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
