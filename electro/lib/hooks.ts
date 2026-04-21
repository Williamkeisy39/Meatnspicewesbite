"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, getPopularProducts, getDiscountedProducts, getBestSellingProducts } from "@/lib/actions/products";
import { getCategories, getCategoryProducts } from "@/lib/actions/categories";
import type {
    Product,
    Category,
    ProductGetParams,
    CategoryGetParams,
    DiscountedProductsParams,
} from "@/lib/catalog/types";
import type { BannerQueryParams } from "@/lib/types/banner";

// ── Products ──

export function useProducts(params?: ProductGetParams) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => getProducts(params),
        staleTime: 1000 * 60 * 5,
    });
}

export function useCategories(params?: CategoryGetParams) {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => getCategories(params),
        staleTime: 1000 * 60 * 10,
    });
}

export function usePopularProducts(skip?: number) {
    return useQuery({
        queryKey: ["products-popular", skip],
        queryFn: () => getPopularProducts(skip),
        staleTime: 1000 * 60 * 5,
    });
}

export function useDiscountedProducts(params?: DiscountedProductsParams) {
    return useQuery({
        queryKey: ["products-discounted", params],
        queryFn: () => getDiscountedProducts(params),
        staleTime: 1000 * 60 * 5,
    });
}

export function useBestSellingProducts(skip?: number) {
    return useQuery({
        queryKey: ["products-best-selling", skip],
        queryFn: () => getBestSellingProducts(skip),
        staleTime: 1000 * 60 * 5,
    });
}

// ── Banners ──

export function useBanners(params?: BannerQueryParams) {
    return useQuery({
        queryKey: ["banners", params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            if (params?.status) searchParams.set("status", params.status);
            if (params?.placement) searchParams.set("placement", params.placement);

            const res = await fetch(`/api/banners${searchParams.size ? `?${searchParams.toString()}` : ""}`);
            if (!res.ok) {
                throw new Error("Failed to load banners");
            }
            return res.json();
        },
        staleTime: 1000 * 60 * 10,
    });
}
