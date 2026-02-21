"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { duka } from "@/lib/duka";
import type {
    ProductGetParams,
    CategoryGetParams,
    DiscountedProductsParams,
    BannerGetParams,
    InitializePaymentParams,
    VerifyPaymentParams,
} from "@valebytes/topduka-node";

// ── Products ──

export function useProducts(params?: ProductGetParams) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => duka.products.list(params),
        staleTime: 1000 * 60 * 5,
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const results = await duka.products.list({ id });
            return results[0] ?? null;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCategories(params?: CategoryGetParams) {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => duka.categories.list(params),
        staleTime: 1000 * 60 * 10,
    });
}

export function useCategoryProducts(categoryId: string | undefined) {
    return useQuery({
        queryKey: ["category-products", categoryId],
        queryFn: () => duka.categories.getProducts(categoryId!),
        enabled: !!categoryId,
        staleTime: 1000 * 60 * 5,
    });
}

export function usePopularProducts(skip?: number) {
    return useQuery({
        queryKey: ["products-popular", skip],
        queryFn: () => duka.products.popular(skip),
        staleTime: 1000 * 60 * 5,
    });
}

export function useDiscountedProducts(params?: DiscountedProductsParams) {
    return useQuery({
        queryKey: ["products-discounted", params],
        queryFn: () => duka.products.discounted(params),
        staleTime: 1000 * 60 * 5,
    });
}

export function useBestSellingProducts(skip?: number) {
    return useQuery({
        queryKey: ["products-best-selling", skip],
        queryFn: () => duka.products.bestSelling(skip),
        staleTime: 1000 * 60 * 5,
    });
}

// ── Banners ──

export function useBanners(params?: BannerGetParams) {
    return useQuery({
        queryKey: ["banners", params],
        queryFn: () => duka.banners.list(params),
        staleTime: 1000 * 60 * 10,
    });
}

// ── Orders ──

export function useOrders(skip?: number) {
    return useQuery({
        queryKey: ["orders", skip],
        queryFn: () => duka.orders.list(skip),
        staleTime: 1000 * 60 * 5,
    });
}

export function useOrder(orderId: string) {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => duka.orders.get(orderId),
        enabled: !!orderId,
        staleTime: 1000 * 60 * 5,
    });
}

// ── Payments ──

export function useInitializePayment() {
    return useMutation({
        mutationFn: (params: InitializePaymentParams) => duka.payments.initialize(params),
    });
}

export function useVerifyPayment() {
    return useMutation({
        mutationFn: (params: VerifyPaymentParams) => duka.payments.verify(params),
    });
}
