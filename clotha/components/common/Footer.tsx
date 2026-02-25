"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Phone, MapPin } from "lucide-react";
import { useStore } from "@/lib/providers/store-provider";
import { useCategories } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";

const HELP_LINKS = [
  { label: "Track Your Order", href: "/track" },
  { label: "Checkout", href: "/checkout" },
  { label: "New Arrivals", href: "/search?q=" },
  { label: "Sale", href: "/search?q=sale" },
];

const SOCIAL = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  const { storeName, storePhone, storeAddress } = useStore();
  const { data: categories = [] } = useCategories({ is_active: "true" });
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#0a0a0a] text-neutral-400 border-t border-[#2a2a2a]">
      {/* Top */}
      <div className={`max-w-[1280px] mx-auto px-5 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Brand */}
        <div className="space-y-6">
          <Link href="/" className="font-display text-2xl text-white tracking-tight block hover:text-[#c8a96e] transition-colors">
            {storeName}<span className="text-[#c8a96e]">.</span>
          </Link>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Elevating your style with curated fashion pieces. Quality meets sophistication.
          </p>
          <div className="flex gap-3">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center text-neutral-500 hover:border-[#c8a96e] hover:text-[#c8a96e] hover:bg-[#141414] transition-all duration-300 hover:scale-110"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <ul className="space-y-3 text-sm">
            {storeAddress && (
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 text-[#c8a96e] mt-0.5" />
                <span className="text-neutral-400">{storeAddress}</span>
              </li>
            )}
            {storePhone && (
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-[#c8a96e]" />
                <a href={`tel:${storePhone}`} className="hover:text-[#c8a96e] transition-colors">{storePhone}</a>
              </li>
            )}
          </ul>
        </div>

        {/* Shop — real categories */}
        <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-6">Shop</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/search?q=" className="text-sm text-neutral-400 hover:text-[#c8a96e] transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-px bg-[#c8a96e] transition-all duration-300" />
                All Products
              </Link>
            </li>
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/search?q=${encodeURIComponent(cat.name)}`}
                  className="text-sm text-neutral-400 hover:text-[#c8a96e] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-[#c8a96e] transition-all duration-300" />
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {HELP_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-neutral-400 hover:text-[#c8a96e] transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-px bg-[#c8a96e] transition-all duration-300" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2a2a2a]">
        <div className={`max-w-[1280px] mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs text-neutral-600">© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <span>Pay with:</span>
            {["VISA", "MC", "AMEX", "Paystack"].map((p) => (
              <span key={p} className="px-2 py-1 border border-[#2a2a2a] text-[10px] font-medium text-neutral-500">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
