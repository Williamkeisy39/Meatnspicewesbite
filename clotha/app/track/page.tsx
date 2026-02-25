"use client";

import { Package, Search, Truck, CheckCircle, Clock, XCircle, Loader2, ArrowLeft, Calendar, DollarSign, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useOrder } from "@/lib/hooks";
import { useStore } from "@/lib/providers/store-provider";
import Link from "next/link";

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode; description: string }> = {
    pending: {
        label: "Pending",
        color: "text-yellow-500",
        icon: <Clock className="w-5 h-5" />,
        description: "Your order is awaiting confirmation"
    },
    processing: {
        label: "Processing",
        color: "text-blue-500",
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        description: "Your order is being prepared"
    },
    shipped: {
        label: "Shipped",
        color: "text-purple-500",
        icon: <Truck className="w-5 h-5" />,
        description: "Your order is on the way"
    },
    delivered: {
        label: "Delivered",
        color: "text-green-500",
        icon: <CheckCircle className="w-5 h-5" />,
        description: "Your order has been delivered"
    },
    cancelled: {
        label: "Cancelled",
        color: "text-red-500",
        icon: <XCircle className="w-5 h-5" />,
        description: "Your order was cancelled"
    },
};

export default function TrackPage() {
    const [orderId, setOrderId] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { formatPrice } = useStore();

    const cleanOrderId = orderId.replace(/^#/, "").trim();
    const { data: order, isLoading, error } = useOrder(
        submitted && cleanOrderId ? cleanOrderId : ""
    );

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cleanOrderId) return;
        setSubmitted(true);
    };

    const handleReset = () => {
        setSubmitted(false);
        setOrderId("");
    };

    const getStatus = (order: any): OrderStatus => {
        if (order.status?.toLowerCase() === 'delivered') return 'delivered';
        if (order.status?.toLowerCase() === 'shipped') return 'shipped';
        if (order.status?.toLowerCase() === 'cancelled') return 'cancelled';
        if (order.status?.toLowerCase() === 'processing') return 'processing';
        return 'pending';
    };

    const hasError = submitted && !isLoading && !order && cleanOrderId !== "";

    return (
        <div className="bg-[#0a0a0a] min-h-screen py-20 px-5">
            <div className={`max-w-2xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Back button */}
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#c8a96e] transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to store
                </Link>

                <div className="bg-[#141414] p-8 sm:p-10 border border-[#2a2a2a]">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-[#c8a96e]/10 border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e] mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-[#c8a96e]/5 animate-pulse" />
                            <Truck className="w-8 h-8 relative z-10" />
                        </div>
                        <h1 className="text-3xl font-bold font-display mb-3 text-white">Track Your Order</h1>
                        <p className="text-sm text-neutral-500">Enter your order ID to track its status.</p>
                    </div>

                    {/* Search Form */}
                    {(!submitted || hasError) && (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className={`transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a96e] mb-3">Order ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. #12345 or 12345"
                                    value={orderId}
                                    onChange={(e) => {
                                        setOrderId(e.target.value);
                                        if (submitted) setSubmitted(false);
                                    }}
                                    className="w-full h-14 bg-[#0a0a0a] border border-[#2a2a2a] px-4 outline-none focus:border-[#c8a96e] transition-all duration-300 text-white placeholder-neutral-600"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className={`group w-full h-14 bg-[#c8a96e] text-black font-bold uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 hover:bg-[#d4b87a] transition-all duration-300 disabled:opacity-50 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                                style={{ transitionDelay: '200ms' }}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                )}
                                {isLoading ? "Searching..." : "Track Status"}
                            </button>
                        </form>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="py-12 text-center">
                            <Loader2 className="w-10 h-10 text-[#c8a96e] animate-spin mx-auto mb-4" />
                            <p className="text-neutral-400">Searching for your order...</p>
                        </div>
                    )}

                    {/* Not Found */}
                    {hasError && (
                        <div className="py-8 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Order Not Found</h3>
                            <p className="text-neutral-500 mb-6">We couldn&apos;t find an order with that ID.</p>
                            <button 
                                onClick={handleReset}
                                className="px-6 py-3 border border-[#2a2a2a] text-neutral-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Order Found */}
                    {order && !isLoading && (
                        <div className="animate-fade-in">
                            {/* Status Banner */}
                            {(() => {
                                const status = getStatus(order);
                                const config = statusConfig[status];
                                return (
                                    <div className={`mb-8 p-6 bg-[#0a0a0a] border border-[#2a2a2a] ${status === 'delivered' ? 'border-l-4 border-l-green-500' : ''}`}>
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className={`${config.color}`}>{config.icon}</div>
                                            <div>
                                                <p className={`text-sm font-bold uppercase tracking-wider ${config.color}`}>{config.label}</p>
                                                <p className="text-neutral-400 text-sm">{config.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Order Details */}
                            <div className="space-y-6 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#0a0a0a] p-4 border border-[#2a2a2a]">
                                        <div className="flex items-center gap-2 text-[#c8a96e] mb-2">
                                            <Package className="w-4 h-4" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold">Order ID</span>
                                        </div>
                                        <p className="text-white font-mono">#{order.id?.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div className="bg-[#0a0a0a] p-4 border border-[#2a2a2a]">
                                        <div className="flex items-center gap-2 text-[#c8a96e] mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold">Order Date</span>
                                        </div>
                                        <p className="text-white">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-[#0a0a0a] p-4 border border-[#2a2a2a]">
                                        <div className="flex items-center gap-2 text-[#c8a96e] mb-2">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold">Total</span>
                                        </div>
                                        <p className="text-white">{formatPrice(order.total)}</p>
                                    </div>
                                    <div className="bg-[#0a0a0a] p-4 border border-[#2a2a2a]">
                                        <div className="flex items-center gap-2 text-[#c8a96e] mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold">Items</span>
                                        </div>
                                        <p className="text-white">{order.items?.length || 0} items</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                {order.items && order.items.length > 0 && (
                                    <div className="border border-[#2a2a2a] overflow-hidden">
                                        <div className="bg-[#0a0a0a] px-4 py-3 border-b border-[#2a2a2a]">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Order Items</h4>
                                        </div>
                                        <div className="divide-y divide-[#2a2a2a]">
                                            {order.items.map((item: any, index: number) => (
                                                <div key={index} className="p-4 flex items-center gap-4 bg-[#141414]">
                                                    <div className="w-14 h-14 bg-[#0a0a0a] border border-[#2a2a2a] overflow-hidden shrink-0">
                                                        {item.product_image && (
                                                            <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-sm font-medium truncate">{item.product_name}</p>
                                                        <p className="text-neutral-500 text-xs">Qty: {item.quantity}</p>
                                                    </div>
                                                    <span className="text-[#c8a96e] text-sm font-semibold">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <button 
                                onClick={handleReset}
                                className="w-full py-3 border border-[#2a2a2a] text-neutral-400 hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors text-sm font-medium"
                            >
                                Track Another Order
                            </button>
                        </div>
                    )}

                    {/* Help Text */}
                    {(!order || hasError) && !isLoading && (
                        <div className="mt-10 pt-8 border-t border-[#2a2a2a] space-y-4">
                            <p className="text-xs text-center text-neutral-500">
                                Need help? <a href="#" className="underline text-[#c8a96e] hover:text-[#d4b87a] transition-colors font-medium">Contact support</a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
