"use client";

import Link from "next/link";
import { useStore } from "@/lib/providers/store-provider";
import { useCategories } from "@/lib/hooks";

export default function Footer() {
    const { storeName, store, storeEmail, storePhone, storeAddress } = useStore();
    const { data: categories = [] } = useCategories({ is_active: "true" });

    const socials = [
        store?.instagram && { name: "Instagram", url: store.instagram },
        store?.twitter && { name: "Twitter", url: store.twitter },
        store?.facebook && { name: "Facebook", url: store.facebook },
        store?.whatsapp && { name: "WhatsApp", url: `https://wa.me/${store.whatsapp}` },
    ].filter(Boolean) as { name: string; url: string }[];

    return (
        <footer className="bg-[#1C1C1C] text-white py-24 border-t border-white/5 font-dm-sans">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-y-16 lg:gap-x-12 mb-20">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-8 pr-12">
                        <Link href="/" className="font-serif text-4xl tracking-tight block mb-6">
                            {storeName}<span className="text-accent">.</span>
                        </Link>
                        {storeAddress && (
                            <p className="text-gray-400 font-light leading-relaxed max-w-sm">
                                {storeAddress}
                            </p>
                        )}
                        {socials.length > 0 && (
                            <div className="flex gap-6 pt-4">
                                {socials.map((social) => (
                                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-accent hover:text-white transition-colors">
                                        {social.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Categories Column */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Shop</h4>
                        <ul className="space-y-4 text-sm text-gray-400 font-medium">
                            <li>
                                <Link href="/search" className="hover:text-white transition-colors block py-0.5">
                                    All Products
                                </Link>
                            </li>
                            {categories.slice(0, 4).map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`} className="hover:text-white transition-colors block py-0.5">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-gray-400 font-medium">
                            {storeEmail && (
                                <li>
                                    <a href={`mailto:${storeEmail}`} className="hover:text-white transition-colors block py-0.5">
                                        {storeEmail}
                                    </a>
                                </li>
                            )}
                            {storePhone && (
                                <li>
                                    <a href={`tel:${storePhone}`} className="hover:text-white transition-colors block py-0.5">
                                        {storePhone}
                                    </a>
                                </li>
                            )}
                            {storeAddress && (
                                <li>
                                    <span className="block py-0.5">{storeAddress}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-2 bg-white/5 p-8 -mx-8 sm:mx-0 sm:rounded-none">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
                            Stay Updated
                        </h4>
                        <p className="text-sm text-gray-400 mb-6 font-light">
                            Subscribe to receive updates on new arrivals and exclusive offers.
                        </p>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-transparent border-b border-gray-600 px-0 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                            />
                            <button
                                type="submit"
                                className="w-full py-4 bg-accent text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600 uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
