"use client";

import Link from "next/link";
import { useBanners } from "@/lib/hooks";
import type { Banner } from "@valebytes/topduka-node";

export function HeroSection() {
  const { data: banners = [], isLoading } = useBanners({ status: "active" });

  // Filter only landscape banners
  const landscapeBanners = banners.filter(
    (b: Banner) => b.type === "landscape",
  );
  const banner = landscapeBanners[0];

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full bg-gray-100 relative overflow-hidden rounded-md min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-gray-200" />
      </section>
    );
  }

  // Has banner from API
  if (banner?.image_url) {
    return (
      <section className="w-full bg-white relative overflow-hidden rounded-md min-h-[400px] aspect-[21/9] max-h-[500px]">
        {/* Banner Image - Full coverage */}
        <div className="absolute inset-0">
          <img
            src={banner.image_url}
            alt={banner.title || "Hero Banner"}
            className="w-full h-full object-contain bg-gray-50"
          />
        </div>

        {/* Optional CTA Button if link exists */}
        {banner.link_url && (
          <div className="absolute bottom-8 left-8 z-20">
            <Link
              href={banner.link_url}
              className="bg-[#1D349A] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#152a7a] transition-colors shadow-lg"
            >
              SHOP NOW
            </Link>
          </div>
        )}

        {/* Carousel Dots - if multiple banners */}
        {landscapeBanners.length > 1 && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {landscapeBanners.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === 0 ? "w-6 bg-[#1D349A]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  // Placeholder when no banner exists
  return (
    <section className="flex-1 bg-gradient-to-r from-[#1D349A] to-blue-800 relative overflow-hidden rounded-md min-h-[400px] flex items-center justify-center">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 text-center text-white px-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Our Store
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-lg mx-auto">
          Discover amazing products at unbeatable prices
        </p>
        <Link
          href="/search?q="
          className="bg-white text-[#1D349A] px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors inline-block"
        >
          SHOP NOW
        </Link>
      </div>
    </section>
  );
}
