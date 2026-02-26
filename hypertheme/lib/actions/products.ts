"use server";

import { duka } from "@/lib/duka";
import type { ProductGetParams, DiscountedProductsParams } from "@valebytes/topduka-node";

export async function getProducts(params?: ProductGetParams) {
  return await duka.products.list(params);
}

export async function getProduct(id: string) {
  const results = await duka.products.list({ id });
  return results[0] ?? null;
}

export async function getPopularProducts(skip?: number) {
  return await duka.products.popular(skip);
}

export async function getDiscountedProducts(params?: DiscountedProductsParams) {
  return await duka.products.discounted(params);
}

export async function getBestSellingProducts(skip?: number) {
  return await duka.products.bestSelling(skip);
}

export async function getNewArrivals(limit?: number) {
  const products = await duka.products.list({ status: "active" });
  return products.slice(0, limit || 8);
}
