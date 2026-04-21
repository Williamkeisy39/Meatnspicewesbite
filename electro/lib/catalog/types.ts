export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string | null;
  price: number;
  sales_price: number | null;
  images: string[];
  categories: string[];
  category_id: string | null;
  status: string;
  stock: number;
  is_featured: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductGetParams {
  status?: string;
  skip?: number;
  category_id?: string;
  search_term?: string;
}

export interface DiscountedProductsParams {
  skip?: number;
}

export interface CategoryGetParams {
  is_active?: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  sku?: string;
  price: number;
  sales_price?: number | null;
  stock: number;
  image_url?: string;
  status?: string;
  is_featured?: boolean;
  is_popular?: boolean;
  category_id?: string | null;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface CreateCategoryInput {
  name: string;
  is_active?: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
