import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import React from "react";
import { QueryProvider } from "@/lib/providers/query-provider";
import { StoreProvider } from "@/lib/providers/store-provider";
import { CartProvider } from "@/lib/providers/cart-provider";
import { CartDrawerProvider } from "@/components/context/CartDrawerContext";
import { MainHeader } from "@/components/features/layout/MainHeader";

import CartDrawer from "@/components/features/cart/CartDrawer";
import DynamicHead from "@/components/common/DynamicHead";
import { Footer } from "@/components/features/layout/Footer";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meat & Spice Ltd",
  description: "Freshly cut beef, chicken, fish, goat, pork, and sausages delivered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={workSans.variable} suppressHydrationWarning>
      <body className={`${workSans.className} bg-background text-gray-600 antialiased`}>
        <QueryProvider>
          <StoreProvider>
            <DynamicHead />
            <CartProvider>
              <CartDrawerProvider>
                <div className="flex flex-col min-h-screen">
                  <MainHeader />
                  <CartDrawer />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
                <FloatingWhatsApp />
              </CartDrawerProvider>
            </CartProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
