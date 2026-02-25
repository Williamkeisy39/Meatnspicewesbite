import { HeroSection } from "@/components/features/home/HeroSection";
import { Footer } from "@/components/common/Footer";
import { PopularCategories } from "@/components/features/home/PopularCategories";
import { TrendingCollection } from "@/components/features/home/TrendingCollection";
import { TrendingThisWeek } from "@/components/features/home/TrendingThisWeek";
import { FeaturedProducts } from "@/components/features/home/FeaturedProducts";
import { NewArrivals } from "@/components/features/home/NewArrivals";

export default function Home() {
  return (
    <div className="bg-[#0a0a0a]">
      <HeroSection />
      <PopularCategories />
      <TrendingCollection />
      <TrendingThisWeek />
      <FeaturedProducts />
      <NewArrivals />
    </div>
  );
}
