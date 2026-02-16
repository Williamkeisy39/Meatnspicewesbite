"use client";

import Link from "next/link";
import { useCategories } from "@/lib/hooks";
import { useStore } from "@/lib/providers/store-provider";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
} from "lucide-react";

export function Footer() {
  const { storeName, storeEmail, storePhone, storeAddress, store } = useStore();

  const { data: categories = [] } = useCategories({ is_active: "true" });

  // Get top 5 categories for the Shop column
  const shopCategories = categories.slice(0, 5);

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Top Contact Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Customer Service */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Customer Service
                </h4>
                <p className="text-sm text-gray-500">Mon-Sat, 9am-6pm EST.</p>
              </div>
            </div>

            {/* Call Us */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Call Us</h4>
                <p className="text-sm text-gray-500">
                  {storePhone} (toll-free)
                </p>
              </div>
            </div>

            {/* Get in Touch */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Get in Touch
                </h4>
                <a
                  href={`mailto:${storeEmail}`}
                  className="text-sm text-gray-500 hover:text-[#1D349A] underline"
                >
                  {storeEmail}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Address</h4>
                <p className="text-sm text-gray-500">{storeAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#1D349A] transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-[#1D349A] transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/stores"
                  className="hover:text-[#1D349A] transition-colors"
                >
                  Find a Store
                </Link>
              </li>
              <li>
                <Link
                  href="/orders/track"
                  className="hover:text-[#1D349A] transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Collection - From API */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Collection</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                    className="hover:text-[#1D349A] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop - From API */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {shopCategories.length > 0 ? (
                shopCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                      className="hover:text-[#1D349A] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/search?q="
                      className="hover:text-[#1D349A] transition-colors"
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search?q=sale"
                      className="hover:text-[#1D349A] transition-colors"
                    >
                      On Sale
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {store?.facebook && (
                <a
                  href={store.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {store?.instagram && (
                <a
                  href={store.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {store?.whatsapp && (
                <a
                  href={`https://wa.me/${store.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Copyright & Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>
                © {new Date().getFullYear()} {storeName}. Powered by TopDuka
              </span>
              <Link
                href="/terms"
                className="hover:text-[#1D349A] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-[#1D349A] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
