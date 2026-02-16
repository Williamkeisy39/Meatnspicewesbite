"use client"

import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useStore } from "@/lib/providers/store-provider"

interface Product {
  id: string
  image: string
  brand: string
  title: string
  price: number
  originalPrice?: number
  rating?: number
}

interface BestSellingCarouselProps {
  products: Product[]
  isLoading?: boolean
}

export function BestSellingCarousel({ products, isLoading }: BestSellingCarouselProps) {
  const { formatPrice } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(products.length, 1))
  }, [products.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(products.length, 1)) % Math.max(products.length, 1))
  }, [products.length])

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (isPaused || products.length <= 1) return
    const interval = setInterval(nextSlide, 3000)
    return () => clearInterval(interval)
  }, [isPaused, products.length, nextSlide])

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Best Selling</h3>
        </div>
        <div className="text-sm text-gray-400 text-center py-4">Loading...</div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Best Selling</h3>
        </div>
        <div className="text-sm text-gray-400 text-center py-4">No products</div>
      </div>
    )
  }

  const currentProduct = products[currentIndex]

  return (
    <div 
      className="bg-white border border-gray-200 rounded-md p-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">Best Selling</h3>
        <Link
          href="/search?q="
          className="text-xs font-bold text-gray-500 hover:text-[#1D349A] underline decoration-gray-300 underline-offset-2 decoration-2"
        >
          [See all]
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Slides */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((p) => (
            <div key={p.id} className="w-full flex-shrink-0">
              <Link
                href={`/${p.id}`}
                className="block hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-3">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  {p.originalPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      {formatPrice(p.originalPrice)}
                    </div>
                  )}
                  <div className="font-bold text-lg text-[#1D349A]">
                    {formatPrice(p.price)}
                  </div>
                  <div className="text-sm font-medium line-clamp-2 leading-tight">
                    {p.title}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {p.brand}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prevSlide() }}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#1D349A] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); nextSlide() }}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#1D349A] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex 
                  ? "w-4 bg-[#1D349A]" 
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
