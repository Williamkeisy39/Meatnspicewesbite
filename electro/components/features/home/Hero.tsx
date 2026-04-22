"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Sparkles, TrendingUp, Truck, ShieldCheck, Headphones, RotateCcw, Gift } from "lucide-react";
import { useBanners } from "@/lib/hooks";
import { useStore } from "@/lib/providers/store-provider";
import type { Banner } from "@/lib/types/banner";

function MainBanner({ banner }: { banner: Banner }) {
    const hasLink = Boolean(banner.link_url);
    const Wrapper = hasLink ? Link : "div";
    const wrapperProps = hasLink ? { href: banner.link_url } : {};

    return (
        <Wrapper {...(wrapperProps as any)} className="lg:col-span-8 relative overflow-hidden shadow-elevated group block rounded-2xl">
            <div className="absolute inset-0">
                {banner.image_url && (
                    <Image
                        src={banner.image_url}
                        alt={banner.title || "Banner"}
                        fill
                        className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[2000ms]"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-primary/75"></div>
                <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/20 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-10 right-32 w-48 h-48 bg-accent-light/30 blur-[80px] pointer-events-none"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center px-10 lg:px-14 space-y-5 max-w-2xl py-12 min-h-[420px]">
                {banner.title && (
                    <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
                        {banner.title}
                    </h1>
                )}
                {banner.description && (
                    <p className="text-base text-white/70 font-medium max-w-md leading-relaxed">
                        {banner.description}
                    </p>
                )}
                <div className="pt-2">
                    {hasLink ? (
                        <span className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-7 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide shadow-xl shadow-secondary/30 transition-all">
                            Shop Now <ArrowRight size={16} />
                        </span>
                    ) : (
                        <Link
                            href={banner.link_url || "/search"}
                            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-7 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide shadow-xl shadow-secondary/30 transition-all"
                        >
                            Shop Now <ArrowRight size={16} />
                        </Link>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

function PlaceholderMainBanner({ storeName }: { storeName: string }) {
    return (
        <div className="lg:col-span-8 relative overflow-hidden shadow-elevated group block rounded-2xl">
            <div className="absolute inset-0 bg-primary"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/20 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-10 right-32 w-48 h-48 bg-accent-light/30 blur-[80px] pointer-events-none"></div>
            <div className="relative z-10 h-full flex flex-col justify-center px-10 lg:px-14 space-y-5 max-w-2xl py-12 min-h-[420px]">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest shadow-lg w-fit">
                    <Zap size={12} className="text-secondary" fill="currentColor" /> Fresh Today
                </span>
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
                    {storeName}
                </h1>
                <p className="text-base text-white/80 font-semibold max-w-sm leading-relaxed">
                    Meat & Spice delivers fresh packed beef, chicken, pork, fish, sausages, goat.
                </p>
                <div className="flex flex-wrap gap-2 max-w-md">
                    {HERO_CATEGORIES.map((category) => (
                        <span key={category} className="px-3 py-1 text-xs font-bold uppercase tracking-wide bg-white/10 border border-white/20 rounded-full text-white/80">
                            {category}
                        </span>
                    ))}
                </div>
                <div className="pt-2">
                    <Link href="/search" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-7 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide shadow-xl shadow-secondary/30 transition-all">
                        Shop Fresh Cuts <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SideBanner({ banner }: { banner: Banner }) {
    const Wrapper = banner.link_url ? Link : "div";
    const wrapperProps = banner.link_url ? { href: banner.link_url } : {};

    return (
        <Wrapper {...(wrapperProps as any)} className="flex-1 min-h-[200px] relative overflow-hidden shadow-lg group cursor-pointer block rounded-2xl">
            {banner.image_url && (
                <Image
                    src={banner.image_url}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    {banner.title && (
                        <h3 className="text-white text-xl font-extrabold leading-tight mb-1">{banner.title}</h3>
                    )}
                    {banner.description && (
                        <p className="text-white/60 text-xs font-medium mb-1">{banner.description}</p>
                    )}
                    {banner.link_url && (
                        <span className="text-white/60 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                            Shop Now <ArrowRight size={12} />
                        </span>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

function PlaceholderSideBanner({ title, subtitle, icon }: { title: string; subtitle: string; icon: "arrivals" | "sellers" }) {
    return (
        <Link href="/search" className="flex-1 min-h-[200px] relative overflow-hidden group block bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl">
            <div className="absolute top-4 right-4 opacity-[0.06] pointer-events-none">
                {icon === "arrivals" ? (
                    <Sparkles size={100} strokeWidth={1} />
                ) : (
                    <TrendingUp size={100} strokeWidth={1} />
                )}
            </div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div>
                    <span className="text-secondary font-bold text-[10px] uppercase tracking-[0.2em] mb-1 block">{subtitle}</span>
                    <h3 className="text-gray-900 text-xl font-extrabold leading-tight mb-1">{title}</h3>
                    <span className="text-secondary text-xs font-bold inline-flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
                        Shop Cuts <ArrowRight size={12} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export function Hero() {
    const { data: banners = [] } = useBanners({ status: "active" });
    const { storeName } = useStore();

    const mainBanner = banners.find((banner: Banner) => banner.placement === "main") || banners[0];
    const sideBanners = banners.filter((banner: Banner) => banner.placement !== "main").slice(0, 2);

    return (
        <div className="container py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[480px]">
                {mainBanner ? (
                    <MainBanner banner={mainBanner} />
                ) : (
                    <PlaceholderMainBanner storeName={storeName} />
                )}

                <div className="lg:col-span-4 flex flex-col gap-5">
                    {sideBanners.length >= 2 ? (
                        sideBanners.map((banner: Banner) => (
                            <SideBanner key={banner.id} banner={banner} />
                        ))
                    ) : sideBanners.length === 1 ? (
                        <>
                            <SideBanner banner={sideBanners[0]} />
                            <PlaceholderSideBanner title="Fresh Cuts" subtitle="Just Trimmed" icon="arrivals" />
                        </>
                    ) : (
                        <>
                            <PlaceholderSideBanner title="Fresh Cuts" subtitle="Just Trimmed" icon="arrivals" />
                            <PlaceholderSideBanner title="Butcher's Picks" subtitle="Customer Faves" icon="sellers" />
                        </>
                    )}
                </div>
            </div>

            {/* Trust Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                {TRUST_ITEMS.map((item, i) => (
                    <div key={i} className="bg-white px-4 py-3.5 border border-border shadow-card flex items-center gap-3 hover:shadow-soft hover:border-secondary/20 transition-all duration-300 group cursor-pointer">
                        <div className="w-10 h-10 bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-all">
                            <item.icon size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <h4 className="font-extrabold text-gray-900 text-[11px] uppercase tracking-wide">{item.title}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const HERO_CATEGORIES = ["Chicken", "Beef", "Sausages", "Fish", "Goat Meat", "Pork"];

const TRUST_ITEMS = [
    { icon: Truck, title: "Chilled Delivery", desc: "Cold-chain protected" },
    { icon: ShieldCheck, title: "Butcher's Guarantee", desc: "Handled with care" },
    { icon: RotateCcw, title: "Cut-to-Order", desc: "Trimmed to spec" },
    { icon: Headphones, title: "Butcher Support", desc: "Talk to a pro" },
    { icon: Gift, title: "Spice Pairings", desc: "Free rub suggestions" },
];
