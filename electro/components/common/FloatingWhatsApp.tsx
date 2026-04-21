"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER = "254743467191";
const MESSAGE = "Order now!";

export function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname?.startsWith("/checkout")) {
    return null;
  }

  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-white shadow-2xl transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
      aria-label="Chat on WhatsApp"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
        <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-wide text-white/80">WhatsApp</p>
        <p className="text-sm font-semibold">Order now!</p>
      </div>
    </a>
  );
}
