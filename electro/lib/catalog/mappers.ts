import type { Category as PrismaCategory, Product as PrismaProduct } from "@prisma/client";
import type { Category, Product } from "@/lib/catalog/types";

export type ProductWithCategory = PrismaProduct & {
  category: PrismaCategory | null;
};

export function toCategory(category: PrismaCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    is_active: category.isActive,
    created_at: category.createdAt.toISOString(),
    updated_at: category.updatedAt.toISOString(),
  };
}

export function toProduct(product: ProductWithCategory): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    sku: product.sku,
    price: product.price,
    sales_price: product.salesPrice,
    images: product.imageUrl ? [product.imageUrl] : [],
    categories: product.category ? [product.category.name] : [],
    category_id: product.categoryId,
    status: product.status,
    stock: product.stock,
    is_featured: product.isFeatured,
    is_popular: product.isPopular,
    created_at: product.createdAt.toISOString(),
    updated_at: product.updatedAt.toISOString(),
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
