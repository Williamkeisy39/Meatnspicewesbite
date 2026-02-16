"use client";

import { useParams } from "next/navigation";
import { useProducts } from "@/lib/hooks";
import ProductView from "../../components/features/products/ProductView";

export default function ProductPage() {
    const params = useParams<{ id: string }>();
    const { data: products = [], isLoading } = useProducts({ id: params.id });
    const product = products[0];

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-gray-200 border-t-[#C6A87C] rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-white">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    return <ProductView product={product} />;
}
