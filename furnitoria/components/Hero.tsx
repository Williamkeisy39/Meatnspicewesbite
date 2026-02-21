
"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-secondary/30">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                    alt="Modern Living Room"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent sm:bg-gradient-to-t sm:from-black/20 sm:to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center md:items-end justify-between h-full pb-20 md:pb-32">
                <div className="flex flex-col gap-6 max-w-2xl text-center md:text-left mt-32 md:mt-0">
                    <div className="inline-flex items-center gap-2 self-center md:self-start bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        New Collection 2026
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-sm leading-[1.1]">
                        Designed for <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 italic font-serif">Living.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/90 max-w-lg mx-auto md:mx-0 font-light leading-relaxed drop-shadow-md">
                        Discover a curated collection of furniture that blends timeless elegance with modern comfort.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
                        <button className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:bg-gray-100 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2">
                            <span className="z-10">Shop Now</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm active:scale-95">
                            View Catalog
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs text-white/70 uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
            </div>
        </section>
    );
}
