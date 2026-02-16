import { Truck, Headphones, RotateCcw, CreditCard, ShieldCheck } from "lucide-react";

export function ServiceFeatures() {
    return (
        <div className="container mb-12">
            <div className="bg-white rounded-xl p-8 shadow-card flex flex-wrap lg:flex-nowrap justify-between gap-8 divide-x divide-gray-100">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 flex-1 first:pl-0 border-none lg:border-solid">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
                            <item.icon size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{item.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const items = [
    { icon: Truck, title: "Free Delivery", desc: "For all orders over $99" },
    { icon: RotateCcw, title: "30 Days Return", desc: "If goods have problems" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure payment" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated support" },
    { icon: CreditCard, title: "Gift Service", desc: "Support gift service" },
];
