"use client";

import { useStore } from "@/lib/providers/store-provider";
import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const { storeName, storeEmail, storePhone, storeAddress, isLoading } = useStore();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact Us", href: "/contact" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const displayEmail = storeEmail || "Not Available";
  const displayPhone = storePhone || "Not Available";
  const displayAddress = storeAddress || "Not Available";

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 md:px-8 lg:px-32 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Header */}
        <div className="mt-8 mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Get in touch with
            {storeName || "Our Store"} through any of the channels below.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-[#1D349A]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Mail className="w-6 h-6 text-[#1D349A]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600 mb-2">Send us an email</p>
            <p className="text-[#1D349A] font-medium text-sm">{displayEmail}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-[#1D349A]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Phone className="w-6 h-6 text-[#1D349A]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-sm text-gray-600 mb-2">Call us directly</p>
            <p className="text-[#1D349A] font-medium text-sm">{displayPhone}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-[#1D349A]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <MapPin className="w-6 h-6 text-[#1D349A]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
            <p className="text-sm text-gray-600 mb-2">Visit our store</p>
            <p className="text-[#1D349A] font-medium text-sm">{displayAddress}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-[#1D349A]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Clock className="w-6 h-6 text-[#1D349A]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
            <p className="text-sm text-gray-600 mb-2">When we&apos;re open</p>
            <p className="text-[#1D349A] font-medium text-sm">
              Mon-Sat, 9am-6pm
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-[#1D349A] rounded-lg p-8 text-white text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
          <p className="mb-6 text-blue-100 max-w-md mx-auto">
            Our team is here to help. Reach out via email or phone and
            we&apos;ll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={
                displayEmail !== "Not Available" ? `mailto:${displayEmail}` : "#"
              }
              className="inline-block bg-white text-[#1D349A] px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Send Email
            </a>
            <a
              href={displayPhone !== "Not Available" ? `tel:${displayPhone}` : "#"}
              className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
