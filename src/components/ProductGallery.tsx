"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import type { ProductVariant } from "@/src/data/product-details";
import { Check, ImageOff } from "lucide-react";

interface ProductGalleryProps {
  title: string;
  variants: ProductVariant[];
}

type NormalizedVariant = ProductVariant & {
  images: ProductVariant["images"];
};

export default function ProductGallery({ title, variants }: ProductGalleryProps) {
  const normalizedVariants = useMemo<NormalizedVariant[]>(() => {
    return variants
      .map((variant) => ({
        ...variant,
        images: variant.images.filter((image) => Boolean(image?.src?.trim?.())),
      }))
      .filter((variant) => variant.images.length > 0);
  }, [variants]);

  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (activeVariantIndex >= normalizedVariants.length) {
      setActiveVariantIndex(0);
    }
  }, [activeVariantIndex, normalizedVariants.length]);

  const activeVariant = normalizedVariants[activeVariantIndex];
  const totalImages = activeVariant?.images.length ?? 0;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeVariantIndex]);

  useEffect(() => {
    if (totalImages > 0 && activeImageIndex >= totalImages) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, totalImages]);

  const activeImage = activeVariant?.images[activeImageIndex];

  const handleGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!activeVariant || totalImages === 0) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveImageIndex((index) => (index + 1) % totalImages);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveImageIndex((index) => (index - 1 + totalImages) % totalImages);
    }
  };

  if (normalizedVariants.length === 0) {
    return (
      <section aria-label={`${title} gallery`} className="flex flex-col gap-6">
        <div className="aspect-[3/4] w-full animate-pulse rounded-3xl bg-light-200" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square w-full animate-pulse rounded-2xl bg-light-200"
            />
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-light-300 p-6">
          <ImageOff className="h-6 w-6 text-dark-500" aria-hidden />
          <p className="text-body text-dark-500">Images coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={`${title} gallery`} className="flex flex-col gap-6">
      <div
        className="flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)]"
        onKeyDown={handleGalleryKeyDown}
        role="group"
        tabIndex={0}
        aria-label="Product media carousel"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-light-200">
          {activeImage ? (
            <Image
              key={activeImage.id}
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="(min-width: 1024px) 540px, (min-width: 640px) 90vw, 100vw"
              className="object-cover"
              priority={activeVariantIndex === 0 && activeImageIndex === 0}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-dark-500">
              <ImageOff className="h-8 w-8" aria-hidden />
              <p className="text-body">Image unavailable</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2" role="list">
          {activeVariant.images.map((image, index) => {
            const isActive = index === activeImageIndex;

            return (
              <button
                key={image.id}
                type="button"
                role="listitem"
                onClick={() => setActiveImageIndex(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)] sm:h-24 sm:w-24 ${
                  isActive
                    ? "border-[color:var(--color-dark-900)] ring-1 ring-[color:var(--color-dark-900)]"
                    : "border-light-300"
                }`}
                aria-label={`View ${title} image ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <header className="flex flex-col gap-1">
          <p className="text-caption uppercase tracking-wide text-dark-500">Select Color</p>
          <h2 className="text-heading-3 text-dark-900">{activeVariant.label}</h2>
          <p className="text-body text-dark-700">{activeVariant.description}</p>
        </header>

        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Choose a colorway">
          {normalizedVariants.map((variant, index) => {
            const isSelected = index === activeVariantIndex;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setActiveVariantIndex(index)}
                className={`group relative flex h-16 w-16 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)] ${
                  isSelected
                    ? "border-[color:var(--color-dark-900)] ring-2 ring-[color:var(--color-dark-900)]"
                    : "border-light-300"
                }`}
                role="radio"
                aria-checked={isSelected}
                aria-label={`Select color ${variant.label}`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${variant.swatchClassName}`}
                />
                {isSelected ? (
                  <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-light-100 text-[color:var(--color-dark-900)] shadow">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
