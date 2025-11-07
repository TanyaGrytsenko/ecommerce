"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import type { ProductVariantImage } from "@/src/data/product-detail";

interface ProductGalleryProps {
  images: ProductVariantImage[];
  variantId: string;
  productName: string;
}

export default function ProductGallery({
  images,
  variantId,
  productName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [variantId]);

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section aria-label={`${productName} gallery`} className="space-y-4">
      <div className="lg:flex lg:items-start lg:gap-6">
        <div className="hidden max-h-[520px] shrink-0 flex-col gap-3 overflow-y-auto pr-2 lg:flex">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${variantId}-desktop-${image.src}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square w-24 overflow-hidden rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 ${
                  isActive
                    ? "border-dark-900"
                    : "border-transparent hover:border-dark-900"
                }`}
                aria-label={`View ${productName} image ${index + 1}`}
                aria-pressed={isActive}
              >
                <Image
                  src={image.src}
                  alt=""
                  width={120}
                  height={120}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          <div className="aspect-square overflow-hidden rounded-3xl bg-light-200">
            {activeImage ? (
              <Image
                key={`${variantId}-${activeImage.src}`}
                src={activeImage.src}
                alt={activeImage.alt}
                width={960}
                height={960}
                className="h-full w-full object-cover"
                priority
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto lg:hidden">
        {images.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={`${variantId}-mobile-${image.src}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 ${
                isActive
                  ? "border-dark-900"
                  : "border-transparent hover:border-dark-900"
              }`}
              aria-label={`View ${productName} image ${index + 1}`}
              aria-pressed={isActive}
            >
              <Image
                src={image.src}
                alt=""
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
