"use server";

import { duka } from "@/lib/duka";
import type { CategoryGetParams } from "@valebytes/topduka-node";

export async function getCategories(params?: CategoryGetParams) {
  return await duka.categories.list(params);
}

export async function getCategoryProducts(categoryId: string) {
  return await duka.categories.getProducts(categoryId);
}
