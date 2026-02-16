import { Outfit } from "next/font/google";
import { QueryProvider } from "@/lib/providers/query-provider";
import { StoreProvider } from "@/lib/providers/store-provider";
import { CartProvider } from "@/lib/providers/cart-provider";

import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";

import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header";
import { DynamicHead } from "@/components/dynamic-head";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased bg-background`}
      >
        <QueryProvider>
          <StoreProvider>
            <CartProvider>
              <DynamicHead />
              <Header />
              {children}
              <Footer />
              <MobileBottomNav />
            </CartProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
