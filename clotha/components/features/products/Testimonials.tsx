const TESTIMONIALS = [
    {
        name: "Sofia M.",
        location: "New York",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        review:
            "Absolutely love the quality. The merino sweater is incredibly soft and the fit is perfect. My new favourite brand.",
        product: "Oversized Merino Sweater",
        rating: 5,
    },
    {
        name: "James K.",
        location: "London",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        review:
            "The denim jacket is exactly as described — great quality and looks even better in person. Sizing was spot on.",
        product: "Vintage Wash Denim Jacket",
        rating: 5,
    },
    {
        name: "Aisha T.",
        location: "Paris",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        review:
            "Finally found a brand that actually cares about sustainability. Packaging was minimal and the fabric is divine.",
        product: "Silk Bias Cut Midi Dress",
        rating: 5,
    },
];

function StarFill({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-[#c8a96e] text-[#c8a96e]" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
}

export function Testimonials() {
    return (
        <section className="section-pad bg-[#fafaf8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-14">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a96e] mb-3">
                        Reviews
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
                        What Our Customers Say
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                        <div
                            key={t.name}
                            className="bg-white rounded-2xl p-8 border border-neutral-100 card-lift flex flex-col gap-5"
                        >
                            <StarFill count={t.rating} />
                            <blockquote className="text-neutral-700 text-sm leading-relaxed flex-1">
                                &ldquo;{t.review}&rdquo;
                            </blockquote>
                            <div className="border-t border-neutral-100 pt-5 flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#e8d5b0]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-neutral-900">{t.name}</p>
                                    <p className="text-xs text-neutral-400">{t.location}</p>
                                </div>
                                <p className="ml-auto text-[10px] text-[#c8a96e] font-medium text-right max-w-[80px]">
                                    {t.product}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social proof bar */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
                    {[
                        { n: "4.9 / 5", label: "Average Rating" },
                        { n: "12,000+", label: "Reviews" },
                        { n: "98%", label: "Would recommend" },
                    ].map(({ n, label }) => (
                        <div key={label} className="flex flex-col gap-1">
                            <span className="font-display text-3xl font-bold text-neutral-900">{n}</span>
                            <span className="text-xs text-neutral-500 uppercase tracking-widest">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
