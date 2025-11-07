"use client";

import { useEffect, useMemo, useState } from "react";

import { useCart, useFavorites } from "@/src/components/providers/commerce-provider";

interface ProductActionsProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  selectedVariant: string;
  selectedVariantLabel: string;
  selectedSize: string | null;
}

export default function ProductActions({
  productId,
  slug,
  name,
  price,
  image,
  selectedVariant,
  selectedVariantLabel,
  selectedSize,
}: ProductActionsProps) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [error, setError] = useState<string | null>(null);

  const priceLabel = useMemo(() => `$${price.toFixed(2)}`, [price]);

  const isFavorited = isFavorite(productId);

  useEffect(() => {
    if (selectedSize) {
      setError(null);
    }
  }, [selectedSize]);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setError("Please select a size before adding to your bag.");
      return;
    }

    addToCart({
      productId,
      slug,
      name,
      price,
      variant: selectedVariant,
      variantLabel: selectedVariantLabel,
      size: selectedSize,
      image,
    });

    setError(null);
  };

  const handleFavorite = () => {
    toggleFavorite(productId);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleAddToBag}
        className="w-full rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:bg-dark-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
      >
        Add to Bag · {priceLabel}
      </button>

      <button
        type="button"
        onClick={handleFavorite}
        aria-pressed={isFavorited}
        className={`flex w-full items-center justify-center gap-2 rounded-full border border-dark-900 px-6 py-4 text-body-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 ${
          isFavorited
            ? "bg-dark-900 text-light-100"
            : "bg-transparent text-dark-900 hover:bg-light-200"
        }`}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={isFavorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21.35 10.55 20c-3.4-3.11-5.62-5.13-5.62-7.86a4.26 4.26 0 0 1 4.28-4.28 4.75 4.75 0 0 1 3 1.14 4.75 4.75 0 0 1 3-1.14 4.26 4.26 0 0 1 4.28 4.28c0 2.73-2.22 4.75-5.62 7.86Z"
          />
        </svg>
        <span>{isFavorited ? "Favorited" : "Favorite"}</span>
      </button>

      {error ? (
        <p
          role="alert"
          aria-live="assertive"
          className="text-body text-[var(--color-red)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
