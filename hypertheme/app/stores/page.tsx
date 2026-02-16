"use client";

import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { useStore } from "@/lib/providers/store-provider";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

export default function StoresPage() {
  const { storeName, storeEmail, storePhone, storeAddress, storeLogo, isLoading } = useStore();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Find a Store", href: "/stores" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 w-1/4" />
            <div className="h-8 bg-gray-200 w-1/2" />
            <div className="h-64 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const hasAddress = storeAddress && storeAddress !== "Not Available";
  const mapsUrl = hasAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeAddress)}`
    : null;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Header */}
        <div className="mt-8 mb-10 text-center">
          <MapPin className="w-12 h-12 text-[#1D349A] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Our Store</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Visit {storeName} in person. Find our location and contact details below.
          </p>
        </div>

        {/* Store Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 p-8">
            {/* Store Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              {storeLogo ? (
                <img src={storeLogo} alt={storeName} className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-[#1D349A] flex items-center justify-center text-white text-2xl font-bold">
                  {storeName.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{storeName}</h2>
                <p className="text-sm text-gray-500">Main Store</p>
              </div>
            </div>

            {/* Store Details */}
            <div className="space-y-5">
              {hasAddress && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#1D349A]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#1D349A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-sm text-gray-600">{storeAddress}</p>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[#1D349A] hover:underline mt-2"
                      >
                        Open in Google Maps
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {storePhone && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#1D349A]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#1D349A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Phone</h3>
                    <a href={`tel:${storePhone}`} className="text-sm text-[#1D349A] hover:underline">
                      {storePhone}
                    </a>
                  </div>
                </div>
              )}

              {storeEmail && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#1D349A]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#1D349A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Email</h3>
                    <a href={`mailto:${storeEmail}`} className="text-sm text-[#1D349A] hover:underline">
                      {storeEmail}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1D349A]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#1D349A]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-sm text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          {hasAddress && (
            <div className="mt-6">
              <iframe
                title="Store Location"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(storeAddress)}&output=embed`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
