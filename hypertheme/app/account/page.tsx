"use client";

import { useStore } from "@/lib/providers/store-provider";
import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const accountMenuItems = [
  { icon: Package, label: "My Orders", href: "/orders", description: "View and track your orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist", description: "Saved items for later" },
  { icon: MapPin, label: "Addresses", href: "/addresses", description: "Manage delivery addresses" },
  { icon: CreditCard, label: "Payment Methods", href: "/payment", description: "Your saved payment options" },
  { icon: Settings, label: "Account Settings", href: "/settings", description: "Update your profile info" },
];

export default function AccountPage() {
  const { storeName, storeEmail, storePhone, isLoading } = useStore();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/account" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="container mx-auto px-4 lg:px-32 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const supportEmail = storeEmail || "Not Available";
  const supportPhone = storePhone || "Not Available";

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 lg:px-32 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Header */}
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-gray-600">
            Welcome back! Manage your orders and account settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Menu */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h2>
            <div className="space-y-3">
              {accountMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-[#1D349A]/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#1D349A]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.label}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1D349A] transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Support Card */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#1D349A]" />
              Need Help?
            </h2>
            <div className="bg-[#1D349A] rounded-lg p-6 text-white">
              <MessageCircle className="w-10 h-10 mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                {storeName} Support
              </h3>
              <p className="text-sm text-blue-100 mb-6">
                Our team is here to help you with any questions about your orders or account.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{supportPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{supportEmail}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/help"
                  className="block w-full text-center bg-white text-[#1D349A] py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Visit Help Center
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-center bg-transparent border border-white text-white py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Quick Support Links */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Popular Topics</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-[#1D349A] transition-colors">
                    How to track my order?
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-[#1D349A] transition-colors">
                    Return & refund policy
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-[#1D349A] transition-colors">
                    Shipping information
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-[#1D349A] transition-colors">
                    Report an issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
