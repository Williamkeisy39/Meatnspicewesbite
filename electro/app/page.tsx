"use client";

import { Hero } from "../components/features/home/Hero";
import { SidebarBestSellers } from "../components/features/product/ProductSidebar";
import { ProductCard } from "../components/features/product/ProductCard";
import Link from "next/link";
import { ArrowRight, ChevronRight, Grid3x3, Sparkles } from "lucide-react";
import { useProducts, usePopularProducts, useCategories, useDiscountedProducts } from "@/lib/hooks";

export default function Home() {
  const { data: products = [] } = useProducts({ status: "active", skip: 0 });
  const { data: popular = [] } = usePopularProducts();
  const { data: discounted = [] } = useDiscountedProducts();
  const { data: categories = [] } = useCategories({ is_active: "true" });

  const featured = products.slice(0, 4);
  const recommended = popular.length > 0 ? popular.slice(0, 8) : products.slice(4, 12);
  const deals = discounted.length > 0 ? discounted.slice(0, 4) : products.filter(p => p.sales_price).slice(0, 4);

  return (
    <div className="bg-background min-h-screen pb-20 overflow-x-hidden">
      <Hero />

      {/* Trending / Popular Section */}
      {popular.length > 0 && (
        <section className="container mb-10">
          <div className="bg-primary rounded-3xl px-8 py-10 relative overflow-hidden shadow-elevated">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-light/20 blur-[100px] pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl shadow-lg">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">Popular Products</h3>
                    <p className="text-white/50 text-sm mt-1 font-medium">Trending this week</p>
                  </div>
                </div>
                <Link href="/search" className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl border border-white/10 transition-all">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {popular.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-32 h-fit">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="bg-primary px-5 py-4">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2 uppercase tracking-wider">
                  <Grid3x3 size={16} /> Top Categories
                </h3>
              </div>
              <ul className="p-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between text-sm text-gray-600 hover:text-secondary hover:bg-secondary/5 px-4 py-2.5 cursor-pointer group transition-all font-medium"
                    >
                      {cat.name}
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-secondary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <SidebarBestSellers />
          </aside>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-9 space-y-10">

            {/* Featured Products */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Featured Products</h2>
                <Link href="/search" className="text-sm font-bold text-secondary flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Deals */}
            {deals.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title">Deals & Offers</h2>
                  <Link href="/search" className="text-sm font-bold text-secondary flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {deals.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Recommended Products */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Recommended For You</h2>
                <Link href="/search" className="text-sm font-bold text-secondary flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recommended.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
