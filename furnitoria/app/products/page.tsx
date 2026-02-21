
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "All Products | Furnitoria",
    description: "Explore our complete collection of premium furniture.",
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-32 pb-24 container mx-auto px-6 md:px-12">
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <SectionHeader
                        title="All Products"
                        subtitle="Our Complete Collection"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
