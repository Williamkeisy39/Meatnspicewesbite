"use client";

import Link from "next/link";
import { Grid3x3 } from "lucide-react";
import { useCategories } from "@/lib/hooks";

const COLORS = [
    "bg-indigo-600 shadow-indigo-200",
    "bg-violet-500 shadow-violet-200",
    "bg-sky-500 shadow-sky-200",
    "bg-pink-500 shadow-pink-200",
    "bg-amber-500 shadow-amber-200",
    "bg-emerald-500 shadow-green-200",
];

export function Categories() {
    const { data: categories = [] } = useCategories({ is_active: "true" });

    if (categories.length === 0) return null;

    return (
        <section className="container py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.slice(0, 6).map((cat, i) => (
                    <Link
                        key={cat.id}
                        href={`/search?category=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`}
                        className="group flex flex-col items-center gap-4 cursor-pointer p-4 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100"
                    >
                        <div
                            className={`w-20 h-20 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 shadow-lg group-hover:rotate-3 ${COLORS[i % COLORS.length]}`}
                        >
                            <Grid3x3 size={32} strokeWidth={1.5} />
                        </div>
                        <span className="font-bold text-slate-700 text-xs uppercase tracking-widest group-hover:text-primary transition-colors text-center">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
