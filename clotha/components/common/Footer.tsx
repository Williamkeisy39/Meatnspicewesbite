"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useStore } from "@/lib/providers/store-provider";
import { useCategories } from "@/lib/hooks";

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
  const { storeName, storeEmail, storePhone, storeAddress } = useStore();
  const { data: categories = [] } = useCategories({ is_active: "true" });

  return (
    <footer className="bg-gray-900 text-gray-400 mt-0">
      {/* Top */}
      <div className="max-w-[1280px] mx-auto px-5 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-5">
          <Link href="/" className="font-extrabold text-xl text-white tracking-tight block">
            {storeName}
          </Link>
          <div className="flex gap-2">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#cc1111] hover:text-[#cc1111] transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
          <ul className="space-y-2.5 text-sm">
            {storeAddress && (
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 text-[#cc1111] mt-0.5" />
                {storeAddress}
              </li>
            )}
            {storePhone && (
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-[#cc1111]" />
                <a href={`tel:${storePhone}`} className="hover:text-[#cc1111] transition-colors">{storePhone}</a>
              </li>
            )}
            {storeEmail && (
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-[#cc1111]" />
                <a href={`mailto:${storeEmail}`} className="hover:text-[#cc1111] transition-colors">
                  {storeEmail}
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Shop — real categories */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Shop</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/search?q=" className="text-sm hover:text-white transition-colors">All Products</Link>
            </li>
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/search?q=${encodeURIComponent(cat.name)}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Quick Links</h4>
          <ul className="space-y-2.5">
            {HELP_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">Stay Updated</h4>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Subscribe to receive updates on new arrivals and exclusive offers.
          </p>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-transparent border-b border-gray-600 px-0 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#cc1111] transition-colors"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#cc1111] text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-gray-600">
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <Link key={t} href="#" className="hover:text-white transition-colors">{t}</Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>Pay with:</span>
            {["VISA", "MC", "AMEX", "Paystack"].map((p) => (
              <span key={p} className="px-2 py-0.5 border border-white/10 text-[10px] font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
