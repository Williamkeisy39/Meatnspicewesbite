"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        category: string;
        price: number;
        image: string;
        description: string;
    };
    className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
    return (
        <div className={cn("group relative flex flex-col gap-3", className)}>
            {/* Image Container */}
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-secondary/20">
                <Link href={`/products/${product.id}`}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>

                {/* Overlay Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-10">
                    <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white text-foreground transition-all active:scale-90">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                <button className="absolute bottom-4 left-4 right-4 py-3 bg-white/95 backdrop-blur-md rounded-lg shadow-sm font-medium text-sm text-center opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white hover:shadow-md flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add to Cart
                </button>
            </div>

            {/* Details */}
            <div className="space-y-1">
                <div className="flex justify-between items-start">
                    <Link href={`/products/${product.id}`}>
                        <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                            {product.name}
                        </h3>
                    </Link>
                    <span className="font-semibold text-foreground/90">${product.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
        </div>
    );
}
