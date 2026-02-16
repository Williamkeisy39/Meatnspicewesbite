"use client";

import HeroSection from "../components/features/home/HeroSection";
import ProductGridSection from "../components/features/home/ProductGridSection";
import NewArrivalsSection from "../components/features/home/NewArrivalsSection";
import CategoriesSection from "../components/features/home/CategoriesSection";
import { useProducts, usePopularProducts } from "@/lib/hooks";

export default function Home() {
  const { data: products = [] } = useProducts({ status: "active", skip: 0 });
  const { data: popular = [] } = usePopularProducts();

  const newArrivals = products.slice(0, 4);
  const bestSellers = popular.length > 0 ? popular.slice(0, 4) : products.slice(4, 8);

  return (
    <div className="flex flex-col gap-0 w-full min-h-screen bg-white">
      <HeroSection />

      <div id="new-arrivals">
        <NewArrivalsSection products={newArrivals} />
      </div>

      <CategoriesSection />

      <ProductGridSection
        title="Featured Products"
        products={bestSellers}
      />
    </div>
  );
}
