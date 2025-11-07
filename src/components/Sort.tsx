"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  buildUrl,
  parseSearchParams,
  setQueryValue,
} from "@/src/lib/utils/query";

export interface SizeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SortProps {
  sizes: SizeOption[];
  sizeGuideHref?: string;
  className?: string;
}

export default function Sort({ sizes, sizeGuideHref, className }: SortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(
    () => parseSearchParams(searchParams.toString()),
    [searchParams]
  );

  const selectedSize = useMemo(() => {
    const value = query.size;

    if (!value) {
      return null;
    }

    if (Array.isArray(value)) {
      return value[0] ?? null;
    }

    return value;
  }, [query.size]);

  const handleSelect = useCallback(
    (value: string, disabled?: boolean) => {
      if (disabled) {
        return;
      }

      const isActive = selectedSize === value;
      const nextQuery = setQueryValue(query, "size", isActive ? null : value);
      const nextUrl = buildUrl(pathname, nextQuery);

      router.replace(nextUrl, { scroll: false });
    },
    [pathname, query, router, selectedSize]
  );

  return (
    <section className={className} aria-label="Select Size">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-caption uppercase tracking-wide text-dark-500">
            Select Size
          </p>
          <p className="text-body text-dark-700">
            {selectedSize ? `Size US ${selectedSize}` : "Select a size"}
          </p>
        </div>
        {sizeGuideHref ? (
          <a
            href={sizeGuideHref}
            className="text-body-medium text-dark-900 underline underline-offset-4 transition hover:text-dark-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
          >
            Size Guide
          </a>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {sizes.map((option) => {
          const isSelected = option.value === selectedSize;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value, option.disabled)}
              disabled={option.disabled}
              aria-pressed={isSelected}
              className={`flex h-12 items-center justify-center rounded-lg border text-body-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 ${
                option.disabled
                  ? "cursor-not-allowed border-light-300 bg-light-200 text-dark-500"
                  : isSelected
                  ? "border-dark-900 bg-dark-900 text-light-100"
                  : "border-light-300 bg-light-100 text-dark-900 hover:border-dark-900"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
