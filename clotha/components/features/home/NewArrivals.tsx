"use client";

import { useNewArrivals } from "@/lib/hooks";
import { ProductGrid } from "@/components/features/products/ProductGrid";

export function NewArrivals() {
    const { data: products = [] } = useNewArrivals(8);

    return (
        <ProductGrid
            products={products}
            title="New Arrivals"
            subtitle="Just In"
            columns={4}
            rows={2}
            viewAllHref="/search?q="
        />
    );
}
