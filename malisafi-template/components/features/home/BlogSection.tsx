import Link from "next/link";
import Image from "next/image";

const POSTS = [
    {
        id: 1,
        title: "The 5-Step Evening Ritual regarding Sleep",
        category: "Wellness",
        image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 2,
        title: "Why Niacinamide is a Game Changer",
        category: "Ingredients",
        image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 3,
        title: "Sustainable Packaging: Our Promise",
        category: "Sustainability",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=800&q=80",
    },
];

export default function BlogSection() {
    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-end mb-16 border-b border-black/10 pb-8">
                    <div>
                        <span className="text-xs font-bold text-[#C6A87C] uppercase tracking-[0.2em] mb-2 block">
                            The Journal
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-black leading-tight">
                            Latest Stories
                        </h2>
                    </div>
                    <Link href="/journal" className="hidden md:inline-block text-xs font-bold uppercase tracking-widest hover:text-[#C6A87C] transition-colors">
                        Read All Articles
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {POSTS.map((post, i) => (
                        <article key={post.id} className="group cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                            <div className="relative aspect-[3/2] overflow-hidden mb-6 bg-gray-100">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                                {post.category}
                            </span>
                            <h3 className="text-xl font-serif leading-snug group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all">
                                {post.title}
                            </h3>
                        </article>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/journal" className="inline-block border-b border-black pb-1 text-xs font-bold uppercase tracking-widest hover:text-[#C6A87C] transition-colors">
                        Read All Articles
                    </Link>
                </div>
            </div>
        </section>
    );
}
