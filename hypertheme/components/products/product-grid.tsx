import Link from "next/link";
import { ProductCard } from "./product-card";

interface Product {
  id: string;
  image: string;
  brand: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
}

interface ProductGridProps {
  title: string;
  products: Product[];
  seeAllLink?: string;
}

export function ProductGrid({
  title,
  products,
  seeAllLink = "#",
}: ProductGridProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <Link
          href={seeAllLink}
          className="text-sm font-semibold text-gray-500 hover:text-[#1D349A] underline decoration-gray-300 underline-offset-4 decoration-2"
        >
          [See all]
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
