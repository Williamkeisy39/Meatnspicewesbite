import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import React from 'react';
import { QueryProvider } from "@/lib/providers/query-provider";
import { StoreProvider } from "@/lib/providers/store-provider";
import { CartProvider } from "@/lib/providers/cart-provider";
import { CartDrawerProvider } from "../components/context/CartDrawerContext";
import CartDrawer from "../components/features/cart/CartDrawer";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import DynamicHead from "../components/common/DynamicHead";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
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
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable}`}>
        <QueryProvider>
          <StoreProvider>
            <DynamicHead />
            <CartProvider>
              <CartDrawerProvider>
                <Header />
                <CartDrawer />
                <main>
                  {children}
                </main>
                <Footer />
              </CartDrawerProvider>
            </CartProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
