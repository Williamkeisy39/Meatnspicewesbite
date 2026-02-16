import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Store",
  description: "Welcome to our store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-background text-gray-600 antialiased`}>
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
              </CartDrawerProvider>
            </CartProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
