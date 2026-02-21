
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#1c1917] text-white py-16 md:py-24 font-sans border-t border-white/5">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Brand - Span 4 columns */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1c1917] font-serif font-bold text-2xl group-hover:bg-accent transition-colors">F</div>
                            <span className="text-2xl font-serif font-bold tracking-tight">Furnitoria</span>
                        </Link>
                        <p className="text-white/60 leading-relaxed text-lg max-w-sm">
                            Crafting spaces that tell your story. Sustainable, timeless, and designed for modern living.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors"><Twitter className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    {/* Navigation - Span 2 columns each */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Shop</h4>
                        <nav className="flex flex-col gap-4">
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Living Room</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Bedroom</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Dining</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Workspace</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Decor</Link>
                        </nav>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Company</h4>
                        <nav className="flex flex-col gap-4">
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">About Us</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Sustainability</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Careers</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Press</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">Contact</Link>
                        </nav>
                    </div>

                    {/* Newsletter - Span 4 columns */}
                    <div className="lg:col-span-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Values</h4>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                            <p className="text-white/80 font-serif italic text-lg">"Design is not just what it looks like and feels like. Design is how it works."</p>
                            <p className="text-white/40 text-sm">— Steve Jobs</p>
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <p className="text-sm text-white/60 mb-2">Subscribe to our journal</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="bg-transparent border-b border-white/20 w-full py-2 text-white focus:outline-none focus:border-accent transition-colors"
                                    />
                                    <button className="text-sm font-bold uppercase tracking-wider hover:text-accent transition-colors">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/40 gap-4">
                    <p>&copy; 2026 Furnitoria, Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
