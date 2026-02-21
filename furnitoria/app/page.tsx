

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import { products } from '@/lib/data';
import Link from "next/link";
import { Truck, ShieldCheck, RefreshCw, Clock, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <Hero />

      {/* Categories Grid */}
      <section className="py-24 px-6 md:px-12 container mx-auto">
        <SectionHeader title="Shop by Category" subtitle="Browse Collections" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[
            { name: "Living Room", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1000", count: "34 Items" },
            { name: "Dining Room", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1000", count: "28 Items" },
            { name: "Bedroom", image: "https://images.unsplash.com/photo-1595515106967-1b3eb3d6928e?auto=format&fit=crop&q=80&w=1000", count: "42 Items" },
          ].map((category, i) => (
            <div key={i} className="group relative h-96 overflow-hidden rounded-2xl cursor-pointer">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-serif font-bold mb-2">{category.name}</h3>
                <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 px-6 md:px-12 container mx-auto">
        <SectionHeader
          title="New Arrivals"
          subtitle="Fresh in Stock"
          linkText="View All New"
          linkHref="/new-arrivals"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
          {products.slice(0, 7).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Show More Container */}
          <Link href="/products" className="group relative flex flex-col items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed border-border bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <ArrowRight className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground">View All Products</h3>
            <p className="text-muted-foreground mt-2 text-sm">Discover 50+ more items</p>
          </Link>
        </div>
      </section>

      {/* Features / USPs */}
      <section className="bg-secondary/30 py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", description: "On all orders over $999" },
              { icon: ShieldCheck, title: "Warranty Protection", description: "2-year warranty on all items" },
              { icon: RefreshCw, title: "Easy Returns", description: "30-day hassle-free returns" },
              { icon: Clock, title: "24/7 Support", description: "Dedicated support team" },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 rounded-full bg-accent/10 text-accent mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2 font-serif">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular */}
      <section className="py-24 px-6 md:px-12 container mx-auto bg-[#1c1917] text-white rounded-3xl my-12">
        <div className="mb-12 pt-12 px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">Trending Now</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-serif">Most Popular</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 pb-12 px-6">
          {products.slice(0, 6).map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
              </div>
              <h3 className="text-xl font-medium text-white group-hover:text-accent transition-colors font-serif">{product.name}</h3>
              <p className="text-white/60 mb-2">{product.category}</p>
              <span className="font-semibold text-white text-lg">${product.price}</span>
            </div>
          ))}
        </div>

        <div className="pb-16 text-center">
          <button className="px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all shadow-lg active:scale-95">
            Shop Best Sellers
          </button>
        </div>
      </section>

      {/* Promo / Banner */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden my-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop"
            alt="Interior Design"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white max-w-3xl px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Redefine Your Space</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-light">
            Our interior design experts are here to help you create a home that reflects your personality.
          </p>
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-transform hover:scale-105 active:scale-95">
            Book a Consultation
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
