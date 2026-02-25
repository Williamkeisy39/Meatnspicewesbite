"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubmitted(true);
    };

    return (
        <section className="relative overflow-hidden bg-[#0f0f0f] py-24">
            {/* BG image overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=70")',
                }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-[#0f0f0f] via-[#0f0f0f]/90 to-[#1a1208]" />

            <div className="relative max-w-3xl mx-auto px-6 text-center">
                <p className="text-[#c8a96e] text-xs font-semibold uppercase tracking-[0.3em] mb-5">
                    Join the Club
                </p>
                <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
                    Stay Ahead
                    <br />
                    of the Trend
                </h2>
                <p className="text-neutral-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    Subscribe for early access to new drops, exclusive member discounts,
                    and style inspiration — delivered straight to your inbox.
                </p>

                {submitted ? (
                    <div className="flex items-center justify-center gap-3 text-[#c8a96e]">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-semibold text-lg">You&apos;re on the list!</span>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="flex-1 bg-white/10 text-white placeholder:text-neutral-500 border border-white/20 rounded-full px-6 py-4 text-sm outline-none focus:border-[#c8a96e] transition-colors"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 bg-[#c8a96e] text-white rounded-full px-8 py-4 text-sm font-semibold hover:bg-[#a0834a] transition-colors"
                        >
                            Subscribe <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                )}

                <p className="mt-5 text-xs text-neutral-600">
                    No spam, ever. Unsubscribe anytime.
                </p>
            </div>
        </section>
    );
}
