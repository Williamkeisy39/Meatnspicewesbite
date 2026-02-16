"use client";

import { ProductCard } from "./ProductCard";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePopularProducts } from "@/lib/hooks";

export function SidebarBestSellers() {
    const { data: popular = [] } = usePopularProducts();
    const products = popular.slice(0, 4);

    return (
        <div className="border border-border rounded-2xl bg-white overflow-hidden shadow-card">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="bg-secondary/10 p-1.5 rounded-lg">
                        <TrendingUp size={14} className="text-secondary" />
                    </span>
                    <h3 className="font-extrabold text-sm text-gray-900">Best Sellers</h3>
                </div>
                <Link href="/search" className="text-secondary text-xs font-bold hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                </Link>
            </div>
            <div className="flex flex-col divide-y divide-border">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} layout="list" />
                ))}
            </div>
        </div>
    );
}
