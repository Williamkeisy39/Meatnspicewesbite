import { HeroSection } from "@/components/features/home/HeroSection";
import { Footer } from "@/components/common/Footer";
import { PopularCategories } from "@/components/features/home/PopularCategories";
import { PromoBanners } from "@/components/features/home/PromoBanners";
import { TrendingCollection } from "@/components/features/home/TrendingCollection";
import { TrendingThisWeek } from "@/components/features/home/TrendingThisWeek";
import { FeaturedProducts } from "@/components/features/home/FeaturedProducts";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <PromoBanners />
      <PopularCategories />
      <TrendingCollection />
      <TrendingThisWeek />
      <FeaturedProducts />
    </div>
  );
}
