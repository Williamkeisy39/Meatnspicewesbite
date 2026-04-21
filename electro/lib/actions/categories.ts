"use server";

import { prisma } from "@/lib/prisma";
import { slugify, toCategory } from "@/lib/catalog/mappers";
import { getProducts } from "@/lib/actions/products";
import type {
  CategoryGetParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/catalog/types";

export async function getCategories(params?: CategoryGetParams) {
  const categories = await prisma.category.findMany({
    where: {
      isActive:
        params?.is_active === undefined
          ? undefined
          : params.is_active === "true",
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map(toCategory);
}

export async function getCategoryProducts(categoryId: string) {
  return await getProducts({
    status: "active",
    category_id: categoryId,
    skip: 0,
  });
}

export async function createCategory(input: CreateCategoryInput) {
  const created = await prisma.category.create({
    data: {
      name: input.name,
      slug: slugify(input.name),
      isActive: input.is_active ?? true,
    },
  });

  return toCategory(created);
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.name ? slugify(input.name) : undefined,
      isActive: input.is_active,
    },
  });

  return toCategory(updated);
}

export async function deleteCategory(id: string) {
  await prisma.product.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });

  await prisma.category.delete({ where: { id } });
}
