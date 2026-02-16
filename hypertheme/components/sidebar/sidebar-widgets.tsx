"use client";
import Link from "next/link";
import { useStore } from "@/lib/providers/store-provider";

export function TopBrands() {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="font-bold text-gray-800">Top Brands</h3>
        <Link
          href="/brands"
          className="text-xs font-bold text-gray-500 hover:text-[#1D349A] underline decoration-gray-300 underline-offset-2 decoration-2"
        >
          [See all]
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* Bullcaptain - using black BG placeholders as per image */}
        <div className="bg-black aspect-square flex items-center justify-center p-2 rounded-sm relative group cursor-pointer">
          <div className="text-white text-center">
            <div className="font-bold text-lg">🐂</div>
            <div className="text-[8px] mt-1 font-bold uppercase tracking-wider">
              Bullcaptain
            </div>
          </div>
        </div>
        {/* Samsung */}
        <div className="bg-white border aspect-square flex items-center justify-center p-2 rounded-sm relative group cursor-pointer hover:border-blue-500">
          <span className="text-blue-700 font-bold text-sm -rotate-12 bg-white px-1">
            SAMSUNG
          </span>
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1 mt-3">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
        <div className="w-4 h-1.5 rounded-full bg-[#1D349A]"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
}

export function SpecialOffer() {
  const { formatPrice } = useStore();

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="font-bold text-gray-800">Special Offer</h3>
        <Link
          href="/offers"
          className="text-xs font-bold text-gray-500 hover:text-[#1D349A] underline decoration-gray-300 underline-offset-2 decoration-2"
        >
          [See all]
        </Link>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-2 rounded relative border hover:border-gray-200 transition-colors">
          <div className="aspect-square bg-gray-50 mb-2 flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=300&q=60"
              alt="Perfume"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-gray-400 line-through">{formatPrice(359)}</p>
          <p className="font-bold text-gray-900 text-sm">{formatPrice(287)}</p>
          <p className="text-xs text-gray-600 leading-tight mt-1">
            Charming Jasmine Lady Perfume
          </p>
        </div>

        {/* Countdown Timer Strip */}
        <div className="flex justify-between gap-1 text-center bg-gray-50 p-1 rounded">
          {["19", "10", "59", "12"].map((num, i) => (
            <div
              key={i}
              className="bg-white shadow-sm border border-gray-200 rounded px-1 py-1 w-full"
            >
              <div className="font-bold text-xs text-gray-800">{num}</div>
              <div className="text-[6px] uppercase text-gray-400">
                {["Days", "Hours", "Mins", "Secs"][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
