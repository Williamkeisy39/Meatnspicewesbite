"use client";

import { Package, Search, Truck } from "lucide-react";
import { useState } from "react";

export default function TrackPage() {
    const [orderId, setOrderId] = useState("");

    return (
        <div className="bg-gray-50 min-h-screen py-20 px-5">
            <div className="max-w-md mx-auto bg-white p-10 shadow-sm border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                        <Truck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold font-display mb-2">Track Your Order</h1>
                    <p className="text-sm text-gray-400">Enter your order ID and billing email to track its status.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Order ID</label>
                        <input
                            type="text"
                            placeholder="e.g. #12345"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full h-12 border border-gray-200 px-4 outline-none focus:border-black transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Billing Email</label>
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full h-12 border border-gray-200 px-4 outline-none focus:border-black transition-all text-sm"
                        />
                    </div>
                    <button className="w-full h-14 bg-black text-white font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-gray-700 transition-all">
                        <Search className="w-4 h-4" /> Track Status
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
                    <p className="text-xs text-center text-gray-500 italic">
                        Don&apos;t have an account? <a href="#" className="underline text-black font-semibold">Sign up</a> for faster checkout and easy order tracking.
                    </p>
                </div>
            </div>
        </div>
    );
}
