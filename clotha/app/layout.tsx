import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

import { Cart } from "@/components/features/cart/Cart";

import { Navbar } from "@/components/common/Navbar";
import { MetaUpdater } from "@/components/common/MetaUpdater";
import { QueryProvider } from "@/lib/providers/query-provider";
import { StoreProvider } from "@/lib/providers/store-provider";
import { CartProvider } from "@/lib/providers/cart-provider";
import { Footer } from "@/components/common/Footer";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Store",
  description: "Shop the latest trends in fashion and clothing.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${cormorant.variable} font-sans antialiased`}>
        <QueryProvider>
          <StoreProvider>
            <CartProvider>
              <MetaUpdater />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <Cart />
            </CartProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
