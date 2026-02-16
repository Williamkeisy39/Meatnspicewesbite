"use client";

import Link from "next/link";
import { useStore } from "@/lib/providers/store-provider";
import { useCategories } from "@/lib/hooks";
import { Phone, MapPin, Mail } from "lucide-react";

export function Footer() {
    const { storeName, store, storeEmail, storePhone, storeAddress } = useStore();
    const { data: categories = [] } = useCategories({ is_active: "true" });

    const socials = [
        store?.instagram && { name: "Instagram", url: store.instagram },
        store?.twitter && { name: "Twitter", url: store.twitter },
        store?.facebook && { name: "Facebook", url: store.facebook },
        store?.whatsapp && { name: "WhatsApp", url: `https://wa.me/${store.whatsapp}` },
    ].filter(Boolean) as { name: string; url: string }[];

    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="bg-secondary p-2 rounded-xl">
                                <span className="text-white font-black text-lg">{storeName.charAt(0)}</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight uppercase">{storeName}</span>
                        </div>
                        {storeAddress && (
                            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                                {storeAddress}
                            </p>
                        )}
                        <div className="space-y-2">
                            {storePhone && (
                                <a href={`tel:${storePhone}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-secondary transition-colors">
                                    <Phone size={14} /> {storePhone}
                                </a>
                            )}
                            {storeEmail && (
                                <a href={`mailto:${storeEmail}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-secondary transition-colors">
                                    <Mail size={14} /> {storeEmail}
                                </a>
                            )}
                        </div>
                        {socials.length > 0 && (
                            <div className="flex items-center gap-3 pt-2">
                                {socials.map((social) => (
                                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/10 hover:bg-secondary text-white/60 hover:text-white transition-all text-xs font-bold uppercase tracking-wider rounded-lg">
                                        {social.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Shop Categories */}
                    <div>
                        <h4 className="font-extrabold text-white mb-5 uppercase text-sm tracking-wider">Shop</h4>
                        <ul className="space-y-3 text-sm text-white/40">
                            <li>
                                <Link href="/search" className="hover:text-secondary transition-colors hover:pl-1 duration-200">
                                    All Products
                                </Link>
                            </li>
                            {categories.slice(0, 5).map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`} className="hover:text-secondary transition-colors hover:pl-1 duration-200">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-extrabold text-white mb-5 uppercase text-sm tracking-wider">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-white/40">
                            <li><Link href="/" className="hover:text-secondary transition-colors hover:pl-1 duration-200">Home</Link></li>
                            <li><Link href="/search" className="hover:text-secondary transition-colors hover:pl-1 duration-200">Browse Products</Link></li>
                            <li><Link href="/cart" className="hover:text-secondary transition-colors hover:pl-1 duration-200">Shopping Cart</Link></li>
                            <li><Link href="/checkout" className="hover:text-secondary transition-colors hover:pl-1 duration-200">Checkout</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-extrabold text-white mb-5 uppercase text-sm tracking-wider">Contact</h4>
                        <ul className="space-y-3 text-sm text-white/40">
                            {storeEmail && (
                                <li>
                                    <a href={`mailto:${storeEmail}`} className="hover:text-secondary transition-colors hover:pl-1 duration-200">
                                        {storeEmail}
                                    </a>
                                </li>
                            )}
                            {storePhone && (
                                <li>
                                    <a href={`tel:${storePhone}`} className="hover:text-secondary transition-colors hover:pl-1 duration-200">
                                        {storePhone}
                                    </a>
                                </li>
                            )}
                            {storeAddress && (
                                <li><span>{storeAddress}</span></li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4 text-xs text-white/30">
                    <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
