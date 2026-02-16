"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-16 h-16 border-2 rounded-md overflow-hidden transition-all ${
              selectedImage === index
                ? "border-[#1D349A]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative bg-gray-50 rounded-md overflow-hidden group">
        <button className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-full object-contain p-8"
        />

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`h-2 rounded-full transition-all ${
                selectedImage === index ? "w-8 bg-[#1D349A]" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
