"use client";

import { MainHeader } from "@/components/header/main-header";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref") || searchParams.get("reference");

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="container mx-auto px-4 md:px-8 lg:px-32 py-16 text-center max-w-lg">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 mb-2">
          Thank you for your purchase. We'll send you a confirmation email
          shortly.
        </p>

        {reference && (
          <p className="text-sm text-gray-400 mb-6">
            Reference: <span className="font-mono">{reference}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/"
            className="bg-[#1D349A] text-white px-8 py-3 font-semibold text-sm hover:bg-[#004f73] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
