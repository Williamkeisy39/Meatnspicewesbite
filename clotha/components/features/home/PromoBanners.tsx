import Link from "next/link";

const BANNERS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&q=80",
        title: "Relaxed fit Overshirt",
        badge: "DISCOUNT 20%",
        desc: "",
        cta: "",
        href: "/shop",
        bg: "bg-[#f5f3ef]",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
        title: "Discount 20% All Items",
        badge: "",
        desc: "100% leather handmade",
        cta: "",
        href: "/shop",
        bg: "bg-gray-100",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        title: "Get 20% OFF In APP",
        badge: "",
        desc: "",
        cta: "DOWNLOAD NOW",
        href: "/app",
        bg: "bg-[#f5f5f0]",
    },
];

export function PromoBanners() {
    return (
        <div className="max-w-[1280px] mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 gap-1 my-1">
            {BANNERS.map((b) => (
                <Link
                    key={b.id}
                    href={b.href}
                    className={`relative overflow-hidden flex items-center justify-between group min-h-[110px] ${b.bg}`}
                >
                    {/* Text */}
                    <div className="px-5 py-4 flex-1 z-10">
                        {b.badge && (
                            <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 mb-2 bg-gray-900 text-white">
                                {b.badge}
                            </span>
                        )}
                        <p className="font-bold text-sm leading-tight text-gray-900">{b.title}</p>
                        {b.desc && <p className="text-xs text-gray-500 mt-1">{b.desc}</p>}
                        {b.cta && (
                            <span className="inline-block text-xs font-bold uppercase tracking-wider mt-2 underline text-[#cc1111]">
                                {b.cta}
                            </span>
                        )}
                    </div>

                    {/* Image */}
                    <div className="relative shrink-0 h-[110px] w-[120px] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={b.image}
                            alt={b.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </Link>
            ))}
        </div>
    );
}
