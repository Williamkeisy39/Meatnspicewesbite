"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingCart, User } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Grid3X3, label: "Categories" },
  { href: "/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/account", icon: User, label: "Account" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCartContext();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive
                  ? "text-[#1D349A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.href === "/cart" && itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#1D349A] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
