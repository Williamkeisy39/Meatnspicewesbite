
import { products } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Check, Star, ShoppingBag, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return (
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
                </div>
                <Footer />
            </main>
        );
    }

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-6 md:px-12 py-32">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Collection
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Image Gallery */}
                    <div className="relative aspect-[4/5] bg-secondary/10 rounded-2xl overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium uppercase tracking-wider">{product.category}</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium text-foreground">4.8</span>
                                <span className="text-sm text-muted-foreground">(124 reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-foreground">{product.name}</h1>
                        <p className="text-2xl font-medium text-foreground mb-6">${product.price}</p>

                        <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                            {product.description} Designed with premium materials and attention to detail, this piece perfectly balances form and function. It's built to last and style to impress.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-border pb-10">
                            <button className="flex-1 bg-primary text-primary-foreground h-14 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                                <ShoppingBag className="w-5 h-5" /> Add to Cart
                            </button>
                            <button className="px-6 h-14 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors">
                                Save for Later
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid gap-6">
                            <div className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                                <div>
                                    <h4 className="font-medium">In Stock & Ready to Ship</h4>
                                    <p className="text-sm text-muted-foreground">Orders placed today ship within 24 hours.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Truck className="w-5 h-5 text-foreground mt-0.5" />
                                <div>
                                    <h4 className="font-medium">Free White Glove Delivery</h4>
                                    <p className="text-sm text-muted-foreground">We handle the heavy lifting and assembly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 border-t border-border pt-20">
                        <h2 className="text-3xl font-bold font-serif mb-12">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
