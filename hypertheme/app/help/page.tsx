"use client";

import { useStore } from "@/lib/providers/store-provider";
import { Breadcrumb } from "@/components/product-detail/breadcrumb";
import { HelpCircle, Mail, Phone, Clock, MessageCircle } from "lucide-react";

export default function HelpPage() {
  const { storeName, storeEmail, storePhone, storeAddress, isLoading } = useStore();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Help Center", href: "/help" },
  ];

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by clicking on 'Track Order' in the navigation menu or visiting the order tracking page and entering your order reference number.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy on all products. Items must be in original condition with all packaging and accessories.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery.",
    },
    {
      question: "Do you offer warranty on products?",
      answer:
        "Yes, we offer a 2-year warranty on all electronics. This covers manufacturer defects and malfunctions.",
    },
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

  const displayName = storeName || "Our Store";
  const displayEmail = storeEmail || "Not Available";
  const displayPhone = storePhone || "Not Available";
  const displayAddress = storeAddress || "Not Available";

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 lg:px-32 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Header */}
        <div className="mt-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-gray-600 max-w-2xl">
            Welcome to the {displayName} Help Center. Find answers to common
            questions or contact our support team for assistance.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-[#1D349A]/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#1D349A]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-2">Get help via email</p>
            <p className="text-[#1D349A] font-medium">{displayEmail}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-[#1D349A]/10 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-[#1D349A]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-2">Call us directly</p>
            <p className="text-[#1D349A] font-medium">{displayPhone}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-[#1D349A]/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[#1D349A]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
            <p className="text-sm text-gray-600 mb-2">When we're available</p>
            <p className="text-[#1D349A] font-medium">{displayAddress}</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#1D349A]" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-[#1D349A] rounded-lg p-8 text-white text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className="mb-4 text-blue-100">
            Our support team is ready to assist you with any questions or
            concerns.
          </p>
          <a
            href={`mailto:${displayEmail !== "Not Available" ? displayEmail : ""}`}
            className="inline-block bg-white text-[#1D349A] px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
