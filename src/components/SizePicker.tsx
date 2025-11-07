"use client";

import { useState } from "react";

interface SizePickerProps {
  sizes: string[];
}

export default function SizePicker({ sizes }: SizePickerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <section aria-label="Select a size" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-caption uppercase tracking-wide text-dark-500">Select Size</p>
        <button
          type="button"
          className="text-caption font-medium text-dark-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)]"
        >
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Available sizes">
        {sizes.map((size) => {
          const isSelected = size === selectedSize;

          return (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`rounded-xl border px-4 py-3 text-body font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-dark-900)] ${
                isSelected
                  ? "border-[color:var(--color-dark-900)] bg-light-100 shadow-sm"
                  : "border-light-300 bg-light-100 hover:border-[color:var(--color-dark-900)]"
              }`}
              role="radio"
              aria-checked={isSelected}
            >
              US {size}
            </button>
          );
        })}
      </div>
    </section>
  );
}
