
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";
import { Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Search Results | Furnitoria",
    description: "Browse our collection of premium furniture.",
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q?.toLowerCase() || "";

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-32 pb-24 container mx-auto px-6 md:px-12">
                <div className="mb-12">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 block">&larr; Back to Home</Link>
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
                        {query ? `Results for "${query}"` : "All Products"}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                    </p>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border rounded-3xl border-dashed border-border/60 bg-secondary/10">
                        <div className="p-6 rounded-full bg-secondary/30 mb-6 text-muted-foreground">
                            <Search className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold mb-2">No products found</h2>
                        <p className="text-muted-foreground max-w-md mb-8">
                            We couldn't find anything matching "{query}". Try searching for categories like "Living Room" or "Sofa".
                        </p>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all"
                        >
                            Browse Collection
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
