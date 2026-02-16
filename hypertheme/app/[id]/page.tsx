"use client";

import { MainHeader } from "@/components/header/main-header";
import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { ImageGallery } from "@/components/product-detail/image-gallery";
import { ProductInfo } from "@/components/product-detail/product-info";
import { ProductGrid } from "@/components/products/product-grid";
import { useProducts } from "@/lib/hooks";
import type { Product } from "@valebytes/topduka-node";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useStore } from "@/lib/providers/store-provider";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";

function mapProduct(p: Product) {
  return {
    id: p.id,
    image: p.images?.[0] || "",
    brand: p.categories?.[0] || "",
    title: p.name,
    price: p.sales_price || p.price,
    originalPrice: p.sales_price ? p.price : undefined,
    rating: p.rating || 5,
  };
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: products = [], isLoading } = useProducts({ id: params.id });
  const { data: related = [], isLoading: loadingRelated } = useProducts({ status: "active", skip: 0 });
  const { addToCart, addingProductId } = useCartContext();
  const { formatPrice } = useStore();
  const [quantity, setQuantity] = useState(1);

  const product = products[0];
  const isAdding = addingProductId === params.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <MainHeader />
        <div className="flex items-center justify-center py-32">
          <span className="text-gray-500">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <MainHeader />
        <div className="flex items-center justify-center py-32">
          <span className="text-gray-500">Product not found</span>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...(product.categories || []).map((cat) => ({
      label: cat,
      href: `/search?q=${encodeURIComponent(cat)}`,
    })),
    { label: product.name, href: `/${product.id}` },
  ];

  const description = product.description || product.short_description || "";
  const features = description
    ? description.split("\n").filter((line) => line.trim())
    : [];

  const relatedMapped = related
    .filter((p) => p.id !== product.id)
    .slice(0, 5)
    .map(mapProduct);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Breadcrumb items={breadcrumbs} />

      <main className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
        {/* Product Detail Section */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ImageGallery
              images={product.images || []}
              productName={product.name}
            />

            <div>
              <ProductInfo
                title={product.name}
                price={product.sales_price || product.price}
                originalPrice={product.sales_price ? product.price : undefined}
                features={features}
                inStock={(product.stock ?? 0) > 0}
                sku={product.sku}
                categories={product.categories}
              />

              {/* Add to Cart */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-medium border-x border-gray-300 h-10 flex items-center justify-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product.id, quantity)}
                    disabled={isAdding || (product.stock ?? 0) <= 0}
                    className="flex-1 bg-[#1D349A] text-white py-2.5 px-6 font-semibold text-sm hover:bg-[#004f73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Add to Cart —{" "}
                        {formatPrice(
                          (product.sales_price || product.price) * quantity,
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <ProductGrid
          title="Related Products"
          products={loadingRelated ? [] : relatedMapped}
          seeAllLink="/search?q="
        />
      </main>
    </div>
  );
}
