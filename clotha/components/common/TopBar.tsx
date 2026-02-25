import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

const SOCIAL = [
    { icon: Twitter, label: "Twitter" },
    { icon: Instagram, label: "Instagram" },
    { icon: Facebook, label: "Facebook" },
    { icon: Linkedin, label: "LinkedIn" },
];

export function TopBar() {
    return (
        <div className="w-full bg-[#8B5E3C] text-white text-xs">
            <div className="max-w-[1280px] mx-auto px-5 h-9 flex items-center justify-between gap-4">

             

                {/* Right — language, currency, socials */}
                <div className="flex items-center gap-5">

                    {/* Language + currency — native select styled via appearance-none wrapper */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative flex items-center">
                            <select
                                defaultValue="en"
                                className="appearance-none bg-transparent text-white text-xs outline-none cursor-pointer pr-3"
                            >
                                <option value="en" className="text-gray-900 bg-white">English</option>
                                <option value="fr" className="text-gray-900 bg-white">Français</option>
                            </select>
                            <span className="pointer-events-none absolute right-0 text-white/70 text-[9px]">▼</span>
                        </div>

                        <div className="w-px h-3 bg-white/30" />

                        <div className="relative flex items-center">
                            <select
                                defaultValue="usd"
                                className="appearance-none bg-transparent text-white text-xs outline-none cursor-pointer pr-3"
                            >
                                <option value="usd" className="text-gray-900 bg-white">USD</option>
                                <option value="eur" className="text-gray-900 bg-white">EUR</option>
                            </select>
                            <span className="pointer-events-none absolute right-0 text-white/70 text-[9px]">▼</span>
                        </div>
                    </div>

                    {/* Social icons */}
                    <div className="flex items-center gap-2.5">
                        {SOCIAL.map(({ icon: Icon, label }) => (
                            <a
                                key={label}
                                href="#"
                                aria-label={label}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
