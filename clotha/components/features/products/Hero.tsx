import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full min-h-[92vh] flex items-end overflow-hidden bg-[#0f0f0f]">
      {/* ── Full-bleed background image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=85")',
        }}
      >
        {/* layered gradients for readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-20 md:pb-28 pt-24">
        <div className="max-w-2xl space-y-7">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 opacity-0 animate-fade-up delay-100"
            style={{ animationFillMode: "forwards" }}
          >
            <Sparkles className="w-3 h-3 text-[#c8a96e]" />
            <p className="text-[#c8a96e] text-[11px] font-semibold uppercase tracking-[0.25em]">
              New Collection · Spring / Summer 2026
            </p>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] opacity-0 animate-fade-up delay-200"
            style={{ animationFillMode: "forwards" }}
          >
            Elevate
            <br />
            Your
            <br />
            <span className="text-[#c8a96e]">Everyday</span>
          </h1>

          {/* Sub-copy */}
          <p
            className="text-neutral-300 text-base md:text-lg max-w-sm leading-relaxed opacity-0 animate-fade-up delay-300"
            style={{ animationFillMode: "forwards" }}
          >
            Premium basics crafted from sustainable materials.
            Designed to last a lifetime, made for everyday wear.
          </p>

          {/* CTA row */}
          <div
            className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-up delay-400"
            style={{ animationFillMode: "forwards" }}
          >
            <Link
              href="/new"
              className="group inline-flex items-center justify-center gap-3 bg-white text-black px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-[#c8a96e] hover:text-white transition-all duration-300 shadow-lg shadow-black/20"
            >
              Shop New Arrivals
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/collection"
              className="inline-flex items-center justify-center gap-3 border border-white/40 text-white px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              View Collection
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="flex gap-8 pt-2 opacity-0 animate-fade-up delay-500"
            style={{ animationFillMode: "forwards" }}
          >
            {[
              { n: "200+", label: "Styles" },
              { n: "50k+", label: "Happy Customers" },
              { n: "100%", label: "Sustainable" },
            ].map(({ n, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <p className="font-display text-2xl font-bold text-white">{n}</p>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Thumbnail strip (right side, desktop) ── */}
      <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
        {[
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=75",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=75",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&q=75",
        ].map((src, i) => (
          <div
            key={i}
            className="w-20 h-28 rounded-2xl overflow-hidden border-2 border-white/15 cursor-pointer hover:border-[#c8a96e] hover:scale-105 transition-all duration-300 shadow-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Look ${i + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/30">
        <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
