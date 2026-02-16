"use client";

import { BrowseCategories } from "@/components/sidebar/browse-categories";
import { BestSellingCarousel } from "@/components/sidebar/best-selling-carousel";
import { HeroSection } from "@/components/hero/hero-section";
import { ProductGrid } from "@/components/products/product-grid";
import { useProducts, usePopularProducts, useDiscountedProducts, useBestSellingProducts, useBanners } from "@/lib/hooks";
import type { Product } from "@valebytes/topduka-node";
import Link from "next/link";

function mapProduct(p: Product) {
  return {
    id: p.id,
    image: p.images?.[0] || "",
    brand: p.categories?.[0] || "",
    title: p.name,
    price: p.sales_price || p.price,
    originalPrice: p.sales_price ? p.price : undefined,
    rating: p.rating || 5,
  };
}

export default function Home() {
  const { data: newArrivals = [], isLoading: loadingNew } = useProducts({ status: "active", skip: 0 });
  const { data: popular = [], isLoading: loadingPopular } = usePopularProducts();
  const { data: discounted = [], isLoading: loadingDiscounted } = useDiscountedProducts();
  const { data: bestSelling = [], isLoading: loadingBest } = useBestSellingProducts();
  const { data: banners = [] } = useBanners({ status: "active" });

  const mappedNew = newArrivals.map(mapProduct);
  const mappedPopular = popular.map(mapProduct);
  const mappedDiscounted = discounted.map(mapProduct);
  const mappedBest = bestSelling.map(mapProduct);

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="container mx-auto px-4 md:px-8 lg:px-32 py-6 space-y-8">
        {/* Hero Section with Sidebar */}
        <div className="flex gap-6 items-start">
          {/* Sidebar - Only for Hero Area */}
          <aside className="hidden lg:block w-[280px] space-y-6 flex-shrink-0">
            {/* Best Selling Carousel Widget */}
            <BestSellingCarousel
              products={mappedBest}
              isLoading={loadingBest}
            />
          </aside>

          {/* Hero Content */}
          <div className="flex-1 min-w-0">
            <HeroSection />
          </div>
        </div>

        {/* Product Grids - Full Width */}
        <div className="space-y-8">
          <ProductGrid
            title="New Arrivals"
            products={loadingNew ? [] : mappedNew.slice(0, 5)}
            seeAllLink="/search?q="
          />

          <ProductGrid
            title="Popular"
            products={loadingPopular ? [] : mappedPopular.slice(0, 5)}
            seeAllLink="/search?q="
          />

          <ProductGrid
            title="On Sale"
            products={loadingDiscounted ? [] : mappedDiscounted.slice(0, 5)}
            seeAllLink="/search?q="
          />

          {/* Banner Strip - After On Sale */}
          {banners.length > 0 && banners[0].image_url ? (
            <div className="w-full h-48 bg-gradient-to-r from-[#1D349A] to-blue-800 rounded-md flex items-center p-8 relative overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={banners[0].image_url}
                  alt={banners[0].title || ""}
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
              <div className="relative z-10 text-white w-2/3">
                {banners[0].title && (
                  <h3 className="text-3xl font-bold italic mb-1">
                    {banners[0].title}
                  </h3>
                )}
                {banners[0].description && (
                  <p className="text-sm text-blue-100 mb-4">
                    {banners[0].description}
                  </p>
                )}
                {banners[0].link_url && (
                  <Link
                    href={banners[0].link_url}
                    className="bg-white text-[#1D349A] px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors"
                  >
                    SHOP NOW
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Placeholder Banner when no banner exists */
            <div className="w-full h-48 bg-gradient-to-r from-[#1D349A] to-blue-800 rounded-md flex items-center p-8 relative overflow-hidden">
              <div className="relative z-10 text-white w-full">
                <h3 className="text-3xl font-bold italic mb-1">
                  Special Offers
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  Discover amazing deals on our best products
                </p>
                <Link
                  href="/search?q=sale"
                  className="bg-white text-[#1D349A] px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors inline-block"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          )}

          <ProductGrid
            title="Best Selling"
            products={loadingBest ? [] : mappedBest.slice(0, 5)}
            seeAllLink="/search?q="
          />
        </div>
      </main>
    </div>
  );
}
