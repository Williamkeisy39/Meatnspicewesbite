"use server";

import { prisma } from "@/lib/prisma";
import { slugify, toProduct } from "@/lib/catalog/mappers";
import { deleteUploadedFileByUrl } from "@/lib/uploads";
import type {
  ProductGetParams,
  DiscountedProductsParams,
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/catalog/types";

const SKU_PREFIX_FALLBACK = "MEAT";

const buildSkuPrefix = (name: string) => {
  const slug = slugify(name || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return slug.slice(0, 4) || SKU_PREFIX_FALLBACK;
};

const skuExists = async (sku: string) => {
  if (!sku) return false;
  const existing = await prisma.product.findUnique({ where: { sku } });
  return Boolean(existing);
};

const generateUniqueSku = async (name: string) => {
  const prefix = buildSkuPrefix(name);
  for (let attempt = 0; attempt < 8; attempt++) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const candidate = `${prefix}${suffix}`;
    if (!(await skuExists(candidate))) {
      return candidate;
    }
  }

  const fallback = `${prefix}${Date.now().toString().slice(-5)}`;
  if (!(await skuExists(fallback))) {
    return fallback;
  }

  return `${prefix}${(Math.random() * 1_000_000).toFixed(0)}`;
};

const resolveSku = async (inputSku: string | null | undefined, name: string) => {
  const trimmed = inputSku?.trim();
  if (trimmed) {
    return trimmed.toUpperCase();
  }

  return generateUniqueSku(name);
};

export async function getProducts(params?: ProductGetParams) {
  const items = await prisma.product.findMany({
    where: {
      status: params?.status,
      categoryId: params?.category_id,
      name: params?.search_term
        ? {
            contains: params.search_term,
            mode: "insensitive",
          }
        : undefined,
    },
    include: {
      category: true,
    },
    skip: params?.skip ?? 0,
    orderBy: {
      createdAt: "desc",
    },
  });

  return items.map(toProduct);
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  return product ? toProduct(product) : null;
}

export async function getPopularProducts(skip?: number) {
  const items = await prisma.product.findMany({
    where: {
      status: "active",
      isPopular: true,
    },
    include: { category: true },
    skip: skip ?? 0,
    orderBy: { updatedAt: "desc" },
  });

  return items.map(toProduct);
}

export async function getDiscountedProducts(params?: DiscountedProductsParams) {
  const items = await prisma.product.findMany({
    where: {
      status: "active",
      salesPrice: {
        not: null,
      },
    },
    include: { category: true },
    skip: params?.skip ?? 0,
    orderBy: { updatedAt: "desc" },
  });

  return items.map(toProduct);
}

export async function getBestSellingProducts(skip?: number) {
  const items = await prisma.product.findMany({
    where: {
      status: "active",
      isPopular: true,
    },
    include: { category: true },
    skip: skip ?? 0,
    orderBy: { stock: "desc" },
  });

  return items.map(toProduct);
}

export async function getNewArrivals(limit?: number) {
  const products = await getProducts({ status: "active", skip: 0 });
  return products.slice(0, limit || 8);
}

export async function createProduct(input: CreateProductInput) {
  const sku = await resolveSku(input.sku, input.name);
  const created = await prisma.product.create({
    data: {
      name: input.name,
      slug: slugify(input.name),
      description: input.description || null,
      sku,
      price: input.price,
      salesPrice: input.sales_price ?? null,
      stock: input.stock,
      imageUrl: input.image_url || null,
      status: input.status || "active",
      isFeatured: input.is_featured ?? false,
      isPopular: input.is_popular ?? false,
      categoryId: input.category_id ?? null,
    },
    include: { category: true },
  });

  return toProduct(created);
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { imageUrl: true, name: true, sku: true },
  });

  const shouldUpdateSku = input.sku !== undefined || !existing?.sku;
  const nextSku = shouldUpdateSku
    ? await resolveSku(
        input.sku !== undefined ? input.sku : existing?.sku ?? null,
        input.name ?? existing?.name ?? "Product"
      )
    : undefined;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.name ? slugify(input.name) : undefined,
      description: input.description,
      sku: nextSku,
      price: input.price,
      salesPrice: input.sales_price,
      stock: input.stock,
      imageUrl: input.image_url,
      status: input.status,
      isFeatured: input.is_featured,
      isPopular: input.is_popular,
      categoryId: input.category_id,
    },
    include: { category: true },
  });

  if (
    input.image_url !== undefined &&
    existing?.imageUrl &&
    existing.imageUrl !== updated.imageUrl
  ) {
    await deleteUploadedFileByUrl(existing.imageUrl);
  }

  return toProduct(updated);
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  await prisma.product.delete({ where: { id } });
  await deleteUploadedFileByUrl(existing?.imageUrl);
}

export async function restockProduct(id: string, quantity: number) {
  const updated = await prisma.product.update({
    where: { id },
    data: {
      stock: {
        increment: quantity,
      },
    },
    include: { category: true },
  });

  return toProduct(updated);
}
