"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Sort, { type SizeOption } from "@/src/components/Sort";
import {
  buildUrl,
  parseSearchParams,
  removeQueryKeys,
  setQueryValue,
} from "@/src/lib/utils/query";

export interface VariantOption {
  id: string;
  value: string;
  label: string;
  colorFamily: string;
  thumbnail: string;
}

interface FiltersProps {
  variants: VariantOption[];
  sizes: SizeOption[];
  defaultVariant: string;
  sizeGuideHref?: string;
}

export default function Filters({
  variants,
  sizes,
  defaultVariant,
  sizeGuideHref,
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const query = useMemo(
    () => parseSearchParams(searchParams.toString()),
    [searchParams]
  );

  const selectedColor = useMemo(() => {
    const value = query.color;

    if (!value) {
      return defaultVariant;
    }

    if (Array.isArray(value)) {
      return value[0] ?? defaultVariant;
    }

    return value;
  }, [defaultVariant, query.color]);

  const activeVariant = useMemo(
    () =>
      variants.find((variant) => variant.value === selectedColor) ??
      variants.find((variant) => variant.value === defaultVariant) ??
      variants[0],
    [defaultVariant, selectedColor, variants]
  );

  const handleVariantSelect = useCallback(
    (value: string) => {
      const isDefault = value === defaultVariant;
      const nextQuery = setQueryValue(query, "color", isDefault ? null : value);
      const nextUrl = buildUrl(pathname, nextQuery);

      router.replace(nextUrl, { scroll: false });
      setIsDrawerOpen(false);
    },
    [defaultVariant, pathname, query, router]
  );

  const handleClear = useCallback(() => {
    const nextQuery = removeQueryKeys(query, ["color", "size"]);
    router.replace(buildUrl(pathname, nextQuery), { scroll: false });
    setIsDrawerOpen(false);
  }, [pathname, query, router]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  const variantButtons = (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
      {variants.map((variant) => {
        const isActive = variant.value === activeVariant?.value;

        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => handleVariantSelect(variant.value)}
            aria-pressed={isActive}
            className={`flex flex-col items-center gap-2 rounded-2xl border bg-light-100 p-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 ${
              isActive
                ? "border-dark-900"
                : "border-transparent hover:border-dark-900"
            }`}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-light-200">
              <Image
                src={variant.thumbnail}
                alt={variant.label}
                fill
                sizes="(min-width: 1024px) 160px, (min-width: 640px) 120px, 100px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="text-body-medium text-dark-900">{variant.label}</p>
              <p className="text-caption text-dark-500">{variant.colorFamily}</p>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 md:hidden">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full border border-dark-900 px-4 py-2 text-body-medium text-dark-900 transition hover:bg-light-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        >
          Filters
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="text-body text-dark-500 underline underline-offset-4 transition hover:text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
        >
          Clear
        </button>
      </div>

      <section aria-label="Select Color" className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-caption uppercase tracking-wide text-dark-500">
              Select Color
            </p>
            <p className="text-body text-dark-700">
              {activeVariant ? activeVariant.label : "Choose a color"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="hidden text-body text-dark-500 underline underline-offset-4 transition hover:text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 md:inline"
          >
            Clear
          </button>
        </div>

        <div className="hidden lg:block">{variantButtons}</div>
        <div className="lg:hidden">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {variants.map((variant) => {
              const isActive = variant.value === activeVariant?.value;

              return (
                <button
                  key={`mobile-${variant.id}`}
                  type="button"
                  onClick={() => handleVariantSelect(variant.value)}
                  aria-pressed={isActive}
                  className={`flex w-36 flex-shrink-0 flex-col items-center gap-2 rounded-2xl border bg-light-100 p-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 ${
                    isActive
                      ? "border-dark-900"
                      : "border-transparent hover:border-dark-900"
                  }`}
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-xl bg-light-200">
                    <Image
                      src={variant.thumbnail}
                      alt={variant.label}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-caption text-dark-900">{variant.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="md:hidden">
        <Sort sizes={sizes} sizeGuideHref={sizeGuideHref} />
      </div>

      <div className="hidden md:block">
        <Sort sizes={sizes} sizeGuideHref={sizeGuideHref} />
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-dark-900/40"
            aria-hidden="true"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div
            className="w-80 max-w-full bg-light-100 p-6 shadow-xl sm:w-96"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-heading-3 text-dark-900">Filters</h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full p-2 text-dark-900 transition hover:bg-light-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-8 overflow-y-auto">
              <section className="space-y-4" aria-label="Select Color">
                <h3 className="text-body-medium text-dark-900">Select Color</h3>
                {variantButtons}
              </section>

              <Sort sizes={sizes} sizeGuideHref={sizeGuideHref} />
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="mt-6 w-full rounded-full border border-dark-900 px-4 py-3 text-body-medium text-dark-900 transition hover:bg-light-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
