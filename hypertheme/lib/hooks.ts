"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getProducts, getProduct, getPopularProducts, getDiscountedProducts, getBestSellingProducts, getNewArrivals } from "@/lib/actions/products";
import { getCategories, getCategoryProducts } from "@/lib/actions/categories";
import { getBanners } from "@/lib/actions/banners";
import { getOrders, getOrder } from "@/lib/actions/orders";
import { initializePayment, verifyPayment } from "@/lib/actions/payments";
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
        queryFn: () => getProducts(params),
        staleTime: 1000 * 60 * 5,
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
        enabled: !!id,
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

export function useCategoryProducts(categoryId: string | undefined) {
    return useQuery({
        queryKey: ["category-products", categoryId],
        queryFn: () => getCategoryProducts(categoryId!),
        enabled: !!categoryId,
        staleTime: 1000 * 60 * 5,
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

export function useNewArrivals(limit?: number) {
    return useQuery({
        queryKey: ["products-new-arrivals", limit],
        queryFn: () => getNewArrivals(limit),
        staleTime: 1000 * 60 * 5,
    });
}

// ── Banners ──

export function useBanners(params?: BannerGetParams) {
    return useQuery({
        queryKey: ["banners", params],
        queryFn: () => getBanners(params),
        staleTime: 1000 * 60 * 10,
    });
}

// ── Orders ──

export function useOrders(skip?: number) {
    return useQuery({
        queryKey: ["orders", skip],
        queryFn: () => getOrders(skip),
        staleTime: 1000 * 60 * 5,
    });
}

export function useOrder(orderId: string) {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrder(orderId),
        enabled: !!orderId,
        staleTime: 1000 * 60 * 5,
    });
}

// ── Payments ──

export function useInitializePayment() {
    return useMutation({
        mutationFn: (params: InitializePaymentParams) => initializePayment(params),
    });
}

export function useVerifyPayment() {
    return useMutation({
        mutationFn: (params: VerifyPaymentParams) => verifyPayment(params),
    });
}


