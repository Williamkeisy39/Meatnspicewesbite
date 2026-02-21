"use client";

const ITEMS = [
    "Free Shipping on $80+",
    "Sustainably Sourced",
    "Ethically Made",
    "Premium Quality Basics",
    "New Arrivals Every Week",
    "30-Day Free Returns",
    "Carbon Neutral Shipping",
    "SSL Secure Checkout",
];

export function MarqueeStrip() {
    const doubled = [...ITEMS, ...ITEMS];
    return (
        <div className="w-full bg-[#c8a96e] py-3.5 overflow-hidden select-none">
            <div className="marquee-inner">
                <div className="marquee-track animate-marquee">
                    {doubled.map((item, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-5 text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8"
                        >
                            <span className="text-white/50 text-[8px]">✦</span>
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
