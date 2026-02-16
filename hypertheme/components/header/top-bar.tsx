"use client";

import Link from "next/link";
import {
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { useStore } from "@/lib/providers/store-provider";

export function TopBar() {
  const { store, currency } = useStore();

  return (
    <div className="bg-[#1D349A] py-4 text-white text-xs">
      <div className="container mx-auto px-4 md:px-8 lg:px-32 grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-8 justify-between">
        {/* Left Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/help" className="hover:text-blue-200 transition-colors">
            Help Center
          </Link>
          <Link
            href="/stores"
            className="hover:text-blue-200 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            Find a Store
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-200 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Center spacer */}
        <div className="hidden md:block" />

        {/* Right - Social - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4 justify-end">
          <span className="text-sm">{currency}</span>

          <div className="flex items-center gap-3 ml-4 border-l border-blue-400 pl-4">
            {store?.facebook && (
              <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {store?.twitter && (
              <a href={store.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {store?.instagram && (
              <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {!store?.facebook && !store?.twitter && !store?.instagram && (
              <>
                <span className="hover:text-blue-200 transition-colors"><Facebook className="w-4 h-4" /></span>
                <span className="hover:text-blue-200 transition-colors"><Twitter className="w-4 h-4" /></span>
                <span className="hover:text-blue-200 transition-colors"><Instagram className="w-4 h-4" /></span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
