"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/lib/hooks";

function CatItem({ name, image, href }: { name: string; image: string; href: string }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#cc1111] transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-center font-medium text-gray-800">{name}</span>
        </Link>
    );
}

export function PopularCategories() {
    const { data: categories = [] } = useCategories();

    const row1 = categories.slice(0, 7);
    const row2 = categories.slice(7, 14);

    return (
        <section className="py-10 border-b border-gray-200">
            <div className="max-w-[1280px] mx-auto px-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg text-gray-900 font-display">Popular Categories</h2>
                    <Link
                        href="/search?q="
                        className="text-xs font-semibold flex items-center gap-1 text-gray-500 hover:text-[#cc1111] transition-colors"
                    >
                        Shop all categories <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Row 1 */}
                {row1.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 mb-5">
                        {row1.map((c) => (
                            <CatItem
                                key={c.id}
                                name={c.name}
                                image={(c as any).placeholder_value ?? ""}
                                href={`/search?q=${encodeURIComponent(c.name)}`}
                            />
                        ))}
                    </div>
                )}

                {row2.length > 0 && (
                    <>
                        <div className="border-t border-gray-200 mb-5" />
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                            {row2.map((c) => (
                                <CatItem
                                    key={c.id}
                                    name={c.name}
                                    image={(c as any).placeholder_value ?? ""}
                                    href={`/search?q=${encodeURIComponent(c.name)}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
