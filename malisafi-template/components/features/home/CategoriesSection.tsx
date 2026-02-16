"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/lib/hooks";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80";

export default function CategoriesSection() {
    const { data: categories = [] } = useCategories({ is_active: "true" });

    if (categories.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <p className="text-xs font-bold tracking-luxury text-[#C6A87C] mb-4 uppercase">
                        Shop by Category
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif text-black">
                        Curated Collections
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
                    {categories.map((category) => {
                        const imageUrl = category.placeholder_type === "image_url" && category.placeholder_value
                            ? category.placeholder_value
                            : FALLBACK_IMAGE;

                        return (
                            <Link
                                href={`/search?category=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
                                key={category.id}
                                className="group relative block aspect-[3/4] md:aspect-square overflow-hidden bg-gray-100"
                            >
                                <Image
                                    src={imageUrl}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {category.name}
                                    </h3>
                                    <span className="text-xs font-bold text-white uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 border-b border-white pb-1">
                                        Explore
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
