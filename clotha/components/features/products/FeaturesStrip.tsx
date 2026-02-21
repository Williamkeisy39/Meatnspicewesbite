import { Truck, RotateCcw, ShieldCheck, Leaf } from "lucide-react";

const FEATURES = [
    {
        icon: Truck,
        title: "Free Shipping",
        desc: "On all orders over $80",
    },
    {
        icon: RotateCcw,
        title: "Easy Returns",
        desc: "30-day hassle-free returns",
    },
    {
        icon: ShieldCheck,
        title: "Secure Checkout",
        desc: "SSL encrypted & safe",
    },
    {
        icon: Leaf,
        title: "Sustainably Made",
        desc: "Ethical & eco-conscious",
    },
];

export function FeaturesStrip() {
    return (
        <section className="bg-white border-y border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 md:gap-10">
                    {FEATURES.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#f5efdd] flex items-center justify-center shrink-0 shadow-sm">
                                <Icon className="w-5 h-5 text-[#c8a96e]" />
                            </div>
                            <div>
                                <p className="font-semibold text-neutral-900 text-sm leading-tight">{title}</p>
                                <p className="text-neutral-500 text-xs mt-1">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
